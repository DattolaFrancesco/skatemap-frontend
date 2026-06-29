'use client'
import { useEffect, useState, useRef } from "react";
import useUserStore from "./components/UserStore";
import useSpotStore from "@/app/(main)/store/SpotStore";
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Globe from "@/app/(main)/components/Globe";
import NavBar from "@/app/(main)/components/NavBar";

export default function MySpots() {
    const [allMySpots, setAllMySpots] = useState(null)
    const [loading, setLoading] = useState(false)
    const setRefresh = useUserStore((data) => data.setRefresh)
    const refresh = useUserStore((data) => data.refresh)
    const permissionRef = useRef(null)
    const timelineRef = useRef(null)
    const containerPermissionRef = useRef(null)
    const router = useRouter()
    const setStatusHref = useNavigationStore((state) => state.setStatusHref)
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref)
    const pendingHref = useNavigationStore((state) => state.pendingHref)
    const setFilteredSpotStore = useSpotStore((data) => data.setFilteredSpot)
    const eliminationSpot = useSpotStore((s) => s.eliminationSpot)
    const askPermission = useSpotStore((s) => s.askPermission)
    const setAskPermission = useSpotStore((s) => s.setAskPermission)
    const setEliminationSpot = useSpotStore((s) => s.setEliminationSpot)

    useEffect(() => {
        setStatusHref(false)
        setFilteredSpotStore(null)
        setAskPermission(false)
        setEliminationSpot(null)
        return () => {
            setAskPermission(false)
            setEliminationSpot(null)
        }
    }, [])

    useEffect(() => {
        async function getSpots() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/my`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message)
                setAllMySpots(data)
                setFilteredSpotStore(data)
            } catch (error) {
                console.log(error.message)
            }
        }
        getSpots()
    }, [])

    async function deleteSpotById(spotId) {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (!res.ok) throw new Error("Errore eliminazione")
            setAllMySpots(prev => prev.filter(s => s.id !== spotId))
            setFilteredSpotStore(prev => prev?.filter(s => s.id !== spotId))
            setRefresh(!refresh)
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false)
            setAskPermission(false)
            setEliminationSpot(null)
        }
    }

    useGSAP(() => {
        if (!containerPermissionRef.current) return
        timelineRef.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
                gsap.set(containerPermissionRef.current, { visibility: "hidden" })
            }
        })
        timelineRef.current
            .set(permissionRef.current, { yPercent: -500 })
            .to(permissionRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerPermissionRef })

    useEffect(() => {
        if (!timelineRef.current) return
        if (askPermission) {
            gsap.set(containerPermissionRef.current, { visibility: "visible" })
            timelineRef.current.play()
        } else {
            timelineRef.current.reverse()
        }
    }, [askPermission])

useEffect(() => {
    if (!pendingHref) return
    setStatusHref(true)
    setAskPermission(false)
    setEliminationSpot(null)
    gsap.killTweensOf(containerPermissionRef.current)
    gsap.set(containerPermissionRef.current, { visibility: "hidden", autoAlpha: 0 })
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
            <div ref={containerPermissionRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
                <div className="w-full h-full flex justify-center items-center  ">
                    <div ref={permissionRef} className={`w-2/3 md:w-1/2 p-2 button--glass button rounded-[5px] ${loading ? "animate-pulse" : ""}`}>
                       <div  className={`w-full bg_login  rounded-[5px]`}>
                            <h1 className="text-red-800 text-center text-xl md:text-2xl p-5">
                                Delete {eliminationSpot?.name.slice(0,1).toUpperCase()+ eliminationSpot?.name.slice(1)}?
                            </h1>
                            <div className="flex justify-center gap-3 p-3">
                                <button onClick={() => deleteSpotById(eliminationSpot.id)} className="px-5  button--glass button">Yes</button>
                                <button onClick={() => setAskPermission(false)} className="px-5  button--glass button">No</button>
                            </div>
                       </div>
                    </div>
                </div>
            </div>
            <NavBar />
            <div className="flex-1 overflow-y-auto overscroll-none landscape:overflow-visible flex flex-col">
                <Globe />
            </div>
        </>
    )
}