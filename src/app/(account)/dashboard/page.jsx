'use client'
import SpotCard from "@/app/(main)/components/SpotCard";
import useUserStore from "./components/UserStore";
import { useEffect, useState } from "react";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import { RxCross2 } from "react-icons/rx";

export default  function MySpots(){
    const user = useUserStore((data)=> data.user)
    const [data, setData] = useState(null)
    const [status,setStatus] = useState(null)
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
        console.log(datas)
        }
        catch(error){
        console.log(error.message)
        }
    }
    async function deleteSpotById(spotId){;
    try{
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
      })
      if(!res.ok) throw new Error(data.message);
        getSpots()
      }
      catch(err){console.log(err.message, "delete")}
    }
    useEffect(()=>{getSpots()},[status])
    if(!data) return <p className="mx-2 px-1">Server is not working right now</p> 
        return  ( 
            <div>
                <div className="border-b py-2 flex gap-2">
                    <button onClick={()=>status === "approved"?setStatus(null):setStatus("approved")}
                        className={`${status === "approved"?"bg-black/40":""}`}>APPROVED</button>
                    <button onClick={()=>status === "pending"?setStatus(null):setStatus("pending")}
                        className={`${status === "pending"?"bg-black/40":""}`}>PENDING</button>
                    <button onClick={()=>status === "unapproved"?setStatus(null):setStatus("unapproved")}
                        className={`${status === "unapproved"?"bg-black/40":""}`}>UNAPPROVED</button>
                </div>
                <SpotDetails/>
                <div className="grid_custom gap-1  py-0.5">
                    {data.content.map((s)=>(
                       <div  key={s.id} className="relative">
                        <SpotCard spot={s}/>
                        <button onClick={(()=> deleteSpotById(s.id))} className="absolute top-1 right-1 cursor-pointer"><RxCross2 size={20}/></button>
                        <div className={`absolute top-1 left-1  rounded-full w-[15px] h-[15px] 
                            ${s.status === "APPROVED"?"bg-green-500":""}
                             ${s.status === "PENDING"?"bg-orange-400 animate-pulse":""}
                              ${s.status === "UNAPPROVED"?"bg-red-500":""}`}></div>
                        </div>
                        ))}
                </div>
            </div>
        )
}