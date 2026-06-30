'use client'
import { ChevronDown, ChevronUp, Send, Dot } from 'lucide-react';
import { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useChatStore from '../store/ChatStore';

export default function ChatBot() {
    const chat = useChatStore((data) => data.chat)
    const setChat = useChatStore((data) => data.setChat)
    const [allowBot, setAllowBot] = useState(false)
    const [lastResponse, setLastResponse] = useState([])
    const [lastPrompt, setLastPrompt] = useState("")
    const [openChat, setOpenChat] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(false)
    const chatEndRef = useRef(null)
    const [isMobile, setIsMobile] = useState(false)

    async function getChat() {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/bot/ask`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lastPrompt)
            })
            if (!res.ok) throw new Error("the bot is skating right now!, try later")
            setLoadingMessage(false)
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let fullResponse = ""
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                setLastResponse((prev) => [...prev, decoder.decode(value)])
                fullResponse += decoder.decode(value)
            }
            return fullResponse;
        } catch (err) {
            setLoadingMessage(false)
            return err.message
        }
    }

    async function getBotStatus() {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/bot/get/status`;
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            if (!res.ok) throw new Error("the bot is skating right now!, try later")
            setAllowBot(data.status)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function handleSubmit(e) {
        setLoading(true)
        setLoadingMessage(true)
        e.preventDefault()
        setChat(prev => [...prev, { role: "user", message: lastPrompt }])
        setLastPrompt("")
        const res = await getChat()
        setChat(prev => [...prev, { role: "bot", message: res }])
        setLastResponse([])
        setLoading(false)
    }

    useEffect(() => {
        chatEndRef.current?.scrollTo({
            top: chatEndRef.current.scrollHeight,
            behavior: "smooth"
        })
    }, [chat])

    useEffect(() => { getBotStatus() }, [])

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const panelBase = `
        absolute bottom-full mb-3
        ${isMobile ? "left-[-6]" : "right-[-6]"}
        min-w-[270px] w-[300px] md:w-[320px]
        flex flex-col justify-between
        overflow-hidden
        transition-all duration-300
        button--glass
        rounded-[8px]
        p-2
    `
    const panelOpen  = "h-[300px] md:h-[500px] opacity-100 pointer-events-auto"
    const panelClosed = "h-0 opacity-0 pointer-events-none"

    return (
        <div className={`absolute z-9 ${isMobile ? "left-5" : "right-5"} bottom-5 button--glass button p-1.5 rounded-[6px]`}>
            <div className="relative">
                <button
                    onClick={() => setOpenChat(!openChat)}
                    className="w-full text-start flex items-center rounded-[5px] px-1 gap-1"
                >
                    <p className='animate-pulse'><Dot  size={12} strokeWidth={8}/></p>
                    <p>AI Chat</p>
                    <span className="ms-auto">
                        {openChat ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                    </span>
                </button>
                {allowBot ? (
                    <div className={`${panelBase} ${openChat ? panelOpen : panelClosed}`}>
                        <div ref={chatEndRef} className="flex-1 overflow-y-auto py-2 flex flex-col gap-1">
                            {chat && chat.map((m, index) => (
                                <p
                                    key={index}
                                    className={`
                                        break-words p-2  w-4/5 mx-1 rounded-[5px] text-white
                                        ${m.role === "bot"
                                            ? "me-auto bg-gray-400! border border-white/10"
                                            : "ms-auto bg-gray-500!  backdrop-blur-[80px]"}
                                    `}
                                >
                                    {m.message}
                                </p>
                            ))}

                            {lastResponse.length > 0 && (
                                <p className="break-words p-2  w-4/5 mx-1 me-auto rounded-[5px] text-white bg-gray-500! backdrop-blur-xl border border-white/10">
                                    {lastResponse}
                                </p>
                            )}

                            {loadingMessage && (
                                <p className="break-words p-2  w-4/5 mx-1 me-auto rounded-[5px] text-white bg-gray-400! backdrop-blur-xl border border-white/10 animate-pulse">
                                    ...
                                </p>
                            )}
                        </div>
                        <form
                            className={`flex gap-1 mt-1 ${loading ? "animate-pulse" : ""}`}
                            onSubmit={handleSubmit}
                        >
                            <TextareaAutosize
                                minRows={1}
                                value={lastPrompt}
                                placeholder="have a chat!"
                                onChange={(e) => setLastPrompt(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e) }}
                                className="
                                    w-full rounded-[5px]
                                     placeholder:
                                    text-[12px]
                                    focus:outline-none focus:ring-0
                                    resize-none
                                    button--glass
                                    px-2 py-1
                                "
                            />
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="button--glass rounded-[5px] h-full aspect-square disabled:opacity-40 flex justify-center items-center"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                        </form>
                    </div>

                ) : (
                    <div className={`${panelBase} ${openChat ? panelOpen : panelClosed}`}>

                        <div className="flex-1 overflow-y-auto py-2">
                            <p className="button--glass bg-gray-400! break-words p-2  w-4/5 mx-1 me-auto rounded-[5px] text-white">
                                I'm skating right now. Gonna try a 12-stair set. I'll be back... hopefully! Meanwhile, have a look around.
                            </p>
                        </div>

                        <form
                            className="flex gap-1 mt-1"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <TextareaAutosize
                                minRows={1}
                                value={lastPrompt}
                                disabled
                                placeholder="He'll be back soon..."
                                className="
                                    w-full rounded-[5px]
                                    placeholder:py-0.5 placeholder:
                                    focus:outline-none focus:ring-0
                                    resize-none
                                    button--glass
                                    px-2 py-1 
                                    opacity-50 cursor-not-allowed
                                "
                            />
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled
                                    className="button--glass rounded-[5px] h-fit p-1.5 opacity-40 cursor-not-allowed"
                                >
                                    <Send size={12} />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}