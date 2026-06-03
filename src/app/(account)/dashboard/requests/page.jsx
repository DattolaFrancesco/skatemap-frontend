'use client'

import SpotCard from "@/app/(main)/components/SpotCard";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import { useState, useEffect, useRef } from "react";
import useUserStore from "../components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Request(){
    const [spot,setSpot] = useState(null)
    const refresh = useUserStore((data)=> data.refresh)
    const setRefresh = useUserStore((data)=> data.setRefresh)
    const [askPermissionToUnApprove, setAskPermissionToUnApprove] = useState(false)
    const [askPermissionToApprove, setAskPermissionToApprove] = useState(false)
    const [message, setMessage] = useState({message:"",type:""})
    const [unApprovedSpot, setUnApprovedSpot] = useState(null)
    const [approvedSpot, setApprovedSpot] = useState(null)
    const [loading, setLoading] = useState(false)
    const setPendingSpots = useUserStore((data)=> data.setPendingSpots)
    const pendingSpots = useUserStore((data)=> data.pendingSpots)
    const smallContainerRef = useRef(null)
    const router = useRouter();
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    async function getSpots(){
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/pending`;
        try
        { const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        })
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSpot(data)
        }
        catch(error){
        console.log(error.message)
        }
    }
    async function approveSpot(spotId){
        setLoading(true)
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId.id}?status=approved`;
        try
        { const res = await fetch(url,{
        method:"PATCH",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        })
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRefresh(!refresh)
        setLoading(false)
        setAskPermissionToApprove(false)
        setPendingSpots(!pendingSpots)
        }
        catch(error){
        setLoading(false)
        setRefresh(!refresh)
        setAskPermissionToApprove(false)
        setPendingSpots(!pendingSpots)
        }

    }
    async function unApproveSpot(spotId){
        setLoading(true)
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId.id}?status=unapproved`;
        try
        { const res = await fetch(url,{
        method:"PATCH",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        })
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRefresh(!refresh)
        setLoading(false)
        setAskPermissionToUnApprove(false)
        setPendingSpots(!pendingSpots)
        }
        catch(error){
        console.log(error.message)
        setRefresh(!refresh)
        setLoading(true)
        setAskPermissionToUnApprove(false)
        setPendingSpots(!pendingSpots)
        }

    }
     function askConfermationUnApproved(spot){
         setAskPermissionToUnApprove(true)
         setUnApprovedSpot(spot)
    }
     function askConfermationApproved(spot){
         setAskPermissionToApprove(true)
        setApprovedSpot(spot)
    }
    useEffect(()=>{getSpots()},[refresh])
     const {contextSafe} = useGSAP(()=>{},{scope: smallContainerRef})
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
    }, { scope: smallContainerRef, dependencies: [spot] })
    const handleModify = contextSafe((s,e)=>{
        if (!smallContainerRef.current) return
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        gsap.killTweensOf(els)
        const spot = e.getBoundingClientRect()
        const tl = gsap.timeline()
        tl.to(e, {
            scale:2,
            x:window.innerWidth/2 -  spot.left - spot.width/2,
            y:window.innerHeight/2 -  spot.top - spot.height/2,
            zIndex:99999,
            ease: "power2.out"
        })
        .to(e,{
            yPercent:300,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                clearPendingHref()
                router.push(`/spot/modify/${s}`)
             }
        })
    })
    if(!spot || spot?.content?.length === 0) return <h1 className="text-2xl text-primary-500 ">You don't have any spot request to review</h1>
    return (
        <>
        <div className=" gap-1  py-3">
             {message.type === "bad" ?
               <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce"><h1 className="text-red-500 text-2xl px-3 py-1">{message.message}</h1></div>:null}
            {message.type === "good" ?
               <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce"><h1 className="bg-green-600 text-2xl px-3 py-1 text-white">{message.message}</h1></div>:null}
            <div className={` ${askPermissionToUnApprove ? "block" : "hidden"} fixed h-full  inset-0 z-50 bg-black/40 overflow-hidden`}>
                <div className="w-full h-full flex justify-center items-center" >
                  <div className={`bg-white ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-red-800 text-4xl p-5">do you realy want to not approve {unApprovedSpot?.name}?</h1>
                       <div className="flex justify-center gap-3 p-3">
                            <button onClick={()=>unApproveSpot(unApprovedSpot)} className="px-5">Yes</button>
                            <button onClick={()=>setAskPermissionToUnApprove(false)} className="px-5">No</button>
                       </div>
                  </div>
                </div>
            </div>
            <div className={` ${askPermissionToApprove ? "block" : "hidden"} fixed h-full  inset-0 z-50 bg-black/40 overflow-hidden`}>
                <div className="w-full h-full flex justify-center items-center" >
                  <div className={`bg-white ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-green-500 text-4xl p-5">do you realy want to  approve {approvedSpot?.name}?</h1>
                       <div className="flex justify-center gap-3 p-3">
                            <button onClick={()=>approveSpot(approvedSpot)} className="px-5">Yes</button>
                            <button onClick={()=>setAskPermissionToApprove(false)} className="px-5">No</button>
                       </div>
                  </div>
                </div>
            </div>
                <SpotDetails/>
                <div ref={smallContainerRef} className="grid_custom gap-1 py-3">
                    {spot.content?.map((s)=>(
                       <div  key={s.id} className="relative">
                        <SpotCard spot={s}/>
                       <div className="absolute top-1 right-1 text-sm md:text-base flex flex-col gap-1">
                            <button onClick={(()=> askConfermationApproved(s))}  className="text-sm md:text-base">APPROVE</button>
                            <button onClick={(()=> askConfermationUnApproved(s))}  className="text-sm md:text-base">DELETE</button>
                             <button onClick={(e)=>handleModify(s.id,e.currentTarget.closest(".relative"))} className=" nav-link text-sm md:text-base">MODIFY</button>
                       </div>
                        </div>
                    ))}
                </div>
        </div>
        {spot?.totalPages>1 &&<ArrowPageSelector totalPages={spot?.totalPages}/>}
    </>
    )
}
