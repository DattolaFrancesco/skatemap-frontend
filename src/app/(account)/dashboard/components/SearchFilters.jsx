'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const filters = {
  location: ["Africa", "Asia", "Europe", "North America", "Sud America", "Antartide", "Oceania"],
  type: ["Rail", "Ledge", "Stair", "Skatepark", "Street"],
  risk: ["High", "Medium", "Low"]
}

export default function SearchFilters() {
  const [selected, setSelected] = useState({ location: [], type: [], risk: [] })
  const [search, setSearch] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [openFilter, setOpenFilter] = useState(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const containerRef = useRef(null)
  const timelineRef = useRef(null)
  const router = useRouter()

  const multipleSelection = (category, f) => {
    setSelected(prev => ({
      ...prev,
      [category]: prev[category].includes(f) ? prev[category].filter(x => x != f) : [...(prev[category] || []), f]
    }))
  }

  const handleSearch = (e) => {
    const val = e.currentTarget.value
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(val)
    }, 600)
  }

  useEffect(() => {
    const params = new URLSearchParams()
    selected.location.forEach(f => params.append("continent", f.toUpperCase().replace(/\s/g, "")))
    selected.type.forEach(f => params.append("type", f.toUpperCase()))
    selected.risk.forEach(f => params.append("risk", f.toUpperCase()))
    if (search !== null) params.append("search", search)
    router.push(`?${params.toString()}&_t=${Date.now()}`, { scroll: false })
  }, [selected, router, search])

    useGSAP(() => {
        if (!containerRef.current) return
        const generic = gsap.utils.toArray(document.querySelectorAll(".genF"))
        const genericChildren = gsap.utils.toArray(document.querySelectorAll(".genF_children"))
        timelineRef.current = gsap.timeline({
          paused:true,
          onReverseComplete:()=>{
            if (!containerRef.current) return
            gsap.set([generic,genericChildren],{display:"none"})
          }
        })
        timelineRef.current
          .set([generic,genericChildren], { opacity: 0, display:"block" })
          .to(generic, {
                opacity: 1,
                duration: 0.2,
                stagger: 0.1,
                ease: "power2.out"
            })
          .to(genericChildren, {
                opacity: 1,
                duration: 0.1,
                stagger: 0.1,
                ease: "power2.out"
            })
            gsap.set([generic,genericChildren],{display:"none"})
    }, { scope: containerRef })
    useEffect(()=>{
      if(!timelineRef.current) return
      if(filterOpen)timelineRef.current.play()
      else timelineRef.current.reverse()
    },[filterOpen])
  return (
    <div className="flex flex-col gap-0.5 mt-2">
      <input ref={inputRef} type="text" placeholder="Search" onChange={handleSearch} className="w-full md:w-1/2 text-sm md:text-base" />
      <aside ref={containerRef} className="flex gap-0.5">
        <button className={`${!filterOpen ? null : "bg-primary-500"} h-fit text-sm md:text-base`} onClick={() => { setFilterOpen(!filterOpen); setOpenFilter(null) }}>Filters</button>
        <div>
          <div className="flex flex-col gap-0.5 w-fit generic_filters">
            {["Location", "Type", "Risk"].map((label) => {
              const key = label.toLowerCase()
              return (
                <div key={label} className="flex flex-wrap gap-0.5">
                  <div><button className="bg-primary genF" onClick={() => setOpenFilter(openFilter === label ? null : label)}>{label}</button></div>
                  <div className="flex flex-wrap gap-0.5">
                    {filters[key].map((f, i) => (
                      <button key={i} onClick={() => multipleSelection(key, f)} className={`text-sm md:text-base genF_children ${selected[key].includes(f) ? "bg-primary-500" : ""}`}>{f}</button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
      <button className="w-fit text-sm md:text-base" onClick={() => {
        setSelected({ location: [], type: [], risk: [] })
        setSearch(null)
        inputRef.current.value = ""
        router.push(``)
      }}>Reset filters</button>
    </div>
  )
}