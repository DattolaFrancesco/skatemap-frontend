
'use client'
import dynamic from 'next/dynamic'
import SpotForm from "../../components/SpotForm"
const MapSpotRegistration = dynamic(() => import('../../components/MapSpotRegistration'), { ssr: false })


export default function addSpot(){
    return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">
        <div className="bg-amber-200">
            <MapSpotRegistration/>
            <SpotForm/>
        </div>
        <div className="bg-amber-700">data</div>
    </div>
    )
}