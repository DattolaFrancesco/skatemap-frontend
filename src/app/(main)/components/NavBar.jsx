'use client'

import {useEffect, useRef, useState } from "react"
import NavLinks from "./NavLinks"
import {useRouter} from "next/navigation"
import ChatBot from "./ChatBot"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function NavBar(){
    const filters = {
        location: ["Africa", "Asia", "Europe", "North America", "Sud America", "Antartide", "Oceania"],
        type: ["Rail", "Ledge", "Stair", "Skatepark", "Street"],
        risk: ["High", "Medium", "Low"]
    }
    const [selected, setSelected] = useState({
        location: [],
        type: [],
        risk: []
    })
    const [params, setParams] = useState(null)
    const [search,setSearch] = useState(null)
    const [filterOpen,setFilterOpen] = useState(false)
    const [openFilter, setOpenFilter] = useState(null)
    const inputRef = useRef(null)
    const router = useRouter()
    const containerGenericFiltersRef = useRef(null)
    const multipleSelection = (category,f)=>{
         setSelected(prev=>({
            ...prev,
            [category]: prev[category].includes(f)?prev[category].filter(x=>x!=f):[...(prev[category] || []),f]
         }))
    }
   useEffect(() => {
    const params = new URLSearchParams()
    selected.location.forEach(f => {
        params.append("continent", f.toUpperCase().replace(/\s/g, ""))
    })
    selected.type.forEach(f => {
        params.append("type", f.toUpperCase())
    })
    selected.risk.forEach(f => {
        params.append("risk", f.toUpperCase())
    })
    if(search !== null)params.append("search",search)
    router.push(`?${params.toString()}&_t=${Date.now()}`, { scroll: false })
    setParams(params)
}, [selected, router,search])
    useGSAP(()=>{
        const genericFilters = document.querySelectorAll(".genericFilter")
        gsap.set(genericFilters,{xPercent:-200, opacity:0})
    },{scope:containerGenericFiltersRef})
    function openGenerics(){
        const genericFilters = document.querySelectorAll(".genericFilter")
        const els = gsap.utils.toArray(genericFilters)
        if(!filterOpen){
            gsap.to(els[0], {
                xPercent:0,
                opacity: 1 
            })
            gsap.to(els.slice(1),{
                xPercent:0,
                opacity:0
            })
            gsap.to(els.slice(1),{
                xPercent:0,
                opacity:0,
                onComplete:()=>{
                    els.slice(1).forEach((f,i)=>{
                        if(i == 0) gsap.to(f,{yPercent:110,opacity:1})
                        else gsap.to(f,{yPercent:220,opacity:1})
                    })
                }
            })
        }
        else {
            gsap.to(genericFilters,{xPercent:-200,opacity:0,stagger:0.2,duration:0.1})
        }

    }
    return(
       <div className="z-10">
        <nav className="navbar p-2">
        <section className="left flex flex-col h-full">
            {/* input search div */}
            <div><input ref={inputRef} type="text" placeholder="Search" onChange={(e)=>setSearch(e.currentTarget.value)} className="w-full"/></div>
            <aside className="flex gap-0.5 pt-1">
                    {/* filter main div  */}
                   <div>
                    <button  
                    className={`${!filterOpen?null :"bg-primary-500"}`}
                    onClick={()=>{
                    setFilterOpen(!filterOpen)
                    setOpenFilter(null)
                    openGenerics()
                    }}>Filters</button></div>
                    {/* generics div like loc-type-risk */}
                    <div ref={containerGenericFiltersRef} 
                    className={`flex`}
                    >
                       <div className="flex flex-col gap-0.5 w-fit">
                            <div className="relative" >
                                <button
                                    data-label="Location"
                                    className={`w-fit absolute ${openFilter == null || openFilter !== "Location"   ? null : "bg-primary-500"} genericFilter`}
                                    onClick={()=>{setOpenFilter(openFilter === "Location"?null :"Location")}}>Location
                                </button>
                                <button 
                                data-label="Type"
                                className={`w-fit absolute ${openFilter == null || openFilter !== "Type"   ? null : "bg-primary-500"} genericFilter`}
                                onClick={()=>{setOpenFilter(openFilter === "Type"?null :"Type")}}>Type
                                </button>
                                <button 
                                data-label="Risk"
                                className={`w-fit absolute ${openFilter == null || openFilter !== "Risk"   ? null : "bg-©"} genericFilter`} 
                                onClick={()=>{setOpenFilter(openFilter === "Risk"?null :"Risk")}}>Risk
                                </button>
                                {/* <div 
                                className={`absolute flex flex-col gap-0.5 top-0 left-[103%] ${openFilter === "Location" ? "" : "invisible"}`}>
                                   {filters.location.map((f,index)=>(
                                    <button key={index} onClick={()=>multipleSelection("location",f)} 
                                    className={selected.location.includes(f)?"bg-primary-500":""}
                                    >{f}</button>
                                   ))}
                                </div>  */}
                            </div>
                            <div className="relative">

                                <div
                                    className={`absolute flex flex-col gap-0.5 top-0 left-[103%] ${openFilter === "Type" ? "" : "invisible"}`}>
                                    {filters.type.map((f,index)=>(
                                        <button key={index} onClick={()=>multipleSelection("type",f)}
                                        className={selected.type.includes(f)?"bg-primary-500":""}
                                        >{f}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div 
                                className={`absolute flex flex-col gap-0.5 top-0 left-[103%] ${openFilter === "Risk" ? "" : "invisible"}`}>
                                    {filters.risk.map((f,index)=>(
                                        <button key={index} onClick={()=>multipleSelection("risk",f)}
                                        className={selected.risk.includes(f)?"bg-primary-500":""}
                                        >{f}</button>
                                    ))}
                                </div>
                            </div>
                       </div>
                    </div>
            </aside>
            <div className="mt-auto flex flex-col gap-1">
                <button className="w-fit"onClick={()=>{
                    setSelected({ location: [], type: [], risk: [] }); 
                    setSearch(null)
                    inputRef.current.value=""
                    router.push(``)}}>Reset filters</button>
                    <ChatBot/>
            </div>
        </section>
        <NavLinks params={params}/>
        </nav>
       </div>
    )
}