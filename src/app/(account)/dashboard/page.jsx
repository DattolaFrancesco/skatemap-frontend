'use client'
import { useEffect, useState, useRef } from "react";
import useUserStore from "./components/UserStore";
import useSpotStore from "@/app/(main)/store/SpotStore";
import { useRouter , usePathname} from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Globe from "@/app/(main)/components/Globe";
import NavBar from "@/app/(main)/components/NavBar";

export default function MySpots() {
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const setRefresh = useUserStore((data) => data.setRefresh)
    const refresh = useUserStore((data) => data.refresh)
    const [refreshLocal, setRefreshLocal] = useState(false)
    const permissionRef = useRef(null)
    const permissionPendingRef = useRef(null)
    const timelineRefDelete = useRef(null)
    const timelineRefPending = useRef(null)
    const containerPermissionRef = useRef(null)
    const containerPermissionPendingRef = useRef(null)
    const router = useRouter()
    const setStatusHref = useNavigationStore((state) => state.setStatusHref)
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref)
    const pendingHref = useNavigationStore((state) => state.pendingHref)
    const setFilteredSpotStore = useSpotStore((data) => data.setFilteredSpot)
    const eliminationSpot = useSpotStore((s) => s.eliminationSpot)
    const pendingSpotStore = useSpotStore((s) => s.pendingSpot)
    const askPermission = useSpotStore((s) => s.askPermission)
    const setAskPermission = useSpotStore((s) => s.setAskPermission)
    const setAskPermissionPending = useSpotStore((s) => s.setAskPermissionPending)
    const askPermissionPending = useSpotStore((s) => s.askPermissionPending)
    const setEliminationSpot = useSpotStore((s) => s.setEliminationSpot)
    const setAllSpots = useSpotStore((data) => data.setAllSpots)
    const setPendingSpots = useUserStore((data) => data.setPendingSpots)

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
            setAllSpots(data)
        } catch (error) {
            console.log(error.message)
        }
    }
    async function getAllSpots() {
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
                console.log(data)
            setAllSpots(data)
        } catch (err) {
            console.log(err.message)
        }
    }
    async function getFav() {
            const token = localStorage.getItem('token')
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/all`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                })
                const data = await res.json()
                if (!res.ok) throw new Error("Can't connect to the server")
                setAllSpots(data)
            } catch (err) {
                console.log(err.message)
            }
    }
    useEffect(() => {
        if (!pathname) return
        if(pathname == "/dashboard")  getSpots()
        if(pathname == "/dashboard/allSpot") getAllSpots()
        if(pathname == "/dashboard/favourites") getFav()
    }, [refreshLocal, refresh])

    async function deleteSpotById(spotId) {
        console.log("delete")
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
            })
            if (!res.ok) throw new Error("Errore eliminazione")
            setRefresh(!refresh)
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoading(false)
            setAskPermission(false)
            setEliminationSpot(null)
            setRefreshLocal(!refreshLocal)
        }
    }
    async function pendingSpot(spotId) {
        console.log("pending")
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
               setRefresh(!refresh)
               setPendingSpots(spotId)
           } catch (err) {
               console.log(err.message)
           } finally {
               setLoading(false)
               setAskPermissionPending(false)
               setRefreshLocal(!refreshLocal)
           }
    }

    useGSAP(() => {
        if (!containerPermissionRef.current) return
        timelineRefDelete.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
                gsap.set(containerPermissionRef.current, { visibility: "hidden" })
            }
        })
        timelineRefDelete.current
            .set(permissionRef.current, { yPercent: -500 })
            .to(permissionRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerPermissionRef })
    useGSAP(() => {
        if (!containerPermissionPendingRef.current) return
        timelineRefPending.current = gsap.timeline({
            paused: true,
            onReverseComplete: () => {
                gsap.set(containerPermissionPendingRef.current, { visibility: "hidden" })
            }
        })
        timelineRefPending.current
            .set(permissionPendingRef.current, { yPercent: -500 })
            .to(permissionPendingRef.current, { yPercent: 0, ease: "power2.out" })
    }, { scope: containerPermissionPendingRef })

    useEffect(() => {
        if (!timelineRefDelete.current) return
        if (askPermission) {
            gsap.set(containerPermissionRef.current, { visibility: "visible" })
            timelineRefDelete.current.play()
        } else {
            timelineRefDelete.current.reverse()
        }
    }, [askPermission])
    useEffect(() => {
        if (!timelineRefPending.current) return
        if (askPermissionPending) {
            gsap.set(containerPermissionPendingRef.current, { visibility: "visible" })
            timelineRefPending.current.play()
        } else {
            timelineRefPending.current.reverse()
        }
    }, [askPermissionPending])

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
            <div ref={containerPermissionRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden z-99999">
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
            <div ref={containerPermissionPendingRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden z-99999">
                <div className="w-full h-full flex justify-center items-center  ">
                    <div ref={permissionPendingRef} className={`w-2/3 md:w-1/2 p-2 button--glass button rounded-[5px] ${loading ? "animate-pulse" : ""}`}>
                       <div  className={`w-full bg_login  rounded-[5px]`}>
                            <h1 className="text-orange-500 text-center text-xl md:text-2xl p-5">
                                set {pendingSpotStore?.name.slice(0,1).toUpperCase()+ pendingSpotStore?.name.slice(1)} as Pending?
                            </h1>
                            <div className="flex justify-center gap-3 p-3">
                                <button onClick={() => pendingSpot(pendingSpotStore.id)} className="px-5  button--glass button">Yes</button>
                                <button onClick={() => setAskPermissionPending(false)} className="px-5  button--glass button">No</button>
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