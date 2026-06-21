'use client'
import SpotCard from "../components/SpotCard";
import useSpotStore from "../store/SpotStore";

export default function ListGrid() {
    const filteredSpot = useSpotStore((data)=>data.filteredSpot)
    console.log(filteredSpot)
    return (
            <div className="button--glass button p-2 mt-2 flex flex-col gap-2 ">
                {filteredSpot?.map((s) => (
                    <SpotCard spot={s}/>
                ))}
            </div>
    )
}