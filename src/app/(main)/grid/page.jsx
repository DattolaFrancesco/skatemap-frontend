'use client'
import ArrowPageSelector from "../components/ArrowPageSelector";
import SpotCard from "../components/SpotCard";
import SpotDetails from "../components/SpotDetails";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useNavigationStore from "../store/NavigationStore";
import useSpotStore from "../store/SpotStore";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

export default function Grid({ searchParams }) {
    const router = useRouter();
    const resolvedParams = use(searchParams)
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const containerRef = useRef(null)
    const smallContainerRef = useRef(null)
    const errorRef = useRef(false)
    const reset = useSpotStore((data) => data.reset)
    const setAllSpots = useSpotStore((data) => data.setAllSpots)
    const allSpots = useSpotStore((data) => data.allSpots)
    const [filteredSpots, setFilteredSpots] = useState([]);
    const PAGE_SIZE = 50;
    const [currentPage, setCurrentPage] = useState(0);
    useEffect(() => {
    async function getAllSpot() {
        if(allSpots) return
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/all/approved`
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setAllSpots(data)
            clearPendingHref()
            setStatusHref(false)
        } catch (error) {
            console.log(error.message)
            errorRef.current = true
            clearPendingHref()
            setStatusHref(false)
        }
    }
    getAllSpot()
    clearPendingHref()
    setStatusHref(false)
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
        setCurrentPage(0)
    },[resolvedParams, allSpots])
    const totalPages = Math.ceil(filteredSpots.length / PAGE_SIZE);
    const paginatedSpots = filteredSpots.slice(currentPage * PAGE_SIZE,(currentPage + 1) * PAGE_SIZE)
    useGSAP(() => {
        if (!smallContainerRef.current) return
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
    }, { scope: containerRef, dependencies: [filteredSpots, reset, currentPage] })

    useEffect(() => {
        if (!pendingHref) return
        if (errorRef.current) { clearPendingHref(); router.push(pendingHref); return }
        if (!allSpots || !smallContainerRef.current) { clearPendingHref(); router.push(pendingHref); return }
        setStatusHref(true)
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        gsap.killTweensOf(els)
        gsap.to(els, {
            yPercent: 200,
            opacity: 0,
            duration: 0.2,
            stagger: 0.1,
            ease: "power2.in",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])

    if (!allSpots) return <h1 className="text-2xl px-2 text-primary-500">There aren't spots</h1>
    if (filteredSpots?.length === 0 && !reset) return <h1 className="text-2xl px-2 text-primary-500">No available spot for this filters</h1>

    return (
        <div ref={containerRef}>
            <SpotDetails />
            <div ref={smallContainerRef} className="grid_custom gap-1 px-2 py-0.5">
                {paginatedSpots.map((s) => (
                    <SpotCard key={s.id} spot={s} />
                ))}
            </div>
            {totalPages > 1 && (
                <ArrowPageSelector totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
            )}
        </div>
    )
}