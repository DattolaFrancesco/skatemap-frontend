'use client'
import ArrowPageSelector from "../components/ArrowPageSelector";
import SpotCard from "../components/SpotCard";
import SpotDetails from "../components/SpotDetails";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useNavigationStore from "../store/NavigationStore";
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
    const [data, setData] = useState(null)
    async function getSpot(){
        const params = await searchParams
        const query = new URLSearchParams(params) 
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/approved/all?${query.toString()}`;
        try
        { const res = await fetch(url,{
            method:"GET",
             headers: {
                "Content-Type": "application/json",
        }
        })
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setData(data)
        }
        catch(error){
            console.log(error.message)
            setStatusHref(false)
        }
    }
    useEffect(()=>{
        getSpot()
    },[])
    useGSAP(()=>{
        if(!data || !smallContainerRef.current) return
        console.log(statusHref)
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        gsap.killTweensOf(els)
        gsap.set(els,{yPercent:200, opacity:0})
        gsap.to(els, {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity", // remove append transform
            onComplete:()=>{
                 setStatusHref(false)
            }
        })
       },{scope:containerRef, dependencies:[data]})
     useEffect(()=>{
        if(!pendingHref) return
        if(!data || !smallContainerRef.current) return
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
                router.push(pendingHref)
            }
        })
     },[pendingHref])
    if(!data) return <h1 className="text-2xl px-2 text-primary-500">Server is not available</h1> 
    if(data?.content?.length === 0) return <h1 className="text-2xl px-2 text-primary-500">There aren't spot</h1> 
    return (
        <div ref={containerRef}>
            <SpotDetails/>
            <div ref={smallContainerRef}  className="grid_custom gap-1 px-2 py-0.5">
                {data.content.map((s)=>(
                    <SpotCard  key={s.id} spot={s}/>
                    ))}
            </div>
            {data?.totalPages>1 && <ArrowPageSelector totalPages={data?.totalPages}/>}
       </div>
    )
}