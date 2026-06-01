'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
import { RxCross2 } from "react-icons/rx"
import { HeartOff } from 'lucide-react';
import { Heart } from 'lucide-react';
import CarouselMedia from "./CarouselMedia"
import OpenMedia from "./OpenMedia";
import Weather from "./Weather";
import { useEffect, useState } from "react";
import useUserStore from "@/app/(account)/dashboard/components/UserStore";
import Map from "@/app/googleMaps/Map";

export default function SpotDetails(){
     const spotOpen = useInsetStore((state) => state.spotOpen);
     const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
     const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
     const setRefreshy = useUserStore((state)=>state.setRefresh)
     const refreshy = useUserStore((state)=>state.refresh)
     const [data, setData] = useState(null)
     const [refresh,setRefresh] =useState(null)
     const [liked, setLiked] =useState(null)

    async function getSpot(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotOpen}`,{
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
            setLiked(data)
        }catch(err){
            console.log(err.message)
        }
    }
    async function setFav(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
            setRefresh(!refresh)
            setRefreshy(!refreshy)
        }catch(err){
            console.log(err.message)
            setRefresh(!refresh)
            setRefreshy(!refreshy)
        }
    }
    async function deleteFav(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't connect to the server")
            setRefresh(!refresh)
            setLiked(null)
            setRefreshy(!refreshy)
        }catch(err){
            setRefresh(!refresh)
            setLiked(null)
            setRefreshy(!refreshy)
        }
    }
    useEffect(()=>{
        if(!spotOpen) return
        getSpot()
        getFav(); 
    },[spotOpen,refresh])
    return(
        <div 
        onClick={()=>{
            setSpotOpen(null)
            setMediaOpen(null)
            setLiked(null)
            setData(null)
        }}
        className={` ${spotOpen ? "block" : "hidden"} fixed  inset-0 z-999  bg-black/30 min-h-full flex justify-center items-center`}>
            <div
            onClick={(e)=>e.stopPropagation()}
            className="bg_custom_spot_details  break-words overflow-hidden">
               {spotOpen && data && (
                <main className="p-3 flex flex-col h-full overflow-y-auto gap-5">
                    <div className="flex flex-col justify-between  relative">
                        <div>
                            <div className="flex justify-between ">
                                <h1 className="font-bold font_details_h1">{data.name.toUpperCase()}</h1>
                                <div className="flex justify-center items-center gap-3">
                                    {liked ? <HeartOff size={30} onClick={()=>deleteFav()} className="cursor-pointer"/>:<Heart size={30} onClick={()=>setFav()} className="cursor-pointer"/>}
                                    <RxCross2 size={38} onClick={()=>{setSpotOpen(null);setLiked(null)}} className="cursor-pointer"/>
                                </div>
                            </div>
                            <aside className="flex gap-1">
                            {[...Array(5)].map((_,i)=>(
                            <div key={i} className={`custom_box_size rounded-sm border 
                                ${data.risk === "HIGH" ? "bg-primary-500":""}
                                ${data.risk === "MEDIUM" && i<3 ? "bg-primary-500":""}
                                ${data.risk === "LOW" && i<1 ? "bg-primary-500":""}`}></div>
                            ))}
                            </aside>
                        </div>
                   <div className="h-full flex flex-col py-5 gap-5 ">
                        <section>
                            <div className="flex justify-between"><p className="font-bold">CONTINENT</p><p>{data.continents.replace("NORTH","NORTH\n").replace("SOUTH", "SOUTH\n")}</p></div>
                            <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">COUNTRY</p><p>{data.country}</p></div>
                            <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">CITY</p><p>{data.city}</p></div>
                            <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">STREET</p><p>{data.street}</p></div>
                            <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">WEATHER</p><Weather city={data.city}/></div>
                            <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">TYPE</p><p>{data.spotTypes.map((t)=>t.toUpperCase()).join(", ")}</p></div>
                            <div className="flex justify-between border-primary-300 border-t "><p className="font-bold">RISK</p><p>{data.risk}</p></div>
                        </section>
                        <section className="py-20" >
                                <p className=" wrap-break-word">{data.description}</p>
                        </section>
                        <OpenMedia/>
                   </div>
                     </div>
                    <section className="py-5 flex flex-col gap-5">
                        <div>
                            <h2 className="font-semibold font_details_h2">Images</h2>
                            <CarouselMedia media={data.image}/>
                        </div>
                        <div>
                            <h2 className="font-semibold font_details_h2">Videos</h2>
                            <CarouselMedia media={data.video}/>
                        </div>
                    </section>
                    <div className="w-full py-3 flex flex-col">
                        <p className="font-semibold font_details_h2 text-center mb-3">Google maps spot location</p>
                        <Map lat={data.latitude} lng={data.longitude} />
                    </div>
                </main>
               )}
            </div>
        </div>
    )
}