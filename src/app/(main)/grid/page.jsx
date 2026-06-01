'use client'
import ArrowPageSelector from "../components/ArrowPageSelector";
import SpotCard from "../components/SpotCard";
import SpotDetails from "../components/SpotDetails";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useNavigationStore from "../store/NavigationStore";
import useSpotStore from "../store/SpotStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default  function Grid({ searchParams }){
    const router = useRouter();
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const statusHref = useNavigationStore((state) => state.statusHref);
    const containerRef = useRef(null)
    const smallContainerRef = useRef(null)
    const errorRef = useRef(false)
    const reset = useSpotStore((data)=>data.reset)
    const setReset = useSpotStore((data)=>data.setReset)
    const firstRender = useSpotStore((data)=>data.firstRenderGrid)
    const setFirstRender = useSpotStore((data)=>data.setFirstRenderGrid)
    const spotStore = useSpotStore((data)=>data.spotGrid)
    const setSpotStore = useSpotStore((data)=>data.setSpotGrid)
    const firstSpotStore = useSpotStore((data)=>data.firstSpotGrid)
    const setFirstSpotStore = useSpotStore((data)=>data.setFirstSpotGrid)
    async function getSpot(){
        const params = await searchParams
        const query = new URLSearchParams(params)
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/approved/all?${query.toString()}`;
        console.log(reset)
        query.delete('_t')
        if(query.toString() === "" && firstRender == 1) return
         setFirstRender(1)
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            if(firstRender === 0 && firstSpotStore == null && query.toString() !== "") {
                await getAllSpot()
                setSpotStore(data)
            }
            if(firstRender === 0 && query.toString() === "") {
                setFirstSpotStore(data)
                setSpotStore(data)
            } else {
                setSpotStore(data)
                setReset(false)
            }
            console.log("fetch degli spot - grid")
        } catch(error) {
            console.log(error.message)
            errorRef.current = true;
            clearPendingHref()
            setStatusHref(false)
        }
    }
    async function getAllSpot(){
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/approved/all`;
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
           setFirstSpotStore(data)
        } catch(error) {
            console.log(error.message)
            errorRef.current = true;
            clearPendingHref()
            setStatusHref(false)
        }
    }
    useEffect(()=>{
        //setReset(false)
        getSpot()
    },[searchParams])
    useGSAP(()=>{
        if(!spotStore || !smallContainerRef.current) return
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        gsap.killTweensOf(els)
        gsap.set(els,{yPercent:200, opacity:0})
        gsap.to(els, {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity",
            onComplete:()=>{
                 setStatusHref(false)
            }
        })
       },{scope:containerRef, dependencies:[spotStore,reset]})
       function returnSafe(){
        clearPendingHref()
        router.push(pendingHref)
       }
     useEffect(()=>{
        if(!pendingHref) return
        if(errorRef.current) return returnSafe()
        if(!spotStore || !smallContainerRef.current) return
        setStatusHref(true)
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        gsap.killTweensOf(els)
        gsap.to(els, {
            yPercent: 200,
            opacity: 0,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.in",
            onComplete: () => {
                clearPendingHref()
                setFirstRender(0)
                router.push(pendingHref)
            }
        })
     },[pendingHref])
    if(!spotStore) return <h1 className="text-2xl px-2 text-primary-500">Server is not available</h1> 
    if(spotStore?.content?.length === 0 && !reset) return <h1 className="text-2xl px-2 text-primary-500">There aren't spot</h1> 
    const displaySpots = reset ? firstSpotStore : spotStore

    return (
        <div ref={containerRef}>
            <SpotDetails/>
            <div ref={smallContainerRef} className="grid_custom gap-1 px-2 py-0.5">
                {displaySpots?.content?.map((s) => (
                    <SpotCard key={s.id} spot={s}/>
                ))}
            </div>
            {displaySpots?.totalPages > 1 && <ArrowPageSelector totalPages={displaySpots?.totalPages}/>}
        </div>
    )
}