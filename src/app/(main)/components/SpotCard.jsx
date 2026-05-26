'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
export default function SpotCard({spot}){
    const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
    const cityMaiusc = spot.city?.slice(0,1)
    const cityMinusc = spot.city?.slice(1)?.toLowerCase()
    return(
        <div onClick={()=>setSpotOpen(spot)} className="transition-all duration-400 hover:opacity-[0.6]">
            <img src={spot.image[0]?.link} alt="skate spot image" className="rounded-xs w-full height_custom_spot_card object-cover"/>
            <div className="grid grid-cols-[2fr_auto] gap-1 mt-1">
                <p className="text-xs p-1 rounded-xs truncate ">{spot.name}</p>
                <p className="text-xs text-end p-1 rounded-xs truncate bg-primary-300">{cityMaiusc+cityMinusc}</p>
            </div>
        </div>
    )
}