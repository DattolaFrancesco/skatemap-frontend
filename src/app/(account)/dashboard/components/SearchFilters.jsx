'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

  const multipleSelection = (category, f) => {
    setSelected(prev => ({
      ...prev,
      [category]: prev[category].includes(f) ? prev[category].filter(x => x != f) : [...(prev[category] || []), f]
    }))
  }

  useEffect(() => {
    const params = new URLSearchParams()
    selected.location.forEach(f => params.append("continent", f.toUpperCase().replace(/\s/g, "")))
    selected.type.forEach(f => params.append("type", f.toUpperCase()))
    selected.risk.forEach(f => params.append("risk", f.toUpperCase()))
    if (search !== null) params.append("search", search)
    router.push(`?${params.toString()}&_t=${Date.now()}`, { scroll: false })
  }, [selected, router, search])

  return (
    <div className="flex flex-col gap-0.5 mt-2  border-gray-custom border-b pb-2">
      <input ref={inputRef} type="text" placeholder="Search" onChange={(e) => setSearch(e.currentTarget.value)} className="w-full md:w-1/2" />
      <aside className="flex gap-0.5">
        <button className={`${!filterOpen ? null : "bg-primary-500"} h-fit`} onClick={() => { setFilterOpen(!filterOpen); setOpenFilter(null) }}>Filters</button>
        <div className={`${filterOpen ? "" : "hidden"}`}>
          <div className="flex flex-col gap-0.5 w-fit generic_filters">
            {["Location", "Type", "Risk"].map((label) => {
              const key = label.toLowerCase()
              return (
                <div key={label} className="flex flex-wrap gap-0.5">
                  <div><button className="bg-primary" onClick={() => setOpenFilter(openFilter === label ? null : label)}>{label}</button></div>
                  <div className={`flex flex-wrap  gap-0.5  `}>
                    {filters[key].map((f, i) => (
                      <button key={i} onClick={() => multipleSelection(key, f)} className={selected[key].includes(f) ? "bg-primary-500" : ""}>{f}</button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </aside>
      <button className="w-fit" onClick={() => {
        setSelected({ location: [], type: [], risk: [] })
        setSearch(null)
        inputRef.current.value = ""
        router.push(``)
      }}>Reset filters</button>
    </div>
  )
}