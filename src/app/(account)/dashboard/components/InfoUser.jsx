'use client'

import { useEffect, useState } from "react";
import useUserStore from "./UserStore";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function InfoUser(){
    const setUser = useUserStore((data)=> data.setUser)
    const user = useUserStore((data)=> data.user)
    const refresh = useUserStore((data)=> data.refresh)
    const [spot,setSpot] = useState(null)
    const [spotFav,setSpotFav] = useState(null)
    const router = useRouter()

    async function  getUser(){
    const url = "http://localhost:3003/account";
    try{
        const res = await fetch(url, {
        method: "GET",
        headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
        }   
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data)
    }
    catch(err){
        router.push("/login")
        console.log(err.message)
    }}
    async function  getSpot(){
    const url = "http://localhost:3003/spots/own";
    try{
        const res = await fetch(url, {
        method: "GET",
        headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
        }   
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setSpot(data.content)
    }
    catch(err){
        console.log(err.message)
    }}
    async function  getFavs(){
    const url = "http://localhost:3003/fav/all";
    try{
        const res = await fetch(url, {
        method: "GET",
        headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
        }   
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setSpotFav(data.content)
    }
    catch(err){
        console.log(err.message)
    }}
    useEffect(()=>{getUser(); getSpot(); getFavs()},[refresh])
    if(!user)
    return(
        <div className="w-full flex flex-col md:flex-row">
            <div className="w-full flex flex-col gap-3">
                <div className="h-14 w-48 bg-black/20 animate-pulse" />
                <div className="h-7 w-36 bg-black/20 animate-pulse mt-3" />
                <div className="h-7 w-52 bg-black/20 animate-pulse" />
            </div>
            <div className="w-full flex flex-col justify-around">
                <div className="flex ms-auto">
                            <div className="nav-link w-16 h-5 bg-black/20 animate-pulse" />
                </div>
                <div className="flex justify-end gap-3 py-4">
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="h-14 w-12 bg-black/20 animate-pulse" />
                    <div className="h-5 w-14 bg-black/20 animate-pulse" />
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="h-14 w-12 bg-black/20 animate-pulse" />
                    <div className="h-5 w-20 bg-black/20 animate-pulse" />
                </div>
                </div>
            </div>
        </div>
    )
    return(
        <div className=" w-full flex flex-col md:flex-row">
        {user  &&
        <>
            <div className="w-full">
                <h1 className="text-6xl">{user.username}</h1>
                <p className="text-2xl bg-transparent mt-3">{user.name +" "+ user.surname}</p>
                <p className="text-2xl bg-transparent">{user.email}</p>
            </div>
            <div className="w-full flex flex-col justify-around">
               <div className="flex ms-auto"> <Link href={"/"} className="nav-link">HOME</Link></div>
              <div className="flex justify-end gap-3 py-4">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-6xl bg-transparent font-sans">{spot?.length}</p>
                        <p className="text-xl bg-transparent">SPOTS</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-6xl bg-transparent font-sans">{spotFav?.length}</p>
                        <p className="text-xl bg-transparent">FAVOURITES</p>
                    </div>
              </div>
            </div>
        </> 
        }
        </div>
    )
}
