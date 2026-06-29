'use client'
import { useEffect, useRef, useState } from "react";
import useUserStore from "../components/UserStore";
import useSpotStore from "@/app/(main)/store/SpotStore";
import useInsetStore from "@/app/(main)/store/InsetStore";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MySpots from "../page";

export default function Requests() {
    const [loading, setLoading] = useState(false)
    const [videos, setVideos] = useState(null)
    const inputsRef = useRef([])
    const refresh = useUserStore((data) => data.refresh)
    const setRefresh = useUserStore((data) => data.setRefresh)
    const setPendingSpots = useUserStore((data) => data.setPendingSpots)
    const pendingSpots = useUserStore((data) => data.pendingSpots)
    const setAllSpots = useSpotStore((data) => data.setAllSpots)
    const setFilteredSpotStore = useSpotStore((data) => data.setFilteredSpot)
    const approveSpotData = useSpotStore((s) => s.approveSpotData)
    const unApproveSpotData = useSpotStore((s) => s.unApproveSpotData)
    const askPermissionToApprove = useSpotStore((s) => s.askPermissionToApprove)
    const askPermissionToUnApprove = useSpotStore((s) => s.askPermissionToUnApprove)
    const setAskPermissionToApprove = useSpotStore((s) => s.setAskPermissionToApprove)
    const setAskPermissionToUnApprove = useSpotStore((s) => s.setAskPermissionToUnApprove)
    const setApproveSpotData = useSpotStore((s) => s.setApproveSpotData)
    const setUnApproveSpotData = useSpotStore((s) => s.setUnApproveSpotData)
    const setMediaOpen = useInsetStore((state) => state.setMediaOpen)
    const containerApproveRef = useRef(null)
    const approveRef = useRef(null)
    const containerUnApproveRef = useRef(null)
    const unApproveRef = useRef(null)
    const timelineApproveRef = useRef(null)
    const timelineUnApproveRef = useRef(null)
    const router = useRouter()
    const [localApproveSpot, setLocalApproveSpot] = useState(null)
    const [localUnApproveSpot, setLocalUnApproveSpot] = useState(null)
    const setStatusHref = useNavigationStore((state) => state.setStatusHref)
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref)
    const pendingHref = useNavigationStore((state) => state.pendingHref)

    useEffect(() => {
        if (approveSpotData) setLocalApproveSpot(approveSpotData)
    }, [approveSpotData])

    useEffect(() => {
        if (unApproveSpotData) setLocalUnApproveSpot(unApproveSpotData)
    }, [unApproveSpotData])

    async function getSpotVideos(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/single/${id}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            const data = await res.json()
            if (!res.ok) throw new Error("Can't connect to the server")
            setVideos(data.video)
            inputsRef.current = data.video.map((v) => ({ id: v.id, link: "" }))
        } catch (err) { console.log(err.message) }
    }

    async function uploadYt() {
        const spotToApprove = approveSpotData
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/addYt`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(inputsRef.current)
            })
            if (!res.ok) throw new Error("yt change link failed")
            await approveSpot(spotToApprove)
        } catch (error) { console.log(error.message) }
    }

    async function approveSpot(spot) {
        if (!spot) return
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spot.id}?status=approved`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (!res.ok) throw new Error("Approve failed")
            setRefresh(!refresh)
            setPendingSpots(!pendingSpots)
        } catch (error) { console.log(error.message) }
        finally {
            setLoading(false)
            setAskPermissionToApprove(false)
            setApproveSpotData(null)
            setVideos(null)
        }
    }

    async function unApproveSpot(spot) {
        if (!spot) return
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spot.id}?status=unapproved`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (!res.ok) throw new Error("Unapprove failed")
            setRefresh(!refresh)
            setPendingSpots(!pendingSpots)
        } catch (error) { console.log(error.message) }
        finally {
            setLoading(false)
            setAskPermissionToUnApprove(false)
            setUnApproveSpotData(null)
        }
    }

    useEffect(() => {
        setAskPermissionToApprove(false)
        setAskPermissionToUnApprove(false)
        setApproveSpotData(null)
        setUnApproveSpotData(null)
        return () => {
            setAskPermissionToApprove(false)
            setAskPermissionToUnApprove(false)
            setApproveSpotData(null)
            setUnApproveSpotData(null)
        }
    }, [])

    useEffect(() => {
        if (!approveSpotData) return
        getSpotVideos(approveSpotData.id)
    }, [approveSpotData])

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
        if (!timelineUnApproveRef.current) return
        if (askPermissionToUnApprove) {
            gsap.set(containerUnApproveRef.current, { visibility: "visible" })
            timelineUnApproveRef.current.play()
        } else {
            timelineUnApproveRef.current.reverse()
        }
    }, [askPermissionToUnApprove])

    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        setAskPermissionToApprove(false)
        setAskPermissionToUnApprove(false)
        gsap.killTweensOf(containerApproveRef.current)
        gsap.killTweensOf(containerUnApproveRef.current)
        gsap.set(containerApproveRef.current, { visibility: "hidden", autoAlpha: 0 })
        gsap.set(containerUnApproveRef.current, { visibility: "hidden", autoAlpha: 0 })
        gsap.to({}, {
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])

    return (
        <>
            <div ref={containerApproveRef} className="invisible fixed inset-0 z-[99999] bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={approveRef} className={`w-2/3 md:w-1/2 p-2 button--glass button rounded-[5px] ${loading ? "animate-pulse" : ""}`}>
                        <div className="w-full bg_login rounded-[5px] p-4 flex flex-col gap-3">
                            <h1 className="text-green-700 text-center text-xl md:text-2xl font-bold">
                                Approve {localApproveSpot?.name?.slice(0,1).toUpperCase()}{localApproveSpot?.name?.slice(1)}?
                            </h1>
                            {videos && videos.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-black/50 tracking-widest">
                                        Upload {videos.length} video{videos.length > 1 ? "s" : ""} to YouTube first
                                    </p>
                                    {videos.map((v, i) => (
                                        <div key={v.id} className="flex flex-col gap-1">
                                            <label className="text-[10px] tracking-widest text-black/50">
                                                {typeof v.link === 'string' ? v.link.split("/").pop() : `Video ${i + 1}`}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="YouTube link"
                                                className="button--glass button w-full px-2 py-1.5 text-xs rounded-[5px] focus:outline-none"
                                                defaultValue={inputsRef.current[i]?.link ?? ""}
                                                onChange={(e) => {
                                                    inputsRef.current[i] = { ...inputsRef.current[i], link: e.currentTarget.value }
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {localApproveSpot?.image?.length > 0 && (
                                        <button
                                            onClick={() => setMediaOpen({ media: localApproveSpot.image, format: "image" })}
                                            className="text-xs button--glass button px-2 py-1 rounded-[5px] w-fit"
                                        >
                                            View images
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="flex justify-center gap-3">
                                <button onClick={uploadYt} className="px-5 button--glass button">Yes</button>
                                <button onClick={() => setAskPermissionToApprove(false)} className="px-5 button--glass button">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={containerUnApproveRef} className="invisible fixed inset-0 z-[99999] bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center">
                    <div ref={unApproveRef} className={`w-2/3 md:w-1/2 p-2 button--glass button rounded-[5px] ${loading ? "animate-pulse" : ""}`}>
                        <div className="w-full bg_login rounded-[5px] p-4">
                            <h1 className="text-red-800 text-center text-xl md:text-2xl font-bold p-5">
                                Unapprove {localUnApproveSpot?.name?.slice(0,1).toUpperCase()}{localUnApproveSpot?.name?.slice(1)}?
                            </h1>
                            <div className="flex justify-center gap-3 p-3">
                                <button onClick={() => unApproveSpot(localUnApproveSpot)} className="px-5 button--glass button">Yes</button>
                                <button onClick={() => setAskPermissionToUnApprove(false)} className="px-5 button--glass button">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MySpots />
        </>
    )
}