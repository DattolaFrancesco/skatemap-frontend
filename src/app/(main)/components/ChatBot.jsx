'use client'
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';
import {  useState , useRef, useEffect} from "react";
import TextareaAutosize from "react-textarea-autosize";
import useChatStore from './ChatStore';


export default function ChatBot(){
    const chat = useChatStore((data)=>data.chat)
    const setChat = useChatStore((data)=>data.setChat)
    const [lastResponse, setLastResponse] = useState([])
    const [lastPrompt, setLastPrompt] = useState("")
    const [openChat, setOpenChat] = useState(false)
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef(null)
    async function getChat(){
    const url = `${process.env.NEXT_PUBLIC_API_URL}/bot/test`;
    try{
        const res = await fetch(url,{
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lastPrompt)
        })
        if(!res.ok) throw new Error("bot not available")
        const reader = res.body.getReader() // reading the data stream
        const decoder = new TextDecoder() //convert bit in string
        let fullResponse = ""
        while(true){// infinite until somebody break it
            const {done,value} = await reader.read() // done if its finished and value the new data chunk
            if(done) break // if true break the loop
            setLastResponse((prev)=>[...prev,decoder.decode(value)])
            fullResponse += decoder.decode(value)
        }
        return fullResponse;
    }
    catch(err){
        console.log(err.message)
    }}
    async function handleSubmit(e){
        setLoading(true)
        e.preventDefault()
        setChat(prev=>[...prev,{role:"user",message:lastPrompt}])
        setLastPrompt("")
        const res = await getChat()
        setChat(prev=>[...prev,{role:"bot",message:res}])
        setLastResponse([])
        setLoading(false)
    }
    useEffect(()=>{
        chatEndRef.current?.scrollTo({
            top:chatEndRef.current.scrollHeight,
            behavior: "smooth"
        })
    },[chat])
    return (
        <div className="relative z-[9999]">
                <button onClick={()=>setOpenChat(!openChat)} className="w-full text-start flex">
                    Say something <span className='ms-auto'>{!openChat ? <ChevronDown/>: <ChevronUp/>}</span></button>
            <div className={`${openChat?"h-[300px] md:h-[500px] border bg-white opacity-100":"h-0 opacity-0"} absolute min-w-[250px] sm:min-w-full flex flex-col justify-between 
            overflow-hidden transition-all duration-300  p-1 mt-1`}>
                <div ref={chatEndRef} className="w-full overflow-y-scroll py-3">
                    {chat && chat?.map((m,index)=>(<p key={index} className={` wrap-break-word p-2 text-sm w-4/5 m-1 
                        ${m.role === "bot"?"bg-black/20 me-auto":"ms-auto bg-black/50"} rounded-sm`}>{m.message}</p>))}
                     {lastResponse.length>0 && <p className="bg-black/20 wrap-break-word p-2 text-sm w-4/5 m-1 me-auto rounded-sm">{lastResponse}</p>}
                </div>
              <form className={`flex gap-1 ${loading?"animate-pulse":""}`} onSubmit={handleSubmit}>
                <TextareaAutosize minRows={1} value={lastPrompt} placeholder='have a chat!' onChange={(e)=>{setLastPrompt(e.target.value)}}
                onKeyDown={(e)=>{
                    if(e.key === "Enter")handleSubmit(e)}}
                className="w-full rounded-sm placeholder:px-1  placeholder:text-sm  focus:outline-none focus:ring-0 resize-none border bg-black/10"/>
                <button type='submit' disabled={loading} className={`rounded-sm`}>Send</button>
              </form>
            </div>
        </div>
    )
}