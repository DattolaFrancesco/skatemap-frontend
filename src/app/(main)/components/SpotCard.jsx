'use client'
import useSpotStore from "../store/SpotStore"
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const structuresName = ["ledge", "rail", "ramp", "stair"]

export default function SpotCard({ spot }) {
    const pathname = usePathname()
    const activeSpot = useSpotStore((data) => data.spot)
    const setPendingSpot = useSpotStore((s) => s.setPendingSpot)
    const setEliminationSpot = useSpotStore((s) => s.setEliminationSpot)
    const setAskPermission = useSpotStore((s) => s.setAskPermission)
    const setAskPermissionPending = useSpotStore((s) => s.setAskPermissionPending)
    const nameMaiusc = spot.name?.slice(0, 1).toUpperCase()
    const nameMinusc = spot.name?.slice(1)?.toLowerCase()
    const cityMaiusc = spot.city?.slice(0, 1)
    const cityMinusc = spot.city?.slice(1)?.toLowerCase()
    const countryMaiusc = spot.country?.slice(0, 1)
    const countryMinusc = spot.country?.slice(1)?.toLowerCase()
    const streetMaiusc = spot.street?.slice(0, 1)
    const streetMinusc = spot.street?.slice(1)?.toLowerCase()
    const isSkatepark = spot.spotTypes.includes("SKATEPARK")
    const isStreet = spot.spotTypes.includes("STREET")
    const isBowl = spot.spotTypes.includes("BOWL")
    const router = useRouter()
    const resolvedParams = useSearchParams()
    const isDashboard = pathname.includes("/dashboard")
    const isDashboardAll = pathname == "/dashboard/allSpot"

    function handleCardClick() {
        const p = new URLSearchParams(resolvedParams.toString())
        p.set("selectedSpot", spot.id)
        router.push(`?${p.toString()}`, { scroll: false })
    }

    function handleDelete(e) {
        e.stopPropagation()
        setEliminationSpot(spot)
        setAskPermission(true)
    }
    function handlePending(e) {
        e.stopPropagation()
        setPendingSpot(spot)
        setAskPermissionPending(true)
    }

    function handleModify(e) {
        e.stopPropagation()
        router.push(`/spot/modify/${spot.id}`)
    }

    return (
        <div
            onClick={handleCardClick}
            className={`relative w-full flex justify-between rounded-[5px]
                ${activeSpot == spot.id ? "bg_activated" : "bg_login"}
                ${isDashboard && spot.status === "PENDING" ? "border-2 border-orange-400" : ""}
                ${isDashboard && spot.status === "APPROVED" ? "border-2 border-green-400" : ""}
                ${isDashboard && spot.status === "UNAPPROVED" ? "border-2 border-red-500" : ""}`}
        >
            <div className="flex-1 min-w-0 ps-2 color_p_gray">
                <div className="flex items-center justify-between gap-2">
                    <p className={`text-xl ${activeSpot == spot.id ? "color_h1_activated" : "text-black"} truncate bg-transparent`}>
                        {nameMaiusc}{nameMinusc}
                    </p>
                    <div className={`shrink-0 w-[10px] h-[10px] rounded-full
                        ${spot.risk === "LOW" ? "bg-green-500" : ""}
                        ${spot.risk === "MEDIUM" ? "bg-orange-500" : ""}
                        ${spot.risk === "HIGH" ? "bg-red-500" : ""}`}
                    />
                </div>
                <p className="truncate bg-transparent">{cityMaiusc}{cityMinusc}, {countryMaiusc}{countryMinusc}</p>
                <p className="truncate bg-transparent">{streetMaiusc}{streetMinusc}</p>
                <p className="flex items-center gap-1 bg-transparent">
                    {isSkatepark && "Skatepark"}
                    {isStreet && "Street"}
                    {isBowl && "Bowl"}
                    ⋅
                    {structuresName.map((s) => {
                        if (spot.spotTypes.includes(s.toUpperCase()))
                            return <Image key={s} src={`/structure/${s}.svg`} width={12} height={12} alt={s} />
                    })}
                </p>
            </div>
            <img
                src={spot.thumbnailUrl}
                alt="skate spot image"
                className="shrink-0 rounded-xl w-[100px] h-[100px] p-2 object-cover"
            />
            {isDashboard && (
                <div className="absolute top-1 right-1 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={handleDelete} className="text-xs px-1 bg-red-100 rounded">Delete</button>
                    <button onClick={handleModify} className="text-xs px-1 bg-blue-100 rounded">Modify</button>
                    { isDashboardAll && <button onClick={handlePending} className="text-xs px-1 bg-blue-100 rounded">Pending</button>}
                </div>
            )}
        </div>
    )
}