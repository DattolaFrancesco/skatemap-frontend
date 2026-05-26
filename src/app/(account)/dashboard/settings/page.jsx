'use client'
import useChatStore from "@/app/(main)/store/ChatStore"
import useThemeStore from "../components/ThemesStore"
import { useEffect, useState } from "react"

export default function Settings(){
    const setAllowBot = useChatStore((data)=>data.setAllowBot)
    const allowBot = useChatStore((data)=>data.allowBot)
    const theme = useThemeStore((data)=>data.theme)
    const setTheme = useThemeStore((data)=>data.setTheme)
    const bgTheme = useThemeStore((data)=>data.bgTheme)
    const setBgTheme = useThemeStore((data)=>data.setBgTheme)
    const [user,setUser] = useState(null)
    async function getUser() {
    try {
      const res = await fetch("http://localhost:3003/account", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data)
    } catch(err) {
      console.log(err.message)
    }
    }
      // LOAD
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const savedBg = localStorage.getItem("BgTheme")
        if(savedTheme) setTheme(savedTheme)
        if(savedBg) setBgTheme(savedBg)
    }, [])

   // THEME
    useEffect(() => {
        document.documentElement.classList.remove(
            "theme-yellow",
            "theme-red",
            "theme-blue",
            "theme-green",
            "theme-violet",
            "theme-orange"
        )
        document.documentElement.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme])
    useEffect(() => {
        document.documentElement.classList.remove(
            "bg-white-custom",
            "bg-dark-custom"
        )
        document.documentElement.classList.add(bgTheme)
        localStorage.setItem("BgTheme", bgTheme)
}, [bgTheme])
    useEffect(()=>{getUser()},[])
    return(
      <div className="flex flex-col">
            {user?.authorities[0].authority === "super_admin" && <div className="flex justify-between py-2  border-b ">
                <p className={`bg-transparent text-xl text-primary font-bold${allowBot?"":"opacity-50"}`}>Chat Bot</p>
                <input type="checkbox" id="switch" checked={allowBot} onChange={()=>setAllowBot(!allowBot)}/><label htmlFor="switch">Toggle</label>
            </div>}
            <div className="flex justify-between py-2   border-b ">
                <p className={`bg-transparent text-xl text-primary font-bold `}>Theme</p>
                <select onChange={(e)=>setTheme(e.target.value)} className="text-primary-500" value={theme}>
                    <option value="theme-green">GREEN</option>
                    <option value="theme-yellow">YELLOW</option>
                    <option value="theme-red">RED</option>
                    <option value="theme-violet">VIOLET</option>
                    <option value="theme-blue">BLUE</option>
                    <option value="theme-orange">ORANGE</option>
                </select>
            </div>
            <div className="flex justify-between py-2   border-b ">
                <p className={`bg-transparent text-xl text-primary font-bold `}>Bg Theme</p>
                <select onChange={(e)=>setBgTheme(e.target.value)} className="text-primary-500" value={bgTheme}>
                    <option value="bg-white-custom">WHITE</option>
                    <option value="bg-dark-custom">DARK</option>
                </select>
            </div>
      </div>
    )
}