'use client'
import SpotCard from "../components/SpotCard";
import useSpotStore from "../store/SpotStore";

export default function ListGrid() {
    const filteredSpot = useSpotStore((data)=>data.filteredSpot)
    if(filteredSpot?.length == 0) return null
    return (
            <div className="button--glass button p-2 mt-2 flex flex-col gap-2 overflow-y-scroll max-h-[calc(100vh-70px)] relative">
                {filteredSpot?.map((s) => (
                    <SpotCard key={s.id} spot={s}/>
                ))}
            </div>
    )
}