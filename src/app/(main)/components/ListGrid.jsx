'use client'
import { useRef, useEffect, useState } from "react";
import SpotCard from "../components/SpotCard";
import useSpotStore from "../store/SpotStore";
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Draggable } from "gsap/Draggable";
import Details from "./Details";

gsap.registerPlugin(Draggable)

export default function ListGrid({position}) {
    const filteredSpot = useSpotStore((data)=>data.filteredSpot)
    const listRef = useRef(null)
    const [isMobile, setIsMobile] = useState(false)
    const activeSpot = useSpotStore((data)=>data.spot)

    useGSAP(() => {
        if (listRef.current) {
            Draggable.create(listRef.current, {
                type: "y",          
                bounds: { minY: -(window.innerHeight-(window.innerHeight)*0.4), maxY: 0 }
        })
        }

    }, { scope: listRef, dependencies: [] })
    useEffect(() => {
            const check = () => setIsMobile(window.innerWidth < 768)
            check()
            window.addEventListener('resize', check)
            return () => window.removeEventListener('resize', check)
    }, [])

    if(filteredSpot?.length == 0) return null
    if(position === "absolute"){
    return (
            <div ref={listRef} className="mx-2 z-10 button--glass button  relative top-[60%] p-1.5 mt-1 flex flex-col gap-1.5 overflow-y-scroll h-[calc(100vh-70px)] ">
                <div className="w-[50px] h-[4px] shrink-0 bg-black/20 rounded-2xl my-2"></div>
                {!activeSpot && filteredSpot?.map((s) => (
                    <SpotCard key={s.id} spot={s}/>
                ))}
                <Details postion={"mobile"}/>
            </div>
    )}
    else{
        return (
            <div className="z-10 button--glass button p-1.5 mt-1 flex flex-col gap-1.5 overflow-y-scroll max-h-[calc(100vh-70px)] relative">
                {filteredSpot?.map((s) => (
                    <SpotCard key={s.id} spot={s}/>
                ))}
            </div>
    )}
}