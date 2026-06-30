'use client'

import Weather from "./Weather";
import { useEffect, useRef, useState } from "react";
import { GalleryVerticalEnd, Heart, HeartCrack, MoveLeft } from 'lucide-react';
import useSpotStore from "../store/SpotStore";
import useUserStore from "@/app/(account)/dashboard/components/UserStore";
import useInsetStore from "../store/InsetStore";
import Image from 'next/image'
import CarouselVideo from "./CarouselVideo";
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { usePathname, useRouter } from "next/navigation"
import JSZip from 'jszip'

const structuresName = ["ledge", "rail", "ramp", "stair"]

export default function Details({postion}){
    const pathname = usePathname()
    const router = useRouter()
    const setRefreshy = useUserStore((state)=>state.setRefresh)
    const spot = useSpotStore((data)=>data.spot)
    const setSpot = useSpotStore((data)=>data.setSpot)
    const refreshy = useUserStore((data)=>data.refresh)
    const [data, setData] = useState(null)
    const [refresh,setRefresh] =useState(null)
    const [liked, setLiked] =useState(null)
    const [token, setToken] = useState(null)
    const likedPending = useRef(false)
    const [expanded, setExpanded] = useState(false)
    const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    const containerRef = useRef(null)
    const detailsRef = useRef(null)
    const [spotClosed,setSpotClosed] = useState(false)
    const [downloadingVideos, setDownloadingVideos] = useState(false)
    const isFirstPathnameMount = useRef(true)
    
    async function getSpot(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/single/${spot}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
                console.log(data,"getSpot")
            setData(data)
        }catch(err){
            console.log(err.message)
        }
    }
    async function getFav(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spot}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok){
                if(data.message.includes("token")){console.log("You can't like post if you aren't logged in!")}
                throw new Error()
            }
            setLiked(data)
        }catch(err){
            console.log(err.message)
        } finally {
            likedPending.current = false
        }
    }
    async function setFav(){
        if(likedPending.current) return
        likedPending.current = true
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spot}`,{
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't set fav")
            setRefresh(!refresh)
            setRefreshy(!refreshy)
            setLiked(true)
        }catch(err){
            console.log(err.message)
            setRefresh(!refresh)
            setRefreshy(!refreshy)
        } finally {
            likedPending.current = false
        }
    }
        async function deleteFav(){
        if(likedPending.current) return
        likedPending.current = true
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spot}`,{
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't delete fav")
            if(pathname === "/dashboard/favourites") {
                setData(null)       
                setSpot(null)  
                const p = new URLSearchParams(window.location.search)
                p.delete("selectedSpot")
                router.push(`?${p.toString()}`, { scroll: false })
            }
        } catch(err){
            console.log(err.message)
        } finally {
            setLiked(null)
            setRefreshy(!refreshy) 
            likedPending.current = false
        }
    }
    function Description(){
    return(
    <div className="py-2 border_b_gray ">
        <p className={`color_p_gray wrap-break-word ${!expanded ? "line-clamp-3" : ""}`}>
            {data.description}
        </p>
        {data.description.length > 100 && <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs color_p_gray p-0"
        >
            {expanded ? "See less" : "See more"}
        </button>}
    </div>)
    }
    async function handleShare(){
        try{
            await navigator.share({
                title: data.name.slice(0, 1).toUpperCase() + data.name.slice(1),
                text: "Have a look of this spot",
                url: `${process.env.NEXT_PUBLIC_API_URL2}/?selectedSpot=${data.id}&_t=${Date.now()}`
            })
        }catch(err) {console.log("share error")}
    }
    async function downloadAllVideos(){
        if(!data?.video?.length || downloadingVideos) return
        setDownloadingVideos(true)
        try{
            const zip = new JSZip()
            const folder = zip.folder(`${data.name || 'spot'}-videos`)

            for(let i = 0; i < data.video.length; i++){
                const vid = data.video[i]
                try{
                    const res = await fetch(vid.link)
                    const blob = await res.blob()
                    folder.file(`video-${i + 1}.mp4`, blob)
                }catch(err){
                    console.log("fetch error", err)
                }
            }

            const zipBlob = await zip.generateAsync({ type: "blob" })
            const url = URL.createObjectURL(zipBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${data.name || 'spot'}-videos.zip`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        } finally {
            setDownloadingVideos(false)
        }
    }
    useEffect(() => {
    setToken(localStorage.getItem('token'))
    }, [])
   useEffect(()=>{
    if(!spot) return
    setLiked(null)
    setExpanded(false)
    getSpot()
    getFav()
},[spot, refresh])
    useEffect(() => {
        const check = () => setIsTablet(window.innerWidth > 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

     const closeSpot = () => {
        if (!spotClosed) {
            gsap.to(detailsRef.current, {
            height: 0,
            opacity:0,
            duration: 0.3,
            onComplete: () => setSpotClosed(true)
            })
        } else {
            setSpotClosed(false)
            gsap.fromTo(
            detailsRef.current,
            { height: 0 },
            { height: "auto", opacity:1, duration: 0.3 }
            )
        }
    }
    useEffect(()=>{if(!spot) setSpotClosed(false)},[spot])
    // FIX: non resettare lo spot al primo mount (su mobile Details rimonta
    // più volte a causa del cambio isMobile), solo quando pathname cambia
    // davvero dopo che il componente è già montato.
    useEffect(() => {
        if (isFirstPathnameMount.current) {
            isFirstPathnameMount.current = false
            return
        }
        setSpot(null)
    }, [pathname])
    useEffect(() => console.log(spot), [])


    const isSkatepark = data?.spotTypes.includes("SKATEPARK")
    const isStreet = data?.spotTypes.includes("STREET")
    const isBowl = data?.spotTypes.includes("BOWL")
    const isApproved = data?.status === "APPROVED"

    function VideosSection(){
        if(!data.video?.length) return null
        if(pathname === "/dashboard/requests"){
            return (
                <div className="border_b_gray pb-4">
                    <p className={`text-lg truncate text-black py-2`}>Videos</p>
                    <p className="color_p_gray">Download the videos to review and approve this spot.</p>
                </div>
            )
        }
        if(isApproved){
            return (
                <div className="border_b_gray pb-4">
                    <p className={`text-lg truncate text-black py-2`}>Videos</p>
                    <CarouselVideo media={data.video} />
                </div>
            )
        }
        return (
            <div className="border_b_gray pb-4">
                <p className={`text-lg truncate text-black py-2`}>Videos</p>
                <ul className="color_p_gray flex flex-col gap-1">
                    {data.video.map((v, i) => (
                        <li key={v.id || v.link || i} className="truncate wrap-break-word">
                            {(v.name || `Video ${i + 1}`)} — still under review
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

     return (
     <div ref={containerRef} className={`${!spot || !data ? "hidden" : "" } ${postion === "mobile" ? "" : "absolute button--glass button"} top-8.5 ${isTablet ? "left-[100%]" : "left-[-1%]"} p-2 pb-2 ${spotClosed ? "w-14.5" : "w-full"} transition-all duration-300 rounded-[5px]  max-h-[calc(100vh-70px)] overflow-y-scroll overflow-x-hidden flex`}>
           {!isMobile && spotClosed && <button onClick={()=>{closeSpot();}} 
            className="rounded-[5px]"><p>Show</p></button>}
          {!spot || !data 
            ?  null
            : ( <div ref={detailsRef} className="w-full overflow-x-hidden"> 
          {isMobile && <div className="flex gap-1 mb-1 items-center">
                <button onClick={()=>setSpot(null)} className="flex gap-1 items-center color_p_gray w-full rounded-[5px] py-0.5">
                    <MoveLeft size={12}/> <p>Go back</p>
                </button>
                {token &&
                    <div className="flex items-center">
                        {liked 
                            ? <button onClick={() => deleteFav()} className="rounded-[5px] h-[22px] px-2 text-black/20"><HeartCrack size={12}/></button>
                            : <button onClick={() => setFav()} className="rounded-[5px] h-[22px] px-2 text-black/20"><Heart size={12}/></button>
                        }
                    </div>
                }
            </div>}
        <div className="bg_login rounded-t-[5px] flex flex-col justify-center relative">
            {isMobile && 
           <div className="px-2 pt-2">
                <div className="flex justify-between">
                    <p className={`text-xl truncate flex items-center min-w-0 flex-1`}>{data.name.slice(0, 1).toUpperCase() + data.name.slice(1)}</p>
                   <section className="flex gap-1 items-center color_p_gray">
                        <p className="whitespace-nowrap">{data.risk.slice(0, 1).toUpperCase() + data.risk.slice(1).toLowerCase()} Risk</p>
                        <div className={`shrink-0 w-[10px] h-[10px] rounded-full 
                                ${data.risk === "LOW" ? "bg-green-500" : ""}
                                ${data.risk === "MEDIUM" ? "bg-orange-500" : ""}
                                ${data.risk === "HIGH" ? "bg-red-500" : ""}`}
                            />
                   </section>
                </div>
               <div className="color_p_gray">
                    <p className=" truncate bg-transparent">{data.city.slice(0, 1).toUpperCase() + data.city.slice(1).toLowerCase()}, {data.country.slice(0, 1).toUpperCase() + data.country.slice(1).toLowerCase()}</p>
                    <p className=" truncate bg-transparent">{data.street.slice(0, 1).toUpperCase() + data.street.slice(1).toLowerCase()}</p>
                    <Weather key={data.city} city={data.city}/>
                    <p className=" flex items-center gap-1 bg-transparent">
                        {isSkatepark && "Skatepark"}
                        {isStreet && "Street"}
                        {isBowl && "Bowl"}
                        ⋅
                        {structuresName.map((s) => {
                            if (data.spotTypes.includes(s.toUpperCase()))
                                return <Image key={s} src={`/structure/${s}.svg`} width={20} height={20} alt={s} />
                        })}
                    </p>
               </div>
           </div>
           }
            <img src={data.image[0].link} alt="skate spot photo" className="w-full h-[180px] object-cover p-2 rounded-[12px]"/>   
             {token && !isMobile && 
            <div>
                 {liked ?  <button onClick={()=>deleteFav()} className=" absolute top-[12px] right-[12px] button--glass rounded-[10px] backdrop-blur-xs py-2 px-2 text-white"><HeartCrack size={13}/></button>
                  : <button onClick={()=> setFav()} className=" absolute top-[12px] right-[12px] button--glass rounded-[10px] backdrop-blur-xs py-2 px-2 text-white"><Heart size={13}/></button>}       
             </div>
            }
            <button 
            onClick={() => setMediaOpen({  media: data.image, format: "image" })}
            className=" absolute bottom-[12px] left-[12px] button--glass rounded-[5px] px-1 bg-black/10! flex items-center gap-1 text-white"><GalleryVerticalEnd size={13}/> <p>Images</p></button>
        </div>
        <div className="bg_login rounded-b-[5px] px-3 pb-2 relative">
            {!isMobile && 
           <div>
                <div className="flex justify-between">
                    <p className={`text-xl truncate flex items-center min-w-0 flex-1`}>{data.name.slice(0, 1).toUpperCase() + data.name.slice(1)}</p>
                   <section className="flex gap-1 items-center color_p_gray">
                        <p className="whitespace-nowrap">{data.risk.slice(0, 1).toUpperCase() + data.risk.slice(1).toLowerCase()} Risk</p>
                        <div className={`shrink-0 w-[10px] h-[10px] rounded-full 
                                ${data.risk === "LOW" ? "bg-green-500" : ""}
                                ${data.risk === "MEDIUM" ? "bg-orange-500" : ""}
                                ${data.risk === "HIGH" ? "bg-red-500" : ""}`}
                            />
                   </section>
                </div>
               <div className="color_p_gray border_b_gray pb-2">
                    <p className=" truncate bg-transparent">{data.city.slice(0, 1).toUpperCase() + data.city.slice(1).toLowerCase()}, {data.country.slice(0, 1).toUpperCase() + data.country.slice(1).toLowerCase()}</p>
                    <p className=" truncate bg-transparent">{data.street.slice(0, 1).toUpperCase() + data.street.slice(1).toLowerCase()}</p>
                    <Weather key={data.city} city={data.city}/>
                    <p className=" flex items-center gap-1 bg-transparent">
                        {isSkatepark && "Skatepark"}
                        {isStreet && "Street"}
                        {isBowl && "Bowl"}
                        ⋅
                        {structuresName.map((s) => {
                            if (data.spotTypes.includes(s.toUpperCase()))
                                return <Image key={s} src={`/structure/${s}.svg`} width={20} height={20} alt={s} />
                        })}
                    </p>
               </div>
           </div>
           }
           <div className="color_p_gray border_b_gray py-2">
            <p className={`text-lg truncate text-black`}>Structures</p>
           <article className="flex gap-2 py-1 flex-wrap">
                {structuresName.map((s) => {
                            if (data.spotTypes.includes(s.toUpperCase()))
                                return <p key={s} className=" px-3 bg_structure_btn rounded-[15px]">{s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()}</p>
                        })}
           </article>
           </div>
           <Description/>
           <VideosSection/>
           <button
           onClick={()=>{
            window.open(`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`,"_blank")
           }}
            className="py-0.5 bg_structure_btn rounded-[15px] color_p_gray w-full mt-4"><p>Open in Google Maps</p></button>
           <button onClick={()=>handleShare()} className="py-0.5 bg_structure_btn rounded-[15px] color_p_gray w-full mt-2"><p>Share</p></button>
           {pathname === "/dashboard/requests" && data.video?.length > 0 && (
                <button
                disabled={downloadingVideos}
                onClick={()=>downloadAllVideos()}
                className="py-0.5 bg_structure_btn rounded-[15px] color_p_gray w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <p>{downloadingVideos ? "Zipping..." : "Download All Videos"}</p>
                </button>
           )}
            {!isMobile && !spotClosed && <button onClick={()=>{closeSpot();}} 
            className="py-0.5  rounded-[15px] color_p_gray w-full mt-2"><p>Hide</p></button>}
        </div> </div>)}
       </div>
    )
}