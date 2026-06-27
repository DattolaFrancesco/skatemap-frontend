'use client'
import { useEffect, useRef, useState } from "react"
import NavLinks from "./NavLinks"
import { useRouter } from "next/navigation"
import ChatBot from "./ChatBot"
import gsap from "gsap"
import { MoveLeft,X,Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useGSAP } from "@gsap/react"
import useSpotStore from "../store/SpotStore"
import ListGrid from "./ListGrid"
import Details from "./Details"
import { useSearchParams } from "next/navigation"

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
    const setOpenList = useSpotStore((data) => data.setOpenList)
    const openList = useSpotStore((data) => data.openList)
    const [structureOpen, setStructureOpen] = useState(false)
    const inputRef = useRef(null)
    const router = useRouter()
    const containerRef = useRef(null)
    const spotContainerRef = useRef(null)
    const setReset = useSpotStore((data) => data.setReset)
    const firstRender = useSpotStore((data) => data.firstRender)
    const firstRenderGrid = useSpotStore((data) => data.firstRenderGrid)
    const setSpot = useSpotStore((data)=>data.setSpot)
    const activeSpot = useSpotStore((data)=>data.spot)
    const resolvedParams = useSearchParams()
    const [isTablet, setIsTablet] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    

    const urlParams = (isReturn)=>{
        const p = new URLSearchParams()
        const selectedSpot = resolvedParams.get("selectedSpot")
        if(!selected) console.log("no")
        selected.location.forEach(f => p.append("continent", f.toUpperCase().replace(/\s/g, "")))
        selected.type.forEach(f => p.append("type", f.toUpperCase()))
        selected.risk.forEach(f => p.append("risk", f.toUpperCase()))
        selected.structure.forEach(f => p.append("structure", f.toUpperCase()))
        if (search !== null) p.append("search", search)
        if(selectedSpot){
            setOpenList(true)
        }
        setParams(p)
        p.delete("_t")
        if (p.toString() === "" && firstRender == 1) {
            setReset(true)
        }
        if (p.toString() === "" && firstRenderGrid == 1) {
            setReset(true)
        }
        if(isReturn){
            p.delete("selectedSpot")
            router.push(`?${p.toString()}&_t=${Date.now()}`, { scroll: false })
        }
        router.push(`?${p.toString()}&_t=${Date.now()}`, { scroll: false })
    }
    useEffect(() => {
        urlParams(false)
    }, [selected, router, search])

    const handleSearch = (e) => {
        const search = e.currentTarget.value
        setSearch(search)
        if(search != "") setSpot(null)
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
            gsap.to(spotContainerRef.current, { gridTemplateRows: openList ? "1fr" : "0fr" })
        }
    }, { scope: containerRef, dependencies: [openList] })

    useEffect(() => {
        const check = () => setIsTablet(window.innerWidth > 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    useEffect(()=>{console.log(activeSpot)},[activeSpot])
    return (
        <>
        <nav className="pt-5 px-3 md:px-5 w-full md:w-[40%] lg:w-[30%] xl:w-[25%] z-10 ">
                <section ref={containerRef} className="flex items-start gap-1 w-full">
                    <div className="w-full relative">
                         {!isMobile && <Details postion={"absolute"}/>}
                        <div className=" button--glass button p-1.5 flex">
                            {!isMobile && activeSpot && <button onClick={()=>{
                                setSpot(null)
                                urlParams(true)
                                setSearch("")
                                }} className="rounded-s-[5px] self-stretch"><MoveLeft size={12}/></button>}
                            <input ref={inputRef} type="text" placeholder="Search" value={search} onClick={()=>setOpenList(true)} onChange={handleSearch} className={`w-full  px-1 text-[12px] ${isMobile || !activeSpot ? "rounded-s-[5px]" : ""}`} />
                            <button className={` text-black rounded-e-[5px] self-stretch`}  onClick={() => {
                                if(openList){setOpenList(false);setSpot(null)}
                                }}>{openList && <X size={12}/>} {!openList && <Search size={12}/>}</button>
                {!isMobile && <div className="z-50 absolute top-10 md:top-0 md:left-[100%] flex gap-1 md:ms-1">
                <div className="flex flex-col gap-1 w-fit">
                            <div className="button--glass button p-1.5 flex">
                                <div className={`flex flex-col gap-2`}>
                                    <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.type == "" ? "" : "bg_activated_light"}`}
                                        onClick={() => setTypeOpen(!typeOpen)}>
                                        {selected.type == "" && <p>Type of spot</p>}
                                        {selected.type != "" && <div className="flex gap-2"><p className="bg_activated_light color_login">&#91;{selected.type.length}&#93;</p><p className="bg_activated_light"> {selected.type.join(",")}</p></div>}
                                        {typeOpen ? <ChevronUp size={12} className={`pt-0.5`} /> : <ChevronDown size={12} className={`pt-0.5 ${selected.type.length > 0 ? "color_login" : ""}`} />}</button>
                                </div>
                            </div>
                            <div ref={typeRef} className="button--glass button grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                                <div className="overflow-hidden">
                                    <div className={`flex flex-col gap-1.5 w-full p-1.5 ${typeOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                                        {filters.type.map((t) => (
                                            <button className="rounded-[5px] h-full flex gap-2 items-center"
                                                onClick={() => { multipleSelection("type", t) }}>
                                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.type.includes(t) ? "bg-black" : ""}`}></span><p>{t}</p></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-fit">
                            <div className="button--glass button p-1.5 flex">
                                <div className={`flex flex-col gap-2`}>
                                    <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.structure == "" ? "" : "bg_activated_light"}`}
                                        onClick={() => setStructureOpen(!structureOpen)}>
                                        {selected.structure == "" && <p>Structure</p>}
                                        {selected.structure != "" && <div className="flex gap-2"><p className="bg_activated_light color_login">&#91;{selected.structure.length}&#93;</p><p className="bg_activated_light"> {selected.structure.join(",")}</p></div>}
                                        {structureOpen ? <ChevronUp size={12} className={`pt-0.5`} /> : <ChevronDown size={12} className={`pt-0.5 ${selected.structure.length > 0 ? "color_login" : ""}`} />}</button>
                                </div>
                            </div>
                            <div ref={structureRef} className="button--glass button grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                                <div className="overflow-hidden">
                                    <div className={`flex flex-col gap-1.5 w-full p-1.5 ${structureOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                                        {filters.structure.map((s) => (
                                            <button key={s.id} className="rounded-[5px] h-full flex gap-2 items-center"
                                                onClick={() => { multipleSelection("structure", s) }}>
                                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.structure.includes(s) ? "bg-black" : ""}`}></span><p>{s}</p></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                        </div>
                        {!isMobile && <div ref={spotContainerRef} className="grid overflow-hidden " style={{ gridTemplateRows: "0fr" }}>
                            <div className="overflow-hidden rounded-[5px] relative">
                                {!isTablet && !activeSpot && <ListGrid position={"static"}/>}
                                {isTablet &&  <ListGrid position={"static"}/>}
                            </div>
                        </div>}
                    </div>
                </section>
                {isMobile && <div className="z-50 my-1 flex gap-1 md:ms-1">
                <div className="flex flex-col gap-1 w-fit">
                            <div className="button--glass button p-1.5 flex">
                                <div className={`flex flex-col gap-2`}>
                                    <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.type == "" ? "" : "bg_activated_light"}`}
                                        onClick={() => setTypeOpen(!typeOpen)}>
                                        {selected.type == "" && <p>Type of spot</p>}
                                        {selected.type != "" && <div className="flex gap-2"><p className="bg_activated_light color_login">&#91;{selected.type.length}&#93;</p><p className="bg_activated_light"> {selected.type.join(",")}</p></div>}
                                        {typeOpen ? <ChevronUp size={12} className={`pt-0.5`} /> : <ChevronDown size={12} className={`pt-0.5 ${selected.type.length > 0 ? "color_login" : ""}`} />}</button>
                                </div>
                            </div>
                            <div ref={typeRef} className="button--glass button grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                                <div className="overflow-hidden">
                                    <div className={`flex flex-col gap-1.5 w-full p-1.5 ${typeOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                                        {filters.type.map((t) => (
                                            <button className="rounded-[5px] h-full flex gap-2 items-center"
                                                onClick={() => { multipleSelection("type", t) }}>
                                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.type.includes(t) ? "bg-black" : ""}`}></span><p>{t}</p></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-fit">
                            <div className="button--glass button p-1.5 flex">
                                <div className={`flex flex-col gap-2`}>
                                    <button className={`rounded-[5px] h-full flex gap-2 items-center ${selected.structure == "" ? "" : "bg_activated_light"}`}
                                        onClick={() => setStructureOpen(!structureOpen)}>
                                        {selected.structure == "" && <p>Structure</p>}
                                        {selected.structure != "" && <div className="flex gap-2"><p className="bg_activated_light color_login">&#91;{selected.structure.length}&#93;</p><p className="bg_activated_light"> {selected.structure.join(",")}</p></div>}
                                        {structureOpen ? <ChevronUp size={12} className={`pt-0.5`} /> : <ChevronDown size={12} className={`pt-0.5 ${selected.structure.length > 0 ? "color_login" : ""}`} />}</button>
                                </div>
                            </div>
                            <div ref={structureRef} className="button--glass button grid overflow-hidden" style={{ gridTemplateRows: "0fr" }}>
                                <div className="overflow-hidden">
                                    <div className={`flex flex-col gap-1.5 w-full p-1.5 ${structureOpen ? "" : "opacity-0"} transition-opacity duration-500`}>
                                        {filters.structure.map((s) => (
                                            <button key={s.id} className="rounded-[5px] h-full flex gap-2 items-center"
                                                onClick={() => { multipleSelection("structure", s) }}>
                                                <span className={`w-[10px] h-[10px] mt-0.5 border border-black rounded-[2px] ${selected.structure.includes(s) ? "bg-black" : ""}`}></span><p>{s}</p></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </nav>
            {isMobile && openList && <ListGrid position={"absolute"}/>}
</>
    )
}
