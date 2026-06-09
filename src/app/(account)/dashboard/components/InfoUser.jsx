'use client'

import { useEffect} from "react";
import useUserStore from "./UserStore";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useThemeStore from "./ThemesStore";
import TransitionLink from "@/app/(main)/components/TransitionLink";
import useNavigationStore from "@/app/(main)/store/NavigationStore";

export default function InfoUser(){
    const setUser = useUserStore((data)=> data.setUser)
    const user = useUserStore((data)=> data.user)
    const refresh = useUserStore((data)=> data.refresh)
    const bgTheme = useThemeStore((data)=>data.bgTheme)
    const statusHref = useNavigationStore((state) => state.statusHref);
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
            setUser(data)
        }
        catch(err){
            router.push("/login")
            console.log(err.message)
        }
    }

    useEffect(()=>{getUser()},[refresh])
    useEffect(()=>{},[bgTheme])

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
                <div className="flex justify-between">
                    <div className="flex gap-3 flex flex-wrap">
                        <h1 className="text-6xl text-primary-500 font-bold">{user.username}</h1>
                          <article className="flex flex-wrap gap-2">
                                <div className="flex gap-1">
                                    <p className={`text-3xl md:text-3xl h-fit  bg-transparent ${bgTheme === "bg-dark-custom" ? "text-white" : "text-gray-700"}`}>{user.nOfSpots}</p>
                                    <p className="text-sm font-bold  bg-transparent text-primary-500">SPOTS</p>
                                </div>
                               <div className="flex gap-1">
                                    <p className={`text-3xl md:text-3xl h-fit  bg-transparent ${bgTheme === "bg-dark-custom" ? "text-white" : "text-gray-700"}`}>{user.nOfFav}</p>
                                    <p className="text-sm font-bold bg-transparent text-primary-500">FAVOURITES</p>
                               </div>
                          </article>
                    </div>
                  <div className="flex flex-col gap-2 justify-center items-center">
                        <TransitionLink className={`nav-link w-full text-center text-sm md:text-base ${statusHref?" disabled-btn":""}`} href={`/`}>HOME</TransitionLink>
                        <TransitionLink className={`nav-link  w-full text-center text-sm md:text-base ${statusHref?" disabled-btn":""}`} href={`/login`}>LOG OUT</TransitionLink>
                        <TransitionLink className={`block md:hidden ms-auto nav-link w-fit text-center whitespace-nowrap text-sm md:text-base ${statusHref?" disabled-btn":""}`} href={`/spot/registration`}>ADD SPOT</TransitionLink>
                  </div>
                </div>

            </div>
        </>
        }
        </div>
    )
}