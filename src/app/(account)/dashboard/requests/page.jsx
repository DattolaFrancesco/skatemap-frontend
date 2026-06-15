'use client'

import SpotCard from "@/app/(main)/components/SpotCard";
import SpotDetails from "@/app/(main)/components/SpotDetails";
import { useState, useEffect, useRef } from "react";
import useUserStore from "../components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PAGE_SIZE = 20;

export default function Request() {
    const [allSpots, setAllSpots] = useState(null)
    const [filteredSpots, setFilteredSpots] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const refresh = useUserStore((data) => data.refresh)
    const setRefresh = useUserStore((data) => data.setRefresh)
    const [askPermissionToUnApprove, setAskPermissionToUnApprove] = useState(false)
    const [askPermissionToApprove, setAskPermissionToApprove] = useState(false)
    const [unApprovedSpot, setUnApprovedSpot] = useState(null)
    const [approvedSpot, setApprovedSpot] = useState(null)
    const [loading, setLoading] = useState(false)
    const setPendingSpots = useUserStore((data) => data.setPendingSpots)
    const pendingSpots = useUserStore((data) => data.pendingSpots)
    const smallContainerRef = useRef(null)
    const containerUnApproveRef = useRef(null)
    const ytLink = useRef(null)
    const unApproveRef = useRef(null)
    const containerApproveRef = useRef(null)
    const approveRef = useRef(null)
    const timelineUnApproveRef = useRef(null)
    const timelineApproveRef = useRef(null)
    const shouldBlockAnimateRef = useRef(false)
    const router = useRouter();
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);

    useEffect(() => {
        async function getSpots() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/all/pending`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setAllSpots(data)
                setFilteredSpots(data)
            } catch (error) {
                console.log(error.message)
            }
        }
        getSpots()
    }, [])
    const totalPages = Math.ceil(filteredSpots.length / PAGE_SIZE)
    const paginatedSpots = filteredSpots.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    )
    async function getSpot(id){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/single/${id}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
             return data.video[0].id
        }catch(err){
            console.log(err.message)
        }
    }
    async function approveSpot(spotId) {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId.id}?status=approved`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (!res.ok) throw new Error("Approve failed")
            setAllSpots(prev => prev.filter(s => s.id !== spotId.id))
            setFilteredSpots(prev => prev.filter(s => s.id !== spotId.id))
            setRefresh(!refresh)
            setPendingSpots(!pendingSpots)
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
            setAskPermissionToApprove(false)
        }
    }
    async function uploadYt(id) {
        const realId = await getSpot(id)
        console.log(realId)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/media/addYt/${realId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({link : ytLink.current})
                }
            )
            const data =  await res.text()
            if (!res.ok) throw new Error("yt change link failed")
            console.log(data)
            approveSpot(approvedSpot)
           
        } catch (error) {
            console.log(error.message)
        }
    }
    async function unApproveSpot(spotId) {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId.id}?status=unapproved`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (!res.ok) throw new Error("Unapprove failed")
            setAllSpots(prev => prev.filter(s => s.id !== spotId.id))
            setFilteredSpots(prev => prev.filter(s => s.id !== spotId.id))
            setRefresh(!refresh)
            setPendingSpots(!pendingSpots)
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
            setAskPermissionToUnApprove(false)
        }
    }
    function askConfermationUnApproved(spot) {
        shouldBlockAnimateRef.current = true
        setAskPermissionToUnApprove(true)
        setUnApprovedSpot(spot)
    }
    function askConfermationApproved(spot) {
        shouldBlockAnimateRef.current = true
        setAskPermissionToApprove(true)
        setApprovedSpot(spot)
    }
    const { contextSafe } = useGSAP(() => {}, { scope: smallContainerRef })
    useGSAP(() => {
        if (!smallContainerRef.current) return
        if (shouldBlockAnimateRef.current) {
            shouldBlockAnimateRef.current = false
            return
        }
        if (pendingHref) return
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
                scale: 1.2,
                x: window.innerWidth / 2 - spot.left - spot.width / 2,
                y: window.innerHeight / 1.5 - spot.top - spot.height / 2,
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
        if (!containerUnApproveRef.current) return
        timelineUnApproveRef.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => gsap.set(containerUnApproveRef.current, { visibility: "hidden" })
        })
        timelineUnApproveRef.current
            .set(unApproveRef.current, { yPercent: -500 })
            .to(unApproveRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerUnApproveRef })

    useGSAP(() => {
        if (!containerApproveRef.current) return
        timelineApproveRef.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => gsap.set(containerApproveRef.current, { visibility: "hidden" })
        })
        timelineApproveRef.current
            .set(approveRef.current, { yPercent: -500 })
            .to(approveRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerApproveRef })

    useEffect(() => {
        if (!timelineUnApproveRef.current) return
        if (askPermissionToUnApprove) {
            gsap.set(containerUnApproveRef.current, { visibility: "visible" })
            timelineUnApproveRef.current.play()
        } else {
            timelineUnApproveRef.current.reverse()
        }
    }, [askPermissionToUnApprove])

    useEffect(() => {
        if (!timelineApproveRef.current) return
        if (askPermissionToApprove) {
            gsap.set(containerApproveRef.current, { visibility: "visible" })
            timelineApproveRef.current.play()
        } else {
            timelineApproveRef.current.reverse()
        }
    }, [askPermissionToApprove])

    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        gsap.killTweensOf(smallContainerRef.current)
        gsap.to(smallContainerRef.current, {
            y: window.innerHeight,
            opacity: 0,
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
            {/* modal unapprove */}
            <div ref={containerUnApproveRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={unApproveRef} className={`w-2/3 md:full bg-amber-50  ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-red-800 text-center text-xl md:text-4xl p-5">DO YOU REALLY WANT TO NO APPROVE  {unApprovedSpot?.name}?</h1>
                        <div className="flex justify-center gap-3 p-3">
                            <button onClick={() => unApproveSpot(unApprovedSpot)} className="px-5 text-sm md:text-xl">YES</button>
                            <button onClick={() => setAskPermissionToUnApprove(false)} className="px-5 text-sm md:text-xl">NO</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal approve */}
            <div ref={containerApproveRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={approveRef} className={`w-2/3 md:full bg_login  ${loading ? "animate-pulse" : ""}`}>
                        <h1 className="text-green-500 text-center text-xl md:text-4xl p-5">DO YOU REALLY WANT TO APPROVE  {approvedSpot?.id}?</h1>
                        <p>you need to download the video, check it and post it on yt</p>
                        <p>make sure that the video exist and it's online</p>
                        <input type="text" placeholder="add yt link" className="bg-white" onChange={(e)=>ytLink.current = e.currentTarget.value} value={ytLink.current}/>
                        <div className="flex justify-center gap-3 p-3">
                            <button onClick={() => {
                                uploadYt(approvedSpot?.id)
                                }} className="px-5 text-sm md:text-xl">YES</button>
                            <button onClick={() => setAskPermissionToApprove(false)} className="px-5 text-sm md:text-xl">NO</button>
                        </div>
                    </div>
                </div>
            </div>

            {!allSpots || filteredSpots.length === 0 ? (
                <h1 className="text-2xl text-primary-500">You don't have any spot request to review</h1>
            ) : (
                <div className="gap-1 py-3">
                    <SpotDetails />
                    <div ref={smallContainerRef} className="grid_custom gap-1 py-3">
                        {paginatedSpots.map((s) => (
                            <div key={s.id} className="relative">
                                <SpotCard spot={s} />
                                <div className="absolute top-1 right-1 text-sm md:text-base flex flex-col gap-1">
                                    <button onClick={() => askConfermationApproved(s)} className="text-sm md:text-base">APPROVE</button>
                                    <button onClick={() => askConfermationUnApproved(s)} className="text-sm md:text-base">UNAPPROVE</button>
                                    <button onClick={(e) => handleModify(s.id, e.currentTarget.closest(".relative"))} className="nav-link text-sm md:text-base">MODIFY</button>
                                </div>
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