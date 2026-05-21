'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"

export default function SpotDetails(){
     const spotOpen = useInsetStore((state) => state.spotOpen);
     const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
    return(
        <div 
        onClick={()=>setSpotOpen(null)}
        className={` ${spotOpen ? "block" : "hidden"} absolute left-2 inset-0 z-50 bg-black/30`}>
            <div
            onClick={(e)=>e.stopPropagation()}
            className="bg_custom_spot_details w-1/2 h-full">
               {spotOpen && (<h1>{spotOpen.name}</h1>)}
            </div>
        </div>
    )
}