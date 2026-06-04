
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
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUser(data)
        } catch (err) {
            console.log(err.message)
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
            setAllowBotLocal(data.status)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function setBotStatus() {
        try {
            const res = await fetch(`${API}/bot/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (!res.ok) throw new Error("error")
        } catch (err) {
            console.log(err.message)
        }
    }

    const handleBotSwitch = () => {
        setAllowBotLocal(!allowBotLocal)
        clearInterval(swicthStatusRef.current)
        swicthStatusRef.current = setTimeout(() => {
            setBotStatus()
        }, 500);
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const savedBg = localStorage.getItem("BgTheme")
        if (savedTheme) setTheme(savedTheme)
        if (savedBg) setBgTheme(savedBg)
    }, [])

    useEffect(() => {
        document.documentElement.classList.remove(
            "theme-yellow", "theme-red", "theme-blue",
            "theme-green", "theme-violet", "theme-orange"
        )
        document.documentElement.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        document.documentElement.classList.remove("bg-white-custom", "bg-dark-custom")
        document.documentElement.classList.add(bgTheme)
        localStorage.setItem("BgTheme", bgTheme)
    }, [bgTheme])

    useEffect(() => { getUser(); getBotStatus() }, [])

    useGSAP(() => {
        if (!containerRef.current) return
        const els = gsap.utils.toArray(containerRef.current.children)
        if (!els.length) return
        gsap.set(els, { yPercent: 200, opacity: 0 })
        gsap.to(els, {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity"
        })
    }, { scope: containerRef, dependencies: [user] })

        useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        const els = gsap.utils.toArray(containerRef.current.children)
        gsap.to(els, {
            yPercent: 200,
            opacity: 0,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])
    return (
        <div ref={containerRef} className="flex flex-col">
            {user?.authorities[0].authority === "super_admin" && (
                <div className="flex justify-between py-2">
                    <p className={`bg-transparent text-xl text-primary font-bold ${allowBotLocal ? "" : "opacity-80"}`}>Chat Bot</p>
                    <input type="checkbox" id="switch" checked={allowBotLocal} onChange={handleBotSwitch} />
                    <label htmlFor="switch">Toggle</label>
                </div>
            )}
            <div className="flex justify-between py-2">
                <p className="bg-transparent text-xl text-primary font-bold">Theme</p>
                <select onChange={(e) => setTheme(e.target.value)} className="text-primary-500 font-bold" value={theme}>
                    <option value="theme-green">GREEN</option>
                    <option value="theme-yellow">YELLOW</option>
                    <option value="theme-red">RED</option>
                    <option value="theme-violet">VIOLET</option>
                    <option value="theme-blue">BLUE</option>
                    <option value="theme-orange">ORANGE</option>
                </select>
            </div>
            <div className="flex justify-between py-2">
                <p className="bg-transparent text-xl text-primary font-bold">Bg Theme</p>
                <select onChange={(e) => setBgTheme(e.target.value)} className="text-primary-500 font-bold" value={bgTheme}>
                    <option value="bg-white-custom">WHITE</option>
                    <option value="bg-dark-custom">DARK</option>
                </select>
            </div>
        </div>
    )
}
