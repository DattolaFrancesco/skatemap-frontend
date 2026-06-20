'use client'
import { useEffect, useRef, useState } from "react"
import NavLinks from "./NavLinks"
import { useRouter } from "next/navigation"
import ChatBot from "./ChatBot"
import gsap from "gsap"
import { X } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';
import { useGSAP } from "@gsap/react"
import useSpotStore from "../store/SpotStore"

export default function NavBar() {
    const filters = {
        structure: ["Rail", "Ledge", "Stair"],
        type: ["Street", "Bowl", "Skatepark"],
        risk: ["High", "Medium", "Low"]
    }
    const [selected, setSelected] = useState({ location: [], type: [],structure:[], risk: [] })
    const [params, setParams] = useState(null)
    const [search, setSearch] = useState(null)
    const searchFilter = useRef(null)
    const typeRef = useRef(null)
    const structureRef = useRef(null)
    const [typeOpen, setTypeOpen] = useState(false)
    const [structureOpen, setStructureOpen] = useState(false)
    const inputRef = useRef(null)
    const router = useRouter()
    const containerRef = useRef(null)
    const setReset = useSpotStore((data)=>data.setReset)
    const firstRender = useSpotStore((data)=>data.firstRender)
    const firstRenderGrid = useSpotStore((data)=>data.firstRenderGrid)

    useEffect(() => {
        const p = new URLSearchParams()
        selected.location.forEach(f => p.append("continent", f.toUpperCase().replace(/\s/g, "")))
        selected.type.forEach(f => p.append("type", f.toUpperCase()))
        selected.risk.forEach(f => p.append("risk", f.toUpperCase()))
        selected.structure.forEach(f => p.append("structure", f.toUpperCase()))
        if (search !== null) p.append("search", search)
        router.push(`?${p.toString()}&_t=${Date.now()}`, { scroll: false })
        setParams(p)
        p.delete("_t")
        if(p.toString() === "" && firstRender == 1) {
             setReset(true)
         }
        if(p.toString() === "" && firstRenderGrid == 1) {
             setReset(true)
         }
    }, [selected, router, search])
    const handleSearch = (e) =>{
        const search = e.currentTarget.value
        clearInterval(searchFilter.current)
        searchFilter.current = setTimeout(() => { 
            setSearch(search)
        }, 600);
    }
    const multipleSelection = (category, f) => {
        setSelected(prev => ({
            ...prev,
            [category]: prev[category].includes(f) ? prev[category].filter(x => x !== f) : [...(prev[category] || []), f]
        }))
    }
    useGSAP(() => {
        if(typeOpen && typeRef.current){
            gsap.to(typeRef.current,{
                height:"100%"
            })
        }if(!typeOpen && typeRef.current){
           gsap.to(typeRef.current,{
                height:"0%"
            }) 
        }
        if(structureOpen&& structureRef.current){
            gsap.to(structureRef.current,{
                height:"100%"
            })
        }if(!structureOpen&& structureRef.current){
           gsap.to(structureRef.current,{
                height:"0%"
            }) 
        }
    }, { scope: containerRef, dependencies: [typeOpen, structureOpen] })


    return (
        <div className="z-10">
            <nav className="p-2">
                <section className="flex gap-2">
                    <div className="w-1/4 button--glass button p-2 flex h-fit">
                        <input ref={inputRef} type="text" placeholder="Search" onChange={handleSearch} className="w-full p-0.5 px-1 h-full rounded-s-[5px] placeholder:text-base"/>
                        <button className="p-0.5 text-black rounded-e-[5px]" onClick={()=>{setSearch(""); inputRef.current.value = ""}}><X size={18}/></button>
                    </div>
                  <div className="flex flex-col gap-2">
                        <div className="button--glass button p-2 flex">
                           <div className={`flex flex-col gap-2`}>
                                <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.type == "" ? "" : "bg_login_active"}`}
                                onClick={()=>setTypeOpen(!typeOpen)}>
                                {selected.type == "" && <p>Type of spot</p>}
                                {selected.type != "" && <div className="flex gap-2"><p className="bg_login_active color_login">&#91;{selected.type.length}&#93;</p><p className="bg_login_active color_login"> {selected.type.join(",")}</p></div>}
                                { typeOpen ? <ChevronUp size={22} className={`pt-0.5 ${selected.type.length > 0 ? "color_login" : ""}`}/> :<ChevronDown size={22} className={`pt-0.5 ${selected.type.length > 0 ? "color_login" : ""}`}/>}</button>
                           </div>
                        </div>
                        <div ref={typeRef} className="button--glass button  flex overflow-hidden">
                           <div className={`flex flex-col gap-2 w-full p-2 ${typeOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                              {filters.type.map((t)=>(
                                <button className="rounded-[5px] h-full flex gap-2 items-center"
                                onClick={() => {  multipleSelection("type", t) }}>
                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.type.includes(t) ? "bg-black" : ""}`}></span>{t}</button>
                            ))}
                           </div>
                        </div>
                  </div>
                  <div className="flex flex-col gap-2">
                        <div className="button--glass button p-2 flex">
                           <div className={`flex flex-col gap-2`}>
                                <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.structure == "" ? "" : "bg_login_active"}`}
                                onClick={()=>setStructureOpen(!structureOpen)}>
                                {selected.structure == "" && <p>Structure</p>}
                                {selected.structure != "" && <div className="flex gap-2"><p className="bg_login_active color_login">&#91;{selected.structure.length}&#93;</p><p className="bg_login_active color_login"> {selected.structure.join(",")}</p></div>}
                                { structureOpen ? <ChevronUp size={22} className={`pt-0.5 ${selected.structure.length > 0 ? "color_login" : ""}`}/> :<ChevronDown size={22} className={`pt-0.5 ${selected.structure.length > 0 ? "color_login" : ""}`}/>}</button>
                           </div>
                        </div>
                        <div ref={structureRef} className="button--glass button  flex overflow-hidden">
                           <div className={`flex flex-col gap-2 w-full p-2 ${structureOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                            {filters.structure.map((s)=>(
                                    <button className="rounded-[5px] h-full flex gap-2 items-center"
                                onClick={() => {  multipleSelection("structure", s) }}>
                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.structure.includes(s) ? "bg-black" : ""}`}></span>{s}</button>
                            ))}
                           </div>
                        </div>
                  </div> 

                    {/* <aside className="flex gap-0.5 pt-1">
                        <div>
                            <button className={`${filterOpen ? "bg-primary-500" : ""}`} onClick={() => { if (isAnimating.current) return; setFilterOpen(prev => !prev) }}>
                                Filters
                            </button>
                        </div>
                        <div ref={containerRef} className="relative">
                            <button ref={locationBtnRef} className={`absolute genericFilter ${openFilter === "Location" ? "bg-primary-500" : ""}`}
                                onClick={() => { if (isAnimating.current) return; setOpenFilter(openFilter === "Location" ? null : "Location") }}>
                                Location
                            </button>
                            <button ref={typeBtnRef} className={`absolute genericFilter ${openFilter === "Type" ? "bg-primary-500" : ""}`}
                                onClick={() => { if (isAnimating.current) return; setOpenFilter(openFilter === "Type" ? null : "Type") }}>
                                Type
                            </button>
                            <button ref={riskBtnRef} className={`absolute genericFilter ${openFilter === "Risk" ? "bg-primary-500" : ""}`}
                                onClick={() => { if (isAnimating.current) return; setOpenFilter(openFilter === "Risk" ? null : "Risk") }}>
                                Risk
                            </button>
                            {filters.location.map((f, i) => (
                                <button key={i} onClick={() => { if (isAnimating.current) return; multipleSelection("location", f) }}
                                    className={`absolute continent-btn ${selected.location.includes(f) ? "bg-primary-500" : ""}`}>
                                    {f}
                                </button>
                            ))}
                            {filters.type.map((f, i) => (
                                <button key={i} onClick={() => { if (isAnimating.current) return; multipleSelection("type", f) }}
                                    className={`absolute type-btn ${selected.type.includes(f) ? "bg-primary-500" : ""}`}>
                                    {f}
                                </button>
                            ))}
                            {filters.risk.map((f, i) => (
                                <button key={i} onClick={() => { if (isAnimating.current) return; multipleSelection("risk", f) }}
                                    className={`absolute risk-btn ${selected.risk.includes(f) ? "bg-primary-500" : ""}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </aside> */}
                    {/* <div className="mt-auto flex flex-col gap-1">
                        <button className="w-fit" onClick={() => {
                            if (isAnimating.current) return
                            setSelected({ location: [], type: [], risk: [] })
                            setSearch(null)
                            inputRef.current.value = ""
                            router.push(``)
                            setReset(true)
                            setFilterOpen(prev=>!prev)
                        }}>
                            Reset filters
                        </button>
                        <ChatBot /> 
                    </div> */}
                </section>
                {/* <NavLinks params={params} /> */}
            </nav>
        </div>
    )
}