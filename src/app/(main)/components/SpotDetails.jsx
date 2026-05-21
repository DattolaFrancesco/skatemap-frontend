'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
import { RxCross2 } from "react-icons/rx"
import CarouselMedia from "./CarouselMedia"
import OpenMedia from "./OpenMedia";

export default function SpotDetails(){
     const spotOpen = useInsetStore((state) => state.spotOpen);
     const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
     const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
    return(
        <div 
        onClick={()=>{
            setSpotOpen(null)
            setMediaOpen(null)
        }}
        className={` ${spotOpen ? "block" : "hidden"} fixed  inset-0 z-50 bg-black/30 h-full flex justify-center items-center`}>
            <div
            onClick={(e)=>e.stopPropagation()}
            className="bg_custom_spot_details  break-words overflow-hidden">
               {spotOpen && (
                <main className="p-3 flex flex-col justify-between h-full overflow-scroll ">
                    <div className="flex flex-col justify-between h-full relative">
                        <div>
                            <div className="flex justify-between ">
                                <h1 className="font-bold font_details_h1">{spotOpen.name.toUpperCase()}</h1>
                                <RxCross2 size={38} onClick={()=>setSpotOpen(null)} className="cursor-pointer"/>
                            </div>
                            <aside className="flex gap-1">
                            {[...Array(5)].map((_,i)=>(
                            <div key={i} className={`custom_box_size rounded-sm border 
                                ${spotOpen.risk === "HIGH" ? "bg-black":""}
                                ${spotOpen.risk === "MEDIUM" && i<3 ? "bg-black":""}
                                ${spotOpen.risk === "LOW" && i<1 ? "bg-black":""}`}></div>
                            ))}
                            </aside>
                        </div>
                   <div className="h-full flex flex-col justify-around">
                        <section>
                            <div className="flex justify-between"><p>CONTINENT</p><p>{spotOpen.continents}</p></div>
                            <div className="flex justify-between border-t"><p>CITY</p><p>{spotOpen.city}</p></div>
                            <div className="flex justify-between border-t"><p>STREET</p><p>{spotOpen.street}</p></div>
                            <div className="flex justify-between border-t"><p>WEATHER</p><p>sunny</p></div>
                            <div className="flex justify-between border-t"><p>TYPE</p><p>{spotOpen.spotTypes.map((t)=>t.toUpperCase()).join(", ")}</p></div>
                            <div className="flex justify-between border-t"><p>RISK</p><p>{spotOpen.risk}</p></div>
                        </section>
                        <section>
                            <p>{spotOpen.description}</p>
                        </section>
                        <OpenMedia/>
                   </div>
                     </div>
                    <section>
                        <div>
                            <h2 className="font-semibold font_details_h2">Images</h2>
                            <CarouselMedia media={spotOpen.image}/>
                        </div>
                        <div>
                            <h2 className="font-semibold font_details_h2">Videos</h2>
                            <CarouselMedia media={spotOpen.video}/>
                        </div>
                    </section>
                </main>
               )}
            </div>
        </div>
    )
}