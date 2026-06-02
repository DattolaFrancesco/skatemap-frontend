'use client'

import SpotCard from "@/app/(main)/components/SpotCard"
import { useEffect, useState } from "react"
import { HeartOff } from 'lucide-react';
import useUserStore from "../components/UserStore";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";

export default function Favourites(){
    const [spots, setSpots] = useState(null)
    const refresh = useUserStore((data)=> data.refresh)
    const setRefresh = useUserStore((data)=> data.setRefresh)
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

    useEffect(()=>{getFav()},[refresh])
    if(!spots || spots.content.length === 0)return <h1 className="text-2xl text-primary-500">You don't have favourite spots</h1>
    return (
        <>
            <div className="grid_custom gap-1  py-3">
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