'use client'

import SpotCard from "@/app/(main)/components/SpotCard";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { X } from 'lucide-react';
import { Check } from 'lucide-react';
import useUserStore from "../components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";

export default function Request(){
    const [spot,setSpot] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [askPermissionToUnApprove, setAskPermissionToUnApprove] = useState(false)
    const [askPermissionToApprove, setAskPermissionToApprove] = useState(false)
    const [message, setMessage] = useState({message:"",type:""})
    const [unApprovedSpot, setUnApprovedSpot] = useState(null)
    const [approvedSpot, setApprovedSpot] = useState(null)
    const [loading, setLoading] = useState(false)
     const setPendingSpots = useUserStore((data)=> data.setPendingSpots)
     const pendingSpots = useUserStore((data)=> data.pendingSpots)
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
        setMessage({message:`${spotId?.name} approved successfully`, type:"good"})
        setTimeout(() => {
        setMessage({message:"",type:""}) 
        setRefresh(!refresh)
        }, 3000);
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
        setMessage({message:`${spotId?.name} unapproved successfully`, type:"bad"})
        setTimeout(() => {
        setMessage({message:"",type:""}) 
        setRefresh(!refresh)
        }, 3000);
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
    if(!spot || spot?.content?.length === 0) return <h1 className="text-2xl">You don't have any spot request to review</h1>
    return (
        <>
        <div className="grid_custom gap-1  py-3">
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
                    {spot.content?.map((s)=>(
                       <div  key={s.id} className="relative">
                        <SpotCard spot={s}/>
                       <div className="absolute top-1 right-1 flex flex-col gap-1">
                            <button onClick={(()=> askConfermationApproved(s))} className=" text-green-700"><Check size={20}/></button>
                            <button onClick={(()=> askConfermationUnApproved(s))} className=" text-red-700"><X size={20}/></button>
                            <Link className="nav-link" href={`/spot/modify/${s.id}`}><FaPencilAlt size={20} className="py-1"/></Link>
                       </div>
                        </div>
                    ))}
        </div>
        {spot?.totalPages>1 &&<ArrowPageSelector totalPages={spot?.totalPages}/>}
    </>
    )
}
