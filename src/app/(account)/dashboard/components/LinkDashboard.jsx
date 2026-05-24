'use client'
import Link from "next/link";
import useUserStore from "./UserStore";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
export default function LinkDashboard(){
    const router = useRouter();
    const pathname = usePathname()
    const user = useUserStore((data)=> data.user)
    const isAdmin = user?.authorities[0].authority === "admin" || user?.authorities[0].authority === "super_admin";
    const isSuperAdmin =  user?.authorities[0].authority === "super_admin";
    const [pending, setPending] = useState(null)
    const pendingSpots = useUserStore((data)=> data.pendingSpots)
    async function getPendingSpots(){
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
        setPending(data.content.length)
        }
        catch(error){
        console.log(error.message)
        }
    }
    useEffect(()=>{getPendingSpots()},[pendingSpots])
    if(!user)
    return(
        <div className="w-full flex flex-wrap justify-between gap-2 py-2 border-t border-b ">
          <div className="flex gap-2">      
            <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
            <div className="nav-link w-20 h-5 animate-pulse bg-black/20" />
            <div className="nav-link w-20 h-5 animate-pulse bg-black/20" />
            <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
          </div>
          <div className="flex">
            <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
          </div>
        </div>
    )
    return(
        <div className="w-full flex flex-wrap justify-between gap-2  py-2 border-t border-b ">
               <div className="flex flex-wrap gap-2">
                    <Link href={"/dashboard/"} className={`nav-link ${pathname === "/dashboard"?" bg-black/50!":""}`}>MY SPOTS</Link>
                      {isAdmin && <Link href={"/dashboard/allSpot"} className={`nav-link ${pathname === "/dashboard/allSpot"?" bg-black/50!":""}`}>ALL SPOTS</Link>}
                    <Link href={"/dashboard/favourites"} className={`nav-link ${pathname === "/dashboard/favourites"?" bg-black/50!":""}`}>FAVOURITES</Link>
                    {isAdmin && 
                    <Link href={"/dashboard/requests"} className={`relative nav-link ${pathname === "/dashboard/requests"?" bg-black/50!":""}`}>
                      REQUESTS
                   {pending > 0 && <div className="absolute rounded-full w-2 h-2 top-[-3] right-[-3] bg-red-500 text-[10px] animate-pulse"></div>}
                    </Link>}
                    {isSuperAdmin && <Link href={"/dashboard/users"} className={`nav-link ${pathname === "/dashboard/users"?" bg-black/50!":""}`}>USERS</Link>}
               </div>
               <div className="flex gap-2">
                 <Link href={"/spot/registration"} className={`nav-link `}>ADD SPOT</Link>
                <button onClick={()=>{
                localStorage.removeItem('token')
                router.push("/login")
               }} className={`nav-link`}>LOG OUT</button>
               </div>
        </div>
    )
}       