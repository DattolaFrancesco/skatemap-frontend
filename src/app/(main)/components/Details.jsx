'use client'

import Weather from "./Weather";
import { useEffect, useRef, useState } from "react";
import { GalleryVerticalEnd, Heart, HeartCrack } from 'lucide-react';
import useSpotStore from "../store/SpotStore";
import useUserStore from "@/app/(account)/dashboard/components/UserStore";
import useInsetStore from "../store/InsetStore";
import Image from 'next/image'
import CarouselVideo from "./CarouselVideo";
import OpenMedia from "./OpenMedia";

const structuresName = ["ledge", "rail", "ramp", "stair"]

export default function Details({postion}){
    const setRefreshy = useUserStore((state)=>state.setRefresh)
    const spot = useSpotStore((data)=>data.spot)
    const refreshy = useUserStore((data)=>data.refresh)
    const [data, setData] = useState(null)
    const [refresh,setRefresh] =useState(null)
    const [liked, setLiked] =useState(null)
    const [token, setToken] = useState(null)
    const [pendingLike, setPendingLike] = useState(false)
    const likedPending = useRef(false)
    const [expanded, setExpanded] = useState(false)
    const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
    const [isMobile, setIsMobile] = useState(false)

    async function getSpot(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/single/${spot}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
                console.log(data)
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
            setPendingLike(false)
            likedPending.current = false
        }
    }
    async function setFav(){
        if(likedPending.current) return
        likedPending.current = true
        setPendingLike(true)
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
            setPendingLike(false)
            likedPending.current = false
        }
    }
    async function deleteFav(){
        if(likedPending.current) return
        likedPending.current = true
        setPendingLike(true)
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spot}`,{
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't delete fav")
            setRefresh(!refresh)
            setLiked(null)
            setRefreshy(!refreshy)
        }catch(err){
            setRefresh(!refresh)
            setLiked(null)
            setRefreshy(!refreshy)
        }finally {
            setPendingLike(false)
            likedPending.current = false
        }
    }
    function Description(){
    return(
    <div className="py-2 border_b_gray ">
        <p className={`color_p_gray ${!expanded ? "line-clamp-3" : ""}`}>
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
    useEffect(() => {
    setToken(localStorage.getItem('token'))
    }, [])
    useEffect(()=>{
        if(!spot) return
        setLiked(null)
        setExpanded(false)
        getSpot()
        getFav(); 
    },[spot,refresh])
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth > 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    if(data && spot){
        const isSkatepark = data.spotTypes.includes("SKATEPARK")
        const isStreet = data.spotTypes.includes("STREET")
        const isBowl = data.spotTypes.includes("BOWL")
        return(
       <div className={` absolute top-8.5 ${isMobile ? "left-[100%]" : "left-[-1%]"}  ms-1  button--glass button p-2 w-full max-h-[calc(100vh-70px)] overflow-y-scroll`}>
        <div className="bg_login rounded-t-[5px] flex flex-col justify-center relative">
            <img src={data.image[0].link} alt="skate spot photo" className="w-full h-[180px] object-cover p-2 rounded-[12px]"/>   
           {token && 
            <div>
                 {liked ?  <button onClick={()=>deleteFav()} className=" absolute top-[12px] right-[12px] button--glass rounded-[10px] backdrop-blur-xs py-2 px-2 text-white"><HeartCrack size={12}/></button>
                  : <button onClick={()=> setFav()} className=" absolute top-[12px] right-[12px] button--glass rounded-[10px] backdrop-blur-xs py-2 px-2 text-white"><Heart size={12}/></button>}       
             </div>
            }
            <button 
            onClick={() => setMediaOpen({  media: data.image, format: "image" })}
            className=" absolute bottom-[12px] left-[12px] button--glass rounded-[5px] px-1 backdrop-blur-xs flex items-center gap-1 text-white"><GalleryVerticalEnd size={13}/> <p>Images</p></button>
        </div>
        <div className="bg_login rounded-b-[5px] px-3 pb-2">
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
           <div className="color_p_gray border_b_gray  py-2">
            <p className={`text-lg truncate text-black`}>Structures</p>
           <article className="flex gap-2 py-1">
                {structuresName.map((s) => {
                            if (data.spotTypes.includes(s.toUpperCase()))
                                return <p className=" px-3 bg_structure_btn rounded-[15px]">{s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase()}</p>
                        })}
           </article>
           </div>
           <Description/>
           <div className="border_b_gray pb-4">
             <p className={`text-lg truncate text-black py-2`}>Videos</p>
             <CarouselVideo media={data.video} />
           </div>
           <button className="py-0.5 bg_structure_btn rounded-[15px] color_p_gray w-full mt-4"><p>Open in Google Maps</p></button>
           <button className="py-0.5 bg_structure_btn rounded-[15px] color_p_gray w-full mt-2"><p>Share</p></button>
        </div>
       </div>
    )}
}

                             