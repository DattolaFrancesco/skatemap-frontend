'use client'
import { useEffect, useRef, useState } from "react"
import NavLinks from "./NavLinks"
import { useRouter } from "next/navigation"
import ChatBot from "./ChatBot"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import useNavigationStore from "../store/NavigationStore"
import useSpotStore from "../store/SpotStore"

export default function NavBar() {
    const filters = {
        location: ["Africa", "Asia", "Europe", "North America", "Sud America", "Antartide", "Oceania"],
        type: ["Rail", "Ledge", "Stair", "Skatepark", "Street"],
        risk: ["High", "Medium", "Low"]
    }
    const [selected, setSelected] = useState({ location: [], type: [], risk: [] })
    const [params, setParams] = useState(null)
    const [search, setSearch] = useState(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [openFilter, setOpenFilter] = useState(null)
    const tlRef = useRef(null)
    const tlChildRef = useRef(null)
    const inputRef = useRef(null)
    const router = useRouter()
    const containerRef = useRef(null)
    const locationBtnRef = useRef(null)
    const typeBtnRef = useRef(null)
    const riskBtnRef = useRef(null)
    const isAnimating = useRef(false)
    const currentParentY = useRef(0)
    const setReset = useSpotStore((data)=>data.setReset)

    useEffect(() => {
        const p = new URLSearchParams()
        selected.location.forEach(f => p.append("continent", f.toUpperCase().replace(/\s/g, "")))
        selected.type.forEach(f => p.append("type", f.toUpperCase()))
        selected.risk.forEach(f => p.append("risk", f.toUpperCase()))
        if (search !== null) p.append("search", search)
        router.push(`?${p.toString()}&_t=${1}`, { scroll: false })
        setParams(p)
    }, [selected, router, search])

    const multipleSelection = (category, f) => {
        setSelected(prev => ({
            ...prev,
            [category]: prev[category].includes(f) ? prev[category].filter(x => x !== f) : [...(prev[category] || []), f]
        }))
    }

    const getRelativeY = (btnRef) => {
        if (!btnRef.current || !containerRef.current) return 0
        return btnRef.current.getBoundingClientRect().top - containerRef.current.getBoundingClientRect().top
    }

    const getRelativeX = (btnRef) => {
        if (!btnRef.current || !containerRef.current) return 0
        return btnRef.current.getBoundingClientRect().right - containerRef.current.getBoundingClientRect().left + 2
    }

    useGSAP(() => {
        gsap.set(".genericFilter", { x: -300, opacity: 0, pointerEvents: 'none' })
        gsap.set(".continent-btn", { x: -300, opacity: 0, pointerEvents: 'none' })
        gsap.set(".type-btn",      { x: -300, opacity: 0, pointerEvents: 'none' })
        gsap.set(".risk-btn",      { x: -300, opacity: 0, pointerEvents: 'none' })
    }, { scope: containerRef })

    useGSAP(() => {
        const els = gsap.utils.toArray(".genericFilter", containerRef.current)
        const continents = gsap.utils.toArray(".continent-btn", containerRef.current)
        const types = gsap.utils.toArray(".type-btn", containerRef.current)
        const risks = gsap.utils.toArray(".risk-btn", containerRef.current)
        const activeChildren = [...continents, ...types, ...risks].filter(el => Number(gsap.getProperty(el, "x")) > -300)
        tlRef.current?.kill()
        tlRef.current = gsap.timeline({
            onStart: () => { isAnimating.current = true },
            onComplete: () => { isAnimating.current = false; if (!filterOpen) setOpenFilter(null) }
        })
        if (filterOpen) {
            els.forEach((el, i) => {
                tlRef.current.to(el, { x: 0, y: i * 22, opacity: 1, pointerEvents: 'auto', duration: 0.15 }, i === 0 ? ">" : "<0.05")
            })
        } else {
            if (activeChildren.length > 0) {
                tlRef.current
                    .to(activeChildren, { y: currentParentY.current, opacity: 0, duration: 0.15, stagger: { each: 0.05, from: "end" } })
                    .to(activeChildren, { x: -300, pointerEvents: 'none', duration: 0.1, stagger: { each: 0.03, from: "end" } })
            }
            tlRef.current
                .to(els, { y: 0, opacity: 0, duration: 0.15, stagger: { each: 0.05, from: "end" } })
                .to(els, { x: -300, pointerEvents: 'none', duration: 0.1, stagger: { each: 0.03, from: "end" } })
        }
    }, { scope: containerRef, dependencies: [filterOpen] })

    useGSAP(() => {
        const continents = gsap.utils.toArray(".continent-btn", containerRef.current)
        const types = gsap.utils.toArray(".type-btn", containerRef.current)
        const risks = gsap.utils.toArray(".risk-btn", containerRef.current)
        const active = [...continents, ...types, ...risks].filter(el => Number(gsap.getProperty(el, "x")) > -300)

        const openChildren = (els, startX, startY) => {
            currentParentY.current = startY
            tlChildRef.current = gsap.timeline({
                onStart: () => { isAnimating.current = true },
                onComplete: () => { isAnimating.current = false }
            })
            tlChildRef.current.to(els[0], { x: startX, y: startY, opacity: 1, pointerEvents: 'auto', duration: 0.15 })
            if (els.length > 1) {
                tlChildRef.current.to(els.slice(1), {
                    x: startX, opacity: 1, pointerEvents: 'auto',
                    y: (i) => startY + (i + 1) * 22, duration: 0.2, stagger: 0.08
                }, "<0.05")
            }
        }

        const doOpen = () => {
            switch (openFilter) {
                case "Location": openChildren(continents, getRelativeX(locationBtnRef), getRelativeY(locationBtnRef)); break
                case "Type":     openChildren(types,      getRelativeX(typeBtnRef),     getRelativeY(typeBtnRef));     break
                case "Risk":     openChildren(risks,      getRelativeX(riskBtnRef),     getRelativeY(riskBtnRef));     break
            }
        }

        tlChildRef.current?.kill()

        if (!openFilter) {
            if (active.length === 0) { isAnimating.current = false; return }
            gsap.timeline({
                onStart: () => { isAnimating.current = true },
                onComplete: () => { isAnimating.current = false }
            })
            .to(active, { y: currentParentY.current, opacity: 0, duration: 0.15, stagger: { each: 0.05, from: "end" } })
            .to(active, { x: -300, pointerEvents: 'none', duration: 0.1, stagger: { each: 0.03, from: "end" } })
            return
        }

        if (active.length === 0) { doOpen(); return }

        tlChildRef.current = gsap.timeline({
            onStart: () => { isAnimating.current = true },
            onComplete: () => { isAnimating.current = false }
        })
        tlChildRef.current
            .to(active, { y: currentParentY.current, opacity: 0, duration: 0.15, stagger: { each: 0.05, from: "end" } })
            .to(active, { x: -300, pointerEvents: 'none', duration: 0.1, stagger: { each: 0.03, from: "end" }, onComplete: doOpen })
    }, { scope: containerRef, dependencies: [openFilter] })

    return (
        <div className="z-10">
            <nav className="navbar p-2">
                <section className="left flex flex-col h-full">
                    <div>
                        <input ref={inputRef} type="text" placeholder="Search" onChange={(e) => setSearch(e.currentTarget.value)} className="w-full"/>
                    </div>
                    <aside className="flex gap-0.5 pt-1">
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
                    </aside>
                    <div className="mt-auto flex flex-col gap-1">
                        <button className="w-fit" onClick={() => {
                            if (isAnimating.current) return
                            setSelected({ location: [], type: [], risk: [] })
                            setSearch(null)
                            inputRef.current.value = ""
                            router.push(``)
                            setReset(true)
                        }}>
                            Reset filters
                        </button>
                        <ChatBot />
                    </div>
                </section>
                <NavLinks params={params} />
            </nav>
        </div>
    )
}