'use client'
import SpotCard from "@/app/(main)/components/SpotCard";
import { useEffect, useState, useRef } from "react";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import useUserStore from "./components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


export default  function MySpots(){
    const [data, setData] = useState(null)
    const [status,setStatus] = useState(null)
    const [askPermission, setAskPermission] = useState(false)
    const setRefresh = useUserStore((data)=> data.setRefresh)
    const refresh = useUserStore((data)=> data.refresh)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({message:"",type:""})
    const [eliminationSpot, setEliminationSpot] = useState(null)
    const smallContainerRef = useRef(null)
    const router = useRouter();
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    setStatusHref(false)
    async function getSpots(){
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/own?${status?`status=${status}`:""}`;
        try
        { const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        })
        const datas = await res.json();
        if (!res.ok) throw new Error(data.message);
        setData(datas)
        }
        catch(error){
        console.log(error.message)
        }
    }
    function askConfermation(spot){
         setAskPermission(true)
         setEliminationSpot(spot)
    }

    async function deleteSpotById(spotId){
        setLoading(true)
    try{
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
      })
      if(!res.ok) throw new Error(data.message);
        getSpots()
        setLoading(false)
        setAskPermission(false)
        setMessage({message:`${eliminationSpot?.name} deleted successfully`, type:"good"})
        setTimeout(() => {
        setMessage({message:"",type:""}) 
        }, 3000);
         setRefresh(!refresh)
      }
      catch(err){
        setMessage({message:`${eliminationSpot?.name} deleting session went wrong, try again`, type:"bad"}); 
        setLoading(false);
        setAskPermission(false)}
         setRefresh(!refresh)
         setTimeout(() => {
         setMessage({message:"",type:""}) 
         }, 3000);
    }
    useEffect(()=>{getSpots()},[status])
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
    }, { scope: smallContainerRef, dependencies: [data] })
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

    if(!data) return <h1 className=" text-2xl animate-pulse text-primary-500">Loading spots...</h1> 
        return  ( 
            <div>
               {message.type === "bad" ?
               <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce"><h1 className="text-red-500 text-2xl px-3 py-1">{message.message}</h1></div>:null}
               {message.type === "good" ?
               <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce"><h1 className="bg-green-600 text-2xl px-3 py-1 text-white">{message.message}</h1></div>:null}
                <div className={` ${askPermission ? "block" : "hidden"} fixed h-full  inset-0 z-50 bg-black/40 overflow-hidden`}>
                <div className="w-full h-full flex justify-center items-center" >
                  <div className={`bg-white ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-red-800 text-4xl p-5">do you realy want to delete {eliminationSpot?.name}?</h1>
                       <div className="flex justify-center gap-3 p-3">
                            <button onClick={()=>deleteSpotById(eliminationSpot.id)} className="px-5">Yes</button>
                            <button onClick={()=>setAskPermission(false)} className="px-5">No</button>
                       </div>
                  </div>
                </div>
                </div>
                    <div className=" flex  gap-1 pt-2">
                        <button onClick={()=>status === "approved"?setStatus(null):setStatus("approved")}
                            className={`text-sm md:text-base ${status === "approved"?"bg-primary-500":""}`}>APPROVED</button>
                        <button onClick={()=>status === "pending"?setStatus(null):setStatus("pending")}
                            className={`text-sm md:text-base ${status === "pending"?"bg-primary-500":""}`}>PENDING</button>
                        <button onClick={()=>status === "unapproved"?setStatus(null):setStatus("unapproved")}
                            className={`text-sm md:text-base ${status === "unapproved"?"bg-primary-500":""}`}>UNAPPROVED</button>
                </div>
                <SpotDetails/>
                <div ref={smallContainerRef} className="grid_custom gap-1 pt-2 relative">
                   {data.content.length === 0 && <h1 className="absolute text-2xl mt-2 text-primary-500">You don't have any spot that satisfy the filters</h1>}
                    {data.content.map((s)=>(
                        <div  key={s.id} className="relative">
                        <SpotCard spot={s}/>
                        <div className="absolute top-1 right-1 text-sm md:text-base flex flex-col gap-1">
                            <button onClick={(()=> askConfermation(s))} >DELETE</button>
                            <button onClick={(e)=>handleModify(s.id,e.currentTarget.closest(".relative"))} className=" nav-link text-sm md:text-base">MODIFY</button>
                        </div>
                        <div className={`absolute top-1 left-1 text-sm md:text-base px-1 
                            ${s.status === "APPROVED"?"bg-green-300":""}
                                ${s.status === "PENDING"?"bg-orange-300 animate-pulse":""}
                                ${s.status === "UNAPPROVED"?"bg-red-400":""}`}>{s.status}</div>
                        </div>
                        ))}
                </div>
                 {data?.totalPages>1 &&<ArrowPageSelector totalPages={data?.totalPages}/>}
            </div>
        )
}