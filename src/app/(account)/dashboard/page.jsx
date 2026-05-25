'use client'
import SpotCard from "@/app/(main)/components/SpotCard";
import { useEffect, useState } from "react";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import { RxCross2 } from "react-icons/rx";
import { FaPencilAlt } from "react-icons/fa";
import useUserStore from "./components/UserStore";
import Link from "next/link";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";


export default  function MySpots(){
    const [data, setData] = useState(null)
    const [status,setStatus] = useState(null)
    const [askPermission, setAskPermission] = useState(false)
    const setRefresh = useUserStore((data)=> data.setRefresh)
    const refresh = useUserStore((data)=> data.refresh)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({message:"",type:""})
    const [eliminationSpot, setEliminationSpot] = useState(null)
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
    if(!data) return <h1 className=" text-2xl animate-pulse">Loading spots...</h1> 
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
                <div className="border-b py-2 flex flex-wrap justify-between gap-2">
                    <div className=" flex gap-2">
                        <button onClick={()=>status === "approved"?setStatus(null):setStatus("approved")}
                            className={`${status === "approved"?"bg-black/40":""}`}>APPROVED</button>
                        <button onClick={()=>status === "pending"?setStatus(null):setStatus("pending")}
                            className={`${status === "pending"?"bg-black/40":""}`}>PENDING</button>
                        <button onClick={()=>status === "unapproved"?setStatus(null):setStatus("unapproved")}
                            className={`${status === "unapproved"?"bg-black/40":""}`}>UNAPPROVED</button>
                    </div>
                    <div className="flex"><Link href={"/spot/registration"} className="nav-link">ADD SPOT</Link></div>
                </div>
                <SpotDetails/>
                <div className="grid_custom gap-1  py-3">
                   {data.content.length === 0 && <h1 className="text-2xl mt-2">You don't have any spot that satisfy the filters</h1>}
                    {data.content.map((s)=>(
                       <div  key={s.id} className="relative">
                        <SpotCard spot={s}/>
                        <button onClick={(()=> askConfermation(s))} className="absolute top-1 right-1 "><RxCross2 size={20} className="text-red-800"/></button>
                        <Link className="absolute top-7 right-1  nav-link" href={`/spot/modify/${s.id}`}><FaPencilAlt size={20} className="py-1"/></Link>
                        <div className={`absolute top-1 left-1  rounded-full w-[15px] h-[15px] 
                            ${s.status === "APPROVED"?"bg-green-500":""}
                             ${s.status === "PENDING"?"bg-orange-400 animate-pulse":""}
                              ${s.status === "UNAPPROVED"?"bg-red-500":""}`}></div>
                        </div>
                        ))}
                </div>
                 {data?.totalPages>1 &&<ArrowPageSelector totalPages={data?.totalPages}/>}
            </div>
        )
}