'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
export default function SpotCard({spot}){
    // const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
    const cityMaiusc = spot.city?.slice(0,1)
    const cityMinusc = spot.city?.slice(1)?.toLowerCase()
    const countryMaiusc = spot.country?.slice(0,1)
    const countryMinusc = spot.country?.slice(1)?.toLowerCase()
    const isSkatepark = spot.spotTypes.includes("SKATEPARK")
    const isStreet = spot.spotTypes.includes("STREET")
    const isBowl = spot.spotTypes.includes("BOWL")

    return(
        <div 
        // onClick={()=>setSpotOpen(spot.id)}
        className="w-full flex justify-between bg_login rounded-[5px]"
        >
            <div className="flex-1 ps-2">
                <div className="flex items-center justify-between">
                    <p className="text-3xl">{spot.name}</p>
                    <div className={`w-[10px] h-[10px] rounded-full 
                    ${spot.risk === "LOW" ? "bg-green-500" : ""}
                    ${spot.risk === "MEDIUM" ? "bg-orange-500" : ""}
                    ${spot.risk === "HIGH" ? "bg-red-500" : ""}`}></div>
                </div>
                <p className="text-black/50 text-sm">{cityMaiusc+cityMinusc}, {countryMaiusc+countryMinusc}</p>
                <p className="text-black/50 text-sm">via placeholder</p>
                <p className="text-black/50 text-sm">{isSkatepark && "Skatepark"}{isStreet && "Street"}{isBowl && "Bowl"}⋅ symbol</p>
            </div>
            <img src={spot.thumbnailUrl} alt="skate spot image" className="rounded-xl w-[120px] h-[120px] p-2 object-cover"/>
        </div>
    )
}