'use client'

import { useEffect, useRef, useState } from "react"
import NavLinks from "./NavLinks"
import { useRouter } from "next/navigation"
import ChatBot from "./ChatBot"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

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
    const [filterIsReady, setFilterIsReady] = useState(true)
    const [btnIsReady, setBtnIsReady] = useState(true)

    const multipleSelection = (category, f) => {
        setSelected(prev => ({
            ...prev,
            [category]: prev[category].includes(f)
                ? prev[category].filter(x => x !== f)
                : [...(prev[category] || []), f]
        }))
    }

    useEffect(() => {
        const p = new URLSearchParams()
        selected.location.forEach(f => p.append("continent", f.toUpperCase().replace(/\s/g, "")))
        selected.type.forEach(f => p.append("type", f.toUpperCase()))
        selected.risk.forEach(f => p.append("risk", f.toUpperCase()))
        if (search !== null) p.append("search", search)
        router.push(`?${p.toString()}&_t=${Date.now()}`, { scroll: false })
        setParams(p)
    }, [selected, router, search])

    useGSAP(() => {
        gsap.set(".genericFilter", { x: -300, opacity: 0, pointerEvents: 'none' })
        gsap.set(".continent-btn", { x: -300, opacity: 0, pointerEvents: 'none' })
        gsap.set(".type-btn", { x: -300, opacity: 0, pointerEvents: 'none' })
        gsap.set(".risk-btn", { x: -300, opacity: 0, pointerEvents: 'none' })
    }, { scope: containerRef })

    useGSAP(() => {
        const els = gsap.utils.toArray(".genericFilter", containerRef.current)
        tlRef.current?.kill()

        if (filterOpen) {
            tlRef.current = gsap.timeline({ onComplete: () => setFilterIsReady(true) })
            els.forEach((el, i) => {
                tlRef.current.to(el, {
                    x: 0,
                    y: i * 22,
                    opacity: 1,
                    pointerEvents: 'auto',
                    duration: 0.15
                }, i === 0 ? ">" : "<0.05")
            })
        } else {
            setFilterIsReady(false)
            tlRef.current = gsap.timeline({
                onComplete: () => {
                    setFilterIsReady(true)
                    setOpenFilter(null)
                }
            })
            tlRef.current.to(els, {
                x: -300,
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.15,
                stagger: 0.05
            })
        }
    }, { scope: containerRef, dependencies: [filterOpen] })

    useGSAP(() => {
        const continents = gsap.utils.toArray(".continent-btn", containerRef.current)
        const types = gsap.utils.toArray(".type-btn", containerRef.current)
        const risks = gsap.utils.toArray(".risk-btn", containerRef.current)
        const all = [...continents, ...types, ...risks]

        tlChildRef.current?.kill()

        const getRelativeY = (btnRef) => {
            if (!btnRef.current || !containerRef.current) return 0
            const containerTop = containerRef.current.getBoundingClientRect().top
            const btnTop = btnRef.current.getBoundingClientRect().top
            return btnTop - containerTop
        }

        const getRelativeX = (btnRef) => {
            if (!btnRef.current || !containerRef.current) return 0
            const containerLeft = containerRef.current.getBoundingClientRect().left
            const btnRight = btnRef.current.getBoundingClientRect().right
            return btnRight - containerLeft + 2
        }

        const openChildren = (els, startX, startY) => {
            const tl = gsap.timeline({ onComplete: () => setBtnIsReady(true) })
            tl.to(els[0], { x: startX, y: startY, opacity: 1, pointerEvents: 'auto', duration: 0.15 })
            if (els.length > 1) {
                tl.to(els.slice(1), {
                    x: startX,
                    opacity: 1,
                    pointerEvents: 'auto',
                    y: (i) => startY + (i + 1) * 22,
                    duration: 0.2,
                    stagger: 0.08
                }, "<0.05")
            }
        }

        gsap.to(all, {
            x: -300,
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.12,
            onComplete: () => {
                if (!openFilter) { setBtnIsReady(true); return }
                switch (openFilter) {
                    case "Location": openChildren(continents, getRelativeX(locationBtnRef), getRelativeY(locationBtnRef)); break
                    case "Type":     openChildren(types,      getRelativeX(typeBtnRef),     getRelativeY(typeBtnRef));     break
                    case "Risk":     openChildren(risks,      getRelativeX(riskBtnRef),     getRelativeY(riskBtnRef));     break
                    default: setBtnIsReady(true)
                }
            }
        })

    }, { scope: containerRef, dependencies: [openFilter] })

    return (
        <div className="z-10">
            <nav className="navbar p-2">
                <section className="left flex flex-col h-full">
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search"
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            className="w-full"
                        />
                    </div>
                    <aside className="flex gap-0.5 pt-1">
                        <div>
                            <button
                                className={`${filterOpen ? "bg-primary-500" : ""} ${filterIsReady ? "" : "disabled-btn"}`}
                                onClick={() => {
                                    const next = !filterOpen
                                    setFilterOpen(next)
                                    if (!next) return
                                    setFilterIsReady(false)
                                }}>
                                Filters
                            </button>
                        </div>

                        <div ref={containerRef} className="relative">
                            <button
                                ref={locationBtnRef}
                                className={`absolute genericFilter ${openFilter === "Location" ? "bg-primary-500" : ""} ${btnIsReady ? "" : "disabled-btn"}`}
                                onClick={() => { setOpenFilter(openFilter === "Location" ? null : "Location"); setBtnIsReady(false) }}>
                                Location
                            </button>
                            <button
                                ref={typeBtnRef}
                                className={`absolute genericFilter ${openFilter === "Type" ? "bg-primary-500" : ""} ${btnIsReady ? "" : "disabled-btn"}`}
                                onClick={() => { setOpenFilter(openFilter === "Type" ? null : "Type"); setBtnIsReady(false) }}>
                                Type
                            </button>
                            <button
                                ref={riskBtnRef}
                                className={`absolute genericFilter ${openFilter === "Risk" ? "bg-primary-500" : ""} ${btnIsReady ? "" : "disabled-btn"}`}
                                onClick={() => { setOpenFilter(openFilter === "Risk" ? null : "Risk"); setBtnIsReady(false) }}>
                                Risk
                            </button>

                            {filters.location.map((f, i) => (
                                <button key={i}
                                    onClick={() => multipleSelection("location", f)}
                                    className={`absolute continent-btn ${selected.location.includes(f) ? "bg-primary-500" : ""}`}>
                                    {f}
                                </button>
                            ))}

                            {filters.type.map((f, i) => (
                                <button key={i}
                                    onClick={() => multipleSelection("type", f)}
                                    className={`absolute type-btn ${selected.type.includes(f) ? "bg-primary-500" : ""}`}>
                                    {f}
                                </button>
                            ))}

                            {filters.risk.map((f, i) => (
                                <button key={i}
                                    onClick={() => multipleSelection("risk", f)}
                                    className={`absolute risk-btn ${selected.risk.includes(f) ? "bg-primary-500" : ""}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="mt-auto flex flex-col gap-1">
                        <button className="w-fit" onClick={() => {
                            setSelected({ location: [], type: [], risk: [] })
                            setSearch(null)
                            inputRef.current.value = ""
                            router.push(``)
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