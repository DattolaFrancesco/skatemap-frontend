'use client'
import useChatStore from "@/app/(main)/store/ChatStore"
import { useEffect, useState } from "react"
export default function Settings(){
    const setAllowBot = useChatStore((data)=>data.setAllowBot)
    const allowBot = useChatStore((data)=>data.allowBot)
    const [theme,setTheme] = useState(localStorage.getItem("theme") || "theme-yellow")
    useEffect(()=>{},[allowBot])
    useEffect(()=>{
        document.querySelector("html").classList.remove(
                "theme-yellow",
                "theme-red",
                "theme-blue",
                "theme-green",
                "theme-orange"
        )
        document.querySelector("html").classList.add(theme)
        localStorage.setItem("theme",theme)
    },[theme])
    return(
      <div className="flex flex-col">
            <div className="flex justify-between py-2 border-b ">
                <p className={`bg-transparent text-xl text-primary ${allowBot?"":"opacity-50"}`}>Chat Bot</p>
                <input type="checkbox" id="switch" checked={allowBot} onChange={()=>setAllowBot(!allowBot)}/><label htmlFor="switch">Toggle</label>
            </div>
            <div className="flex justify-between py-2 border-b ">
                <p className={`bg-transparent text-xl text-primary `}>Theme</p>
                <select onChange={(e)=>setTheme(e.target.value)} value={theme}>
                    <option value="theme-yellow">YELLOW</option>
                    <option value="theme-red">RED</option>
                    <option value="theme-blue">BLUE</option>
                    <option value="theme-green">GREEN</option>
                    <option value="theme-orange">ORANGE</option>
                </select>
            </div>
      </div>
    )
}