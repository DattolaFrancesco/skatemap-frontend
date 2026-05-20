'use client'

import {useState } from "react"
import NavLinks from "./NavLinks"

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
    const [filterOpen,setFilterOpen] = useState(false)
    const [openFilter, setOpenFilter] = useState(null)
    const multipleSelection = (category,f)=>{
         setSelected(prev=>({
            ...prev,
            [category]: prev[category].includes(f)?prev[category].filter(x=>x!=f):[...(prev[category] || []),f]
         }))
    }
    return(
       <div>
        <nav className="navbar">
        <section className="left flex flex-col h-full">
            {/* input search div */}
            <div><input type="text" placeholder="Search" className="border w-full"/></div>
            <aside className="flex gap-0.5 pt-2">
                    {/* filter main div  */}
                   <div><button  
                    className={`${!filterOpen?null :"bg-black/40"}`}
                    onClick={()=>{
                    setFilterOpen(!filterOpen)
                    setOpenFilter(null)
                    }}>Filters</button></div>
                    {/* generics div like loc-type-risk */}
                    <div className={`${filterOpen? "" : "invisible"}`}>
                       <div className="flex flex-col gap-0.5 w-fit generic_filters">
                            <div className="relative" >
                                <button
                                    data-label="Location"
                                    className={`w-full ${openFilter == null || openFilter !== "Location"   ? null : "bg-black/40"}`}
                                    onClick={()=>{setOpenFilter(openFilter === "Location"?null :"Location")}}>Location
                                </button>
                                <div 
                                className={`absolute flex flex-col gap-0.5 top-0 left-21 ${openFilter === "Location" ? "" : "invisible"}`}>
                                   {filters.location.map((f,index)=>(
                                    <button key={index} onClick={()=>multipleSelection("location",f)} 
                                    className={selected.location.includes(f)?"bg-black/40":""}
                                    >{f}</button>
                                   ))}
                                </div> 
                            </div>
                            <div className="relative">
                                <button 
                                data-label="Type"
                                className={`w-full ${openFilter == null || openFilter !== "Type"   ? null : "bg-black/40"}`}
                                onClick={()=>{setOpenFilter(openFilter === "Type"?null :"Type")}}>Type
                                </button>
                                <div
                                    className={`absolute flex flex-col gap-0.5 top-0 left-21 ${openFilter === "Type" ? "" : "invisible"}`}>
                                    {filters.type.map((f,index)=>(
                                        <button key={index} onClick={()=>multipleSelection("type",f)}
                                        className={selected.type.includes(f)?"bg-black/40":""}
                                        >{f}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <button 
                                data-label="Risk"
                                className={`w-full ${openFilter == null || openFilter !== "Risk"   ? null : "bg-©"}`} 
                                onClick={()=>{setOpenFilter(openFilter === "Risk"?null :"Risk")}}>Risk
                                </button>
                                <div 
                                className={`absolute flex flex-col gap-0.5 top-0 left-21 ${openFilter === "Risk" ? "" : "invisible"}`}>
                                    {filters.risk.map((f,index)=>(
                                        <button key={index} onClick={()=>multipleSelection("risk",f)}
                                        className={selected.risk.includes(f)?"bg-black/40":""}
                                        >{f}</button>
                                    ))}
                                </div>
                            </div>
                       </div>
                    </div>
            </aside>
            <div className="mt-auto flex flex-col gap-1.5">
                <button className="w-fit active:bg-black/40"onClick={()=>setSelected({ location: [], type: [], risk: [] })}>Reset filters</button>
                <button className="w-full text-start">say something</button>
            </div>
        </section>
        <NavLinks/>
        </nav>
       </div>
    )
}