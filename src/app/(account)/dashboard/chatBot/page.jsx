'use client'
import useChatStore from "@/app/(main)/store/ChatStore"
import { useEffect } from "react"
export default function ChatBot(){
    const setAllowBot = useChatStore((data)=>data.setAllowBot)
    const allowBot = useChatStore((data)=>data.allowBot)
    useEffect(()=>{},[allowBot])
    return(
      <div>
            <h1 className="text-3xl">SETTING</h1>
            <div className="flex justify-between py-2 border-t border-b ">
                <p className={`bg-transparent text-xl ${allowBot?"":"opacity-50"}`}>Chat Bot</p>
                <input type="checkbox" id="switch" checked={allowBot} onChange={()=>setAllowBot(!allowBot)}/><label htmlFor="switch">Toggle</label>
            </div>
      </div>
    )
}