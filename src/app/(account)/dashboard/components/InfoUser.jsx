'use client'

import { useEffect } from "react";
import useUserStore from "./UserStore";
import Link from "next/link";

export default function InfoUser(){
    const setUser = useUserStore((data)=> data.setUser)
    const user = useUserStore((data)=> data.user)

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
        console.log(err.message)
    }}
    useEffect(()=>{getUser()},[])

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
                        <p className="text-6xl bg-transparent font-sans">24</p>
                        <p className="text-xl bg-transparent">SPOTS</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-6xl bg-transparent font-sans">12</p>
                        <p className="text-xl bg-transparent">FAVOURITES</p>
                    </div>
              </div>
            </div>
        </> 
        }
        </div>
    )
}
