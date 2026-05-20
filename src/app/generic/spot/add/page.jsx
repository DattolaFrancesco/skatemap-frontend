'use client'

import MapSpotRegistration from "@/app/components/MapSpotRegistration"
import SpotForm from "@/app/components/SpotForm";

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