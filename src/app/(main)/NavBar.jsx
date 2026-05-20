'use client'

import {useState } from "react"
import NavLinks from "./NavLinks"

export default function NavBar(){
    const [filterOpen,setFilterOpen] = useState(false)
    const [openFilter, setOpenFilter] = useState(null)
    return(
       <div>
        <div className="navbar">
            <div className="left flex flex-col h-full">
                {/* input search div */}
                <div><input type="text" placeholder="Search" className="border w-full"/></div>
              <div className="flex gap-0.5 pt-2">
                     {/* filter main div  */}
                   <div> <button  onClick={()=>setFilterOpen(!filterOpen)}>Filters</button></div>
                    <div className={`${filterOpen? "" : "invisible"}`}>
                        {/* generics div like loc-type-risk */}
                       <div className="flex flex-col gap-0.5 w-fit">
                            <button className="relative "  onClick={()=>setOpenFilter(openFilter === "Location"?null :"Location")}>
                                Location
                            <div className={`absolute flex flex-col gap-0.5 top-0 left-21 ${openFilter === "Location" ? "" : "invisible"}`}>
                                <button>Africa</button>
                                <button>Asia</button>
                                <button>Europe</button>
                                <button>North America</button>
                                <button>Sud America</button>
                                <button>Antartide</button>
                                <button>Oceania</button>
                            </div>  
                            </button>
                            <button className="relative" onClick={()=>setOpenFilter(openFilter === "Type"?null :"Type")}>
                                Type
                            <div 
                            className={`absolute flex flex-col gap-0.5 top-0 left-21 ${openFilter === "Type" ? "" : "invisible"}`}>
                                <button>Rail</button>
                                <button>Ledge</button>
                                <button>Stair</button>
                                <button>Skatepark</button>
                                <button>Street</button>
                           </div>
                            </button>
                            <button className="relative" onClick={()=>setOpenFilter(openFilter === "Risk"?null :"Risk")}>
                                Risk
                            <div className={`absolute flex flex-col gap-0.5 top-0 left-21 ${openFilter === "Risk" ? "" : "invisible"}`}>
                                <button>High</button>
                                <button>Medium</button>
                                <button>Low</button>
                          </div>
                            </button>
                       </div>
                    </div>
              </div>
                <div className="mt-auto"><button className="w-full !text-start">say something</button></div>
            </div>
            <NavLinks/>
        </div>
       </div>
    )
}