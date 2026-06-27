'use client'
import Image from 'next/image'
import TransitionLink from './TransitionLink'
import { useEffect, useState } from 'react'
export default function NavBarRight(){
    
    const [isMobile, setIsMobile] = useState(false)
      useEffect(() => {
            const check = () => setIsMobile(window.innerWidth < 768)
            check()
            window.addEventListener('resize', check)
            return () => window.removeEventListener('resize', check)
        }, [])
    return(
        <div className={`absolute z-9 ${isMobile ? "bottom-5 right-5" : "top-5 right-5"}  button--glass button p-1.5 flex justify-center items-center gap-1`}>
            <TransitionLink className="aspect-square w-[18px] rounded-[5px]" href={`/dashboard`}><Image  src={`/structure/login.svg`} width={12} height={12} alt={"profile svg"} /></TransitionLink>
            <button className="aspect-square w-[18px] rounded-[5px]"><p>?</p></button>
        </div>
    )
}