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
    const tlRef = useRef(null)
    const tlContinentsRef = useRef(null) 
    const tlTypesRef = useRef(null) 
    const tlRiskRef = useRef(null) 
    const inputRef = useRef(null)
    const router = useRouter()
    const containerGenericFiltersRef = useRef(null)
    const [filterIsReady, setFilterIsReady] = useState(true)
    const [btnIsReady, setBtnIsReady] = useState(true)
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
        const continents = gsap.utils.toArray(document.querySelectorAll(".continents"))
        const types = gsap.utils.toArray(document.querySelectorAll(".types"))
        const risks = gsap.utils.toArray(document.querySelectorAll(".risks"))
        gsap.set(genericFilters,{xPercent:-300, opacity:0})
        gsap.set(types,{opacity:0})
        gsap.set(risks,{x:43, y:0, opacity:0})
        gsap.set(continents,{x:-300, opacity:0})
    },{scope:containerGenericFiltersRef})
    useGSAP(()=>{
        console.log(openFilter)
        tlTypesRef.current?.kill() 
        tlContinentsRef.current?.kill()
         closeAll()
        switch(openFilter){
            case "Location":
            openLocation()
            break
            case "Type":
            openType()
            break
            case "Risk":
            openRisk()
            break
            default:
            break

        }
    },{scope:containerGenericFiltersRef, dependencies:[]})

    function closeAll(){
        tlTypesRef.current?.reverse()
        tlContinentsRef.current?.reverse()
        tlRiskRef.current?.reverse()
    }
    function openLocation(){
        if(openFilter !== "Location"){
            tlContinentsRef.current?.reverse()
        }else{
            tlContinentsRef.current?.kill() 
            const continents = gsap.utils.toArray(document.querySelectorAll(".continents"))
            if(continents){
            tlContinentsRef.current = gsap.timeline({onComplete:()=>{setBtnIsReady(true)},onReverseComplete: () =>setBtnIsReady(true)}) 
            tlContinentsRef.current
                    .to(continents, {x:75, duration:0.3})
                    .to(continents?.[0], {x:75,opacity: 1, duration:0.1})
                    .to(continents?.slice(1), {
                    x: 75,
                    opacity: 1,
                    y: (i) => (i + 1) * 21,
                    duration: 0.2,
                    stagger: 0.1
                })
                }
        }
    }
    function openType(){
        if(openFilter !== "Type"){
            tlTypesRef.current?.reverse()
        }else{
            tlTypesRef.current?.kill() 
            const types = gsap.utils.toArray(document.querySelectorAll(".types"))
            if(types){
            tlTypesRef.current = gsap.timeline({onComplete:()=>{setBtnIsReady(true)},onReverseComplete: () =>setBtnIsReady(true)}) 
            tlTypesRef.current
                    .to(types, { duration:0.3})
                    .to(types?.[0], {opacity: 1, duration:0.1})
                    .to(types?.slice(1), {
                    opacity: 1,
                    duration: 0.2,
                    stagger: 0.1
                })
                }
        }
    }
    function openRisk(){
        if(openFilter !== "Risk"){
            tlRiskRef.current?.reverse()
        }else{
            tlRiskRef.current?.kill() 
            const risks = gsap.utils.toArray(document.querySelectorAll(".risks"))
            if(risks){
            tlRiskRef.current = gsap.timeline({onComplete:()=>{setBtnIsReady(true)},onReverseComplete: () =>setBtnIsReady(true)}) 
            tlRiskRef.current
                    .to(risks, {x:43, duration:0.3})
                    .to(risks?.[0], {x:43,opacity: 1, duration:0.1})
                    .to(risks?.slice(1), {
                    x: 43,
                    opacity: 1,
                    duration: 0.2,
                    stagger: 0.1
                })
                }
        }
    }
    function openGenerics(){
        setFilterIsReady(false)
        tlRef.current?.kill() 
        const genericFilters = document.querySelectorAll(".genericFilter")
        const els = gsap.utils.toArray(genericFilters)
        if(!filterOpen){
           tlRef.current =  gsap.timeline({onComplete:()=>{setFilterIsReady(true)},onReverseComplete: () => setFilterIsReady(true)}) 
           tlRef.current
                .to(els, {xPercent:0, duration:0.1})
                .to(els[0], {xPercent:0,opacity: 1, duration:0.1})
                .to(els?.slice(1), {
                xPercent: 0,
                opacity: 1,
                yPercent: (i) => (i + 1) * 110,
                duration: 0.2,
                stagger: 0.1
            },)
            }
            else tlRef.current?.reverse()
    }
    return(
       <div className="z-10">
        <nav className="navbar p-2">
        <section className="left flex flex-col h-full ">
            {/* input search div */}
            <div><input ref={inputRef} type="text" placeholder="Search" onChange={(e)=>setSearch(e.currentTarget.value)} className="w-full"/></div>
            <aside className="flex gap-0.5 pt-1 ">
                    {/* filter main div  */}
                   <div>
                    <button  
                    className={`${!filterOpen?null :"bg-primary-500"} ${filterIsReady ? "":"disabled-btn"}`}
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
                                    className={`w-fit absolute ${openFilter == null || openFilter !== "Location"   ? null : "bg-primary-500"} 
                                    ${btnIsReady ? "":" disabled-btn bg-red-400"} genericFilter`}
                                    onClick={()=>{
                                        setOpenFilter(openFilter === "Location"?null :"Location")
                                        setBtnIsReady(false)
                                        }}>Location
                                </button>
                                <button 
                                data-label="Type"
                                className={`w-fit absolute ${openFilter == null || openFilter !== "Type"   ? null : "bg-primary-500"} 
                                ${btnIsReady ? "":" disabled-btn bg-red-700"} genericFilter`}
                                onClick={()=>{
                                    setOpenFilter(openFilter === "Type"?null :"Type")
                                    setBtnIsReady(false)
                                    }}>Type
                                </button>
                                <button 
                                data-label="Risk"
                                className={`w-fit absolute ${openFilter == null || openFilter !== "Risk"   ? null : "bg-primary-500"} 
                                ${btnIsReady ? "":" disabled-btn bg-red-700"} genericFilter`}
                                onClick={()=>{
                                    setOpenFilter(openFilter === "Risk"?null :"Risk")
                                    setBtnIsReady(false)
                                    }}>Risk
                                </button>
                                   {filters.location.map((f,index)=>(
                                    <button key={index} onClick={()=>multipleSelection("location",f)} 
                                    className={`${selected.location.includes(f)?"bg-primary-500":""} continents absolute`}
                                    >{f}</button>
                                   ))}
                                 <div className="flex flex-col gap-0.5 absolute left-[75%] top-[36%]">
                                        {filters.type.map((f,index)=>(
                                            <button key={index} onClick={()=>multipleSelection("type",f)}
                                            className={`${selected.type.includes(f)?"bg-primary-500":""} types`}
                                            >{f}</button>
                                        ))}
                                 </div>
                                <div className="flex flex-col gap-0.5">
                                        {filters.risk.map((f,index)=>(
                                            <button key={index} onClick={()=>multipleSelection("risk",f)}
                                            className={`${selected.risk.includes(f)?"bg-primary-500":""} risks `}
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