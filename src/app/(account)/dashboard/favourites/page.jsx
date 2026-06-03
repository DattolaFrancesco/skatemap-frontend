'use client'

import SpotCard from "@/app/(main)/components/SpotCard"
import { useEffect, useState, useRef } from "react"
import useUserStore from "../components/UserStore";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Favourites(){
    const [spots, setSpots] = useState(null)
    const refresh = useUserStore((data)=> data.refresh)
    const setRefresh = useUserStore((data)=> data.setRefresh)
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const smallContainerRef = useRef(null)
    async function getFav(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/all`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
            setSpots(data)
            console.log(data)
        }catch(err){
            console.log(err.message)
        }
    }
    async function deleteFav(spotId){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotId}`,{
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't connect to the server")
                getFav()
                setRefresh(!refresh)
        }catch(err){
            console.log(err.message)
            setRefresh(!refresh)
        }
    }

      useGSAP(() => {
        if (!smallContainerRef.current) return
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        if (!els.length) return
        gsap.killTweensOf(els)
        gsap.set(els, { yPercent: 200, opacity: 0 })
        gsap.to(els, {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity",
            onComplete: () => { setStatusHref(false) }
        })
    }, { scope: smallContainerRef, dependencies: [spots] })
    useEffect(()=>{getFav()},[refresh])
    if(!spots || spots.content.length === 0)return <h1 className="text-2xl text-primary-500">You don't have favourite spots</h1>
    return (
        <>
            <div ref={smallContainerRef} className="grid_custom gap-1  py-3">
                <SpotDetails/>
                    {spots.content.map((s)=>(
                       <div  key={s.id} className="relative">
                        <SpotCard spot={s}/>
                        </div>
                    ))}
            </div>
            {spots?.totalPages>1 &&<ArrowPageSelector totalPages={spots?.totalPages}/>}
            </>
    )
}