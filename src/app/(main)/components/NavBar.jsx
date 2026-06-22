'use client'
import { useEffect, useRef, useState } from "react"
import NavLinks from "./NavLinks"
import { useRouter } from "next/navigation"
import ChatBot from "./ChatBot"
import gsap from "gsap"
import {Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useGSAP } from "@gsap/react"
import useSpotStore from "../store/SpotStore"
import ListGrid from "./ListGrid"
import Details from "./Details"

export default function NavBar() {
    const filters = {
        structure: ["Rail", "Ledge", "Stair"],
        type: ["Street", "Bowl", "Skatepark"],
        risk: ["High", "Medium", "Low"]
    }
    const [selected, setSelected] = useState({ location: [], type: [], structure: [], risk: [] })
    const [params, setParams] = useState(null)
    const [search, setSearch] = useState("")
    const typeRef = useRef(null)
    const structureRef = useRef(null)
    const [typeOpen, setTypeOpen] = useState(false)
    const [spotOpen, setSpotOpen] = useState(false)
    const [structureOpen, setStructureOpen] = useState(false)
    const inputRef = useRef(null)
    const router = useRouter()
    const containerRef = useRef(null)
    const spotContainerRef = useRef(null)
    const setReset = useSpotStore((data) => data.setReset)
    const firstRender = useSpotStore((data) => data.firstRender)
    const firstRenderGrid = useSpotStore((data) => data.firstRenderGrid)
    const setSpot = useSpotStore((data)=>data.setSpot)

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
        if (p.toString() === "" && firstRender == 1) {
            setReset(true)
        }
        if (p.toString() === "" && firstRenderGrid == 1) {
            setReset(true)
        }
    }, [selected, router, search])

    const handleSearch = (e) => {
        const search = e.currentTarget.value
            setSearch(search)
    }

    const multipleSelection = (category, f) => {
        setSelected(prev => ({
            ...prev,
            [category]: prev[category].includes(f) ? prev[category].filter(x => x !== f) : [...(prev[category] || []), f]
        }))
    }

    useGSAP(() => {
        if (typeRef.current) {
            gsap.to(typeRef.current, { gridTemplateRows: typeOpen ? "1fr" : "0fr" })
        }
        if (structureRef.current) {
            gsap.to(structureRef.current, { gridTemplateRows: structureOpen ? "1fr" : "0fr" })
        }
    }, { scope: containerRef, dependencies: [typeOpen, structureOpen] })

    useGSAP(() => {
        if (spotContainerRef.current) {
            gsap.to(spotContainerRef.current, { gridTemplateRows: spotOpen ? "1fr" : "0fr" })
        }
    }, { scope: containerRef, dependencies: [spotOpen] })

    return (
        <>
        <nav className="p-2 w-2/4 lg:w-1/4 z-10 relative">
                <section ref={containerRef} className="flex items-start gap-2 w-full">
                    <div className="w-full">
                        <div className=" button--glass button p-2 flex h-10">
                            <input ref={inputRef} type="text" placeholder="Search" onClick={()=>setSpotOpen(true)} onChange={handleSearch} className="w-full py-0.5 px-1 h-full rounded-s-[5px] placeholder:text-base" />
                            <button className={`h-full text-black rounded-e-[5px] ${spotOpen ? "bg_activated_light" : "" }`}  onClick={() => {
                                if(spotOpen){setSpotOpen(false);setSpot(null)}
                                }}>{spotOpen && <ChevronUp size={22} className={`pt-0.5`}/>} {!spotOpen && <Search size={18} />}</button>
                        </div>
                        <div ref={spotContainerRef} className="grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                            <div className="overflow-hidden rounded-[5px]">
                                <ListGrid />
                            </div>
                        </div>
                    </div>
                </section>
                   <div className="z-10 absolute top-[8px] left-[100%] flex gap-2">
                <div className="flex flex-col gap-2 w-fit">
                            <div className="button--glass button p-2 flex">
                                <div className={`flex flex-col gap-2`}>
                                    <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.type == "" ? "" : "bg_activated_light"}`}
                                        onClick={() => setTypeOpen(!typeOpen)}>
                                        {selected.type == "" && <p>Type of spot</p>}
                                        {selected.type != "" && <div className="flex gap-2"><p className="bg_activated_light color_login">&#91;{selected.type.length}&#93;</p><p className="bg_activated_light"> {selected.type.join(",")}</p></div>}
                                        {typeOpen ? <ChevronUp size={22} className={`pt-0.5`} /> : <ChevronDown size={22} className={`pt-0.5 ${selected.type.length > 0 ? "color_login" : ""}`} />}</button>
                                </div>
                            </div>
                            <div ref={typeRef} className="button--glass button grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                                <div className="overflow-hidden">
                                    <div className={`flex flex-col gap-2 w-full p-2 ${typeOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                                        {filters.type.map((t) => (
                                            <button className="rounded-[5px] h-full flex gap-2 items-center"
                                                onClick={() => { multipleSelection("type", t) }}>
                                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.type.includes(t) ? "bg-black" : ""}`}></span>{t}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-fit">
                            <div className="button--glass button p-2 flex">
                                <div className={`flex flex-col gap-2`}>
                                    <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.structure == "" ? "" : "bg_activated_light"}`}
                                        onClick={() => setStructureOpen(!structureOpen)}>
                                        {selected.structure == "" && <p>Structure</p>}
                                        {selected.structure != "" && <div className="flex gap-2"><p className="bg_activated_light color_login">&#91;{selected.structure.length}&#93;</p><p className="bg_activated_light"> {selected.structure.join(",")}</p></div>}
                                        {structureOpen ? <ChevronUp size={22} className={`pt-0.5`} /> : <ChevronDown size={22} className={`pt-0.5 ${selected.structure.length > 0 ? "color_login" : ""}`} />}</button>
                                </div>
                            </div>
                            <div ref={structureRef} className="button--glass button grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                                <div className="overflow-hidden">
                                    <div className={`flex flex-col gap-2 w-full p-2 ${structureOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                                        {filters.structure.map((s) => (
                                            <button key={s.id} className="rounded-[5px] h-full flex gap-2 items-center"
                                                onClick={() => { multipleSelection("structure", s) }}>
                                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.structure.includes(s) ? "bg-black" : ""}`}></span>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Details postion={"absolute"}/>
            </nav>
</>
    )
}
