'use client'
import useThemeStore from "../components/ThemesStore"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Settings() {
    const theme = useThemeStore((data) => data.theme)
    const setTheme = useThemeStore((data) => data.setTheme)
    const bgTheme = useThemeStore((data) => data.bgTheme)
    const setBgTheme = useThemeStore((data) => data.setBgTheme)
    const [user, setUser] = useState(null)
    const swicthStatusRef = useRef(null)
    const [allowBotLocal, setAllowBotLocal] = useState(false)
    const containerRef = useRef(null)
    const router = useRouter();
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);

    async function getUser() {
        try {
            const res = await fetch(`${API}/account`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUser(data)
        } catch (err) { console.log(err.message) }
    }

    async function getBotStatus() {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/bot/get/status`;
        try {
            const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            const data = await res.json()
            if (!res.ok) throw new Error("the bot is skating right now!, try later")
            setAllowBotLocal(data.status)
        } catch (err) { console.log(err.message) }
    }

    async function setBotStatus() {
        try {
            const res = await fetch(`${API}/bot/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (!res.ok) throw new Error("error")
        } catch (err) { console.log(err.message) }
    }

    const handleBotSwitch = () => {
        setAllowBotLocal(!allowBotLocal)
        clearInterval(swicthStatusRef.current)
        swicthStatusRef.current = setTimeout(() => { setBotStatus() }, 500)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const savedBg = localStorage.getItem("BgTheme")
        if (savedTheme) setTheme(savedTheme)
        if (savedBg) setBgTheme(savedBg)
    }, [])

    useEffect(() => {
        document.documentElement.classList.remove("theme-yellow", "theme-red", "theme-blue", "theme-green", "theme-violet", "theme-orange")
        document.documentElement.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        document.documentElement.classList.remove("bg-white-custom", "bg-dark-custom", "bg-bg-black", "bg-bg-white")
        document.documentElement.classList.add(bgTheme)
        if (bgTheme === "bg-dark-custom") document.documentElement.classList.add("bg-bg-black")
        else document.documentElement.classList.add("bg-bg-white")
        localStorage.setItem("BgTheme", bgTheme)
    }, [bgTheme])

    useEffect(() => { getUser(); getBotStatus() }, [])

    useGSAP(() => {
        if (!containerRef.current) return
        const els = gsap.utils.toArray(containerRef.current.children)
        if (!els.length) return
        gsap.set(els, { yPercent: 200, opacity: 0 })
        gsap.to(els, { yPercent: 0, opacity: 1, duration: 0.2, stagger: 0.1, ease: "power2.out", clearProps: "transform,opacity" })
    }, { scope: containerRef, dependencies: [user] })

    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        const els = gsap.utils.toArray(containerRef.current.children)
        gsap.to(els, {
            yPercent: 200, opacity: 0, duration: 0.75, ease: "power3.inOut",
            onComplete: () => { clearPendingHref(); router.push(pendingHref) }
        })
    }, [pendingHref])

    return (
        <div ref={containerRef} className="flex flex-col gap-2 p-3">
            {user?.authorities[0].authority === "super_admin" && (
                <div className="button--glass button p-2 rounded-[5px] flex justify-between items-center gap-4">
                    <div className="bg_login rounded-[5px] px-2 py-1">
                        <p className="text-xs font-bold tracking-widest">CHAT BOT</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] tracking-widest text-black/40">
                            {allowBotLocal ? "ON" : "OFF"}
                        </p>
                            <div
                                onClick={handleBotSwitch}
                                style={{ backgroundColor: allowBotLocal ? 'rgba(34,197,94)' : '' }}
                                className="relative w-10 h-5 rounded-full cursor-pointer transition-all duration-300 button--glass button"
                            >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg_login transition-all duration-300
                                ${allowBotLocal ? "left-5" : "left-0.5"}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}