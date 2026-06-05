'use client'
import { useEffect, useState, useRef, use } from "react"
import SpotCard from "@/app/(main)/components/SpotCard"
import SpotDetails from "@/app/(main)/components/SpotDetails"
import SearchFilters from "../components/SearchFilters";
import useUserStore from "../components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector"
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PAGE_SIZE = 20;

export default function AllSpotGrid({ searchParams }) {
    const [allSpots, setAllSpots] = useState(null)
    const [filteredSpots, setFilteredSpots] = useState([])
    const resolvedParams = use(searchParams)
    const [currentPage, setCurrentPage] = useState(0)
    const [askPermission, setAskPermission] = useState(false)
    const [askPermissionPending, setAskPermissionPending] = useState(false)
    const [loading, setLoading] = useState(false)
    const [eliminationSpot, setEliminationSpot] = useState(null)
    const setPendingSpots = useUserStore((data) => data.setPendingSpots)
    const pendingSpots = useUserStore((data) => data.pendingSpots)
    const refresh = useUserStore((data) => data.refresh)
    const setRefresh = useUserStore((data) => data.setRefresh)
    const smallContainerRef = useRef(null)
    const containerPermissionRef = useRef(null)
    const permissionRef = useRef(null)
    const containerPermissionPendingRef = useRef(null)
    const permissionPendingRef = useRef(null)
    const timelinePermissionRef = useRef(null)
    const timelinePermissionPendingRef = useRef(null)
    const shouldAnimateRef = useRef(false)
    const router = useRouter();
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);

    useEffect(() => {
        async function getSpots() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/all`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message)
                setAllSpots(data)
            } catch (err) {
                console.log(err.message)
            }
        }
        getSpots()
    }, [])
    useEffect(()=>{
    if(!allSpots) return
      const {risk,type,search,continent} = resolvedParams
      let result = allSpots
      if(continent) result = result.filter(s=>s.continent === continent)
      if(risk) result = result.filter(s=>s.risk === risk)
      if(type) result = result.filter(s=>s.spotTypes.includes(type))
      if(search) result = result.filter(s=>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.country.toLowerCase().includes(search.toLowerCase()) ||
          s.continent.toLowerCase().includes(search.toLowerCase()) ||
          s.city.toLowerCase().includes(search.toLowerCase())
      )
        setFilteredSpots(result)
    },[resolvedParams, allSpots])

    const totalPages = Math.ceil(filteredSpots.length / PAGE_SIZE)
    const paginatedSpots = filteredSpots.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    )

    function askConfirmation(spot) {
        shouldAnimateRef.current = true
        setAskPermission(true)
        setEliminationSpot(spot)
    }
    function askConfirmationPending(spot) {
        shouldAnimateRef.current = true
        setAskPermissionPending(true)
        setEliminationSpot(spot)
    }
    async function deleteSpotById(spotId) {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (!res.ok) throw new Error("Delete failed")
            shouldAnimateRef.current = true
            setAllSpots(prev => prev.filter(s => s.id !== spotId))
            setRefresh(!refresh)
            setPendingSpots(!pendingSpots)
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false)
            setAskPermission(false)
            shouldAnimateRef.current = false
        }
    }
    async function pendingSpot(spotId) {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId}?status=pending`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (!res.ok) throw new Error("Pending failed")
            shouldAnimateRef.current = true
            setAllSpots(prev => prev.map(s =>
                s.id === spotId ? { ...s, status: "PENDING" } : s
            ))
            setRefresh(!refresh)
            setPendingSpots(spotId)
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false)
            setAskPermissionPending(false)
            shouldAnimateRef.current = false
        }
    }

    const { contextSafe } = useGSAP(() => { }, { scope: smallContainerRef })

    useGSAP(() => {
        if (!smallContainerRef.current) return
        if (shouldAnimateRef.current) return
        if (pendingHref) return
        shouldAnimateRef.current = false
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        if (!els.length) return
        gsap.killTweensOf(els)
        gsap.set(els, { yPercent: 200, opacity: 0 })
        gsap.to(els, {
            yPercent: 0,
            opacity: 1,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "transform,opacity",
            onComplete: () => { setStatusHref(false) }
        })
    }, { scope: smallContainerRef, dependencies: [paginatedSpots] })

    const handleModify = contextSafe((s, e) => {
        if (!smallContainerRef.current) return
        gsap.killTweensOf(gsap.utils.toArray(smallContainerRef?.current?.children))
        const spot = e.getBoundingClientRect()
        gsap.timeline()
            .to(e, {
                scale: 2,
                x: window.innerWidth / 2 - spot.left - spot.width / 2,
                y: window.innerHeight / 2 - spot.top - spot.height / 2,
                zIndex: 99999,
                ease: "power2.out"
            })
            .to(e, {
                yPercent: 300,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    clearPendingHref()
                    router.push(`/spot/modify/${s}`)
                }
            })
    })

    useGSAP(() => {
        if (!containerPermissionRef.current) return
        timelinePermissionRef.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => gsap.set(containerPermissionRef.current, { visibility: "hidden" })
        })
        timelinePermissionRef.current
            .set(permissionRef.current, { yPercent: -500 })
            .to(permissionRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerPermissionRef })

    useGSAP(() => {
        if (!containerPermissionPendingRef.current) return
        timelinePermissionPendingRef.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => gsap.set(containerPermissionPendingRef.current, { visibility: "hidden" })
        })
        timelinePermissionPendingRef.current
            .set(permissionPendingRef.current, { yPercent: -500 })
            .to(permissionPendingRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerPermissionPendingRef })

    useEffect(() => {
        if (!timelinePermissionRef.current) return
        if (askPermission) {
            gsap.set(containerPermissionRef.current, { visibility: "visible" })
            timelinePermissionRef.current.play()
        } else {
            timelinePermissionRef.current.reverse()
        }
    }, [askPermission])

    useEffect(() => {
        if (!timelinePermissionPendingRef.current) return
        if (askPermissionPending) {
            gsap.set(containerPermissionPendingRef.current, { visibility: "visible" })
            timelinePermissionPendingRef.current.play()
        } else {
            timelinePermissionPendingRef.current.reverse()
        }
    }, [askPermissionPending])

    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        gsap.killTweensOf(smallContainerRef.current)
        gsap.to(smallContainerRef.current, {
            y: window.innerHeight,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])

    return (
        <div>
            <div ref={containerPermissionRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={permissionRef} className={`w-2/3 md:full bg-amber-50 border-primary-500 border-dotted border-3 ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-red-800 text-center text-xl md:text-4xl p-5">do you really want to delete {eliminationSpot?.name}?</h1>
                        <div className="flex justify-center gap-3 p-3">
                            <button onClick={() => deleteSpotById(eliminationSpot.id)} className="px-5 text-sm md:text-xl">Yes</button>
                            <button onClick={() => setAskPermission(false)} className="px-5 text-sm md:text-xl">No</button>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={containerPermissionPendingRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={permissionPendingRef} className={`w-2/3 md:full bg-amber-50 border-primary-500 border-dotted border-3 ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-orange-500 text-center text-xl md:text-4xl p-5">do you really want to set as pending {eliminationSpot?.name}?</h1>
                        <div className="flex justify-center gap-3 p-3">
                            <button onClick={() => pendingSpot(eliminationSpot.id)} className="px-5 text-sm md:text-xl">Yes</button>
                            <button onClick={() => setAskPermissionPending(false)} className="px-5 text-sm md:text-xl">No</button>
                        </div>
                    </div>
                </div>
            </div>

            {!allSpots ? (
                <h1 className="text-2xl animate-pulse text-primary-500">Loading spots...</h1>
            ) : (
                <div>
                  
                    <SearchFilters />
                    <SpotDetails />

                    <div ref={smallContainerRef} className="grid_custom gap-1 py-3">
                        {paginatedSpots.length === 0 && (
                            <h1 className="text-2xl mt-2 text-primary-500">No spots found</h1>
                        )}
                        {paginatedSpots.map((s) => (
                            <div key={s.id} className="relative">
                                <SpotCard spot={s} />
                                <div className="absolute top-1 right-1 text-sm md:text-base flex flex-col gap-1">
                                    <button onClick={() => askConfirmation(s)}>DELETE</button>
                                    {s.status !== "PENDING" && (
                                        <button onClick={() => askConfirmationPending(s)}>PENDING</button>
                                    )}
                                    <button
                                        onClick={(e) => handleModify(s.id, e.currentTarget.closest(".relative"))}
                                        className="nav-link text-sm md:text-base"
                                    >MODIFY</button>
                                </div>
                                <div className={`absolute top-1 left-1 text-sm md:text-base px-1
                                    ${s.status === "APPROVED" ? "bg-green-300" : ""}
                                    ${s.status === "PENDING" ? "bg-orange-300 animate-pulse" : ""}
                                    ${s.status === "UNAPPROVED" ? "bg-red-400" : ""}`}
                                >{s.status}</div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <ArrowPageSelector
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}
        </div>
    )
}