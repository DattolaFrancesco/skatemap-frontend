'use client'

import { useEffect, useState } from "react";
import useUserStore from "./UserStore";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function InfoUser(){
    const setUser = useUserStore((data)=> data.setUser)
    const user = useUserStore((data)=> data.user)
    const refresh = useUserStore((data)=> data.refresh)
    const router = useRouter()

    async function getUser(){
        const url = `${process.env.NEXT_PUBLIC_API_URL}/account/minimal`
        try{
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            console.log(data)
            setUser(data)
        }
        catch(err){
            router.push("/login")
            console.log(err.message)
        }
    }

    useEffect(()=>{getUser()},[refresh])

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
        <div className="w-full flex flex-col md:flex-row">
        {user &&
        <>
            <div className="w-full">
                <div className="flex items-start">
                    <h1 className="text-6xl text-primary-500 font-bold">{user.username}</h1>
                    <div className="flex ms-auto"><Link href={"/"} className="nav-link">HOME</Link></div>
                </div>
                <div>
                    <div className="w-full flex flex-col md:flex-row justify-between mb-3">
                        <div className="flex flex-col justify-end gap-1">
                            <p className="text-md md:text-2xl mt-3 px-2 w-fit">{user.name + " " + user.surname}</p>
                            <p className="text-md md:text-2xl px-2 w-fit">{user.email}</p>
                        </div>
                        <div className="flex justify-center md:justify-end gap-3">
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-3xl md:text-6xl bg-transparent font-sans text-primary-700">{user.nOfSpots}</p>
                                <p className="text-md md:text-xl bg-transparent text-primary-500">SPOTS</p>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-3xl md:text-6xl bg-transparent font-sans text-primary-700">{user.nOfFav}</p>
                                <p className="text-md md:text-xl bg-transparent text-primary-500">FAVOURITES</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        }
        </div>
    )
}