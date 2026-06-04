'use client'
import { useEffect, useState, useRef } from "react"
import SpotCard from "@/app/(main)/components/SpotCard"
import SpotDetails from "@/app/(main)/components/SpotDetails"
import { useSearchParams } from "next/navigation"
import SearchFilters from "../components/SearchFilters";
import useUserStore from "../components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector"
import { useRouter } from "next/navigation";
import useNavigationStore from "@/app/(main)/store/NavigationStore"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AllSpotGrid() {
  const [data, setData] = useState(null)
  const [askPermission, setAskPermission] = useState(false)
  const [askPermissionPending, setAskPermissionPending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eliminationSpot, setEliminationSpot] = useState(null)
  const searchParams = useSearchParams()
  const setPendingSpots = useUserStore((data) => data.setPendingSpots)
  const pendingSpots = useUserStore((data) => data.pendingSpots)
  const refresh = useUserStore((data) => data.refresh)
  const setRefresh = useUserStore((data) => data.setRefresh)
  const firstDataRef = useRef(null)
  const firstRenderRef = useRef(false)
  const forcedRefreshRef = useRef(false)
  const smallContainerRef = useRef(null)
  const containerPermissionRef = useRef(null)
  const permissionRef = useRef(null)
  const containerPermissionPendingRef = useRef(null)
  const permissionPendingRef = useRef(null)
  const timelinePermissionRef = useRef(null)
  const timelinePermissionPendingRef = useRef(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const router = useRouter();
  const setStatusHref = useNavigationStore((state) => state.setStatusHref);
  const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
  const pendingHref = useNavigationStore((state) => state.pendingHref);

  async function getSpots(forced = false) {
    const query = new URLSearchParams(searchParams)
    query.delete('_t')
    if (query.toString() === "" && firstRenderRef.current && !forced) {
      setData(firstDataRef.current)
      return
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/all?${searchParams.toString()}`
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      if (!firstRenderRef.current && query.toString() === "") {
        firstDataRef.current = data
        firstRenderRef.current = true
      }
      setData(data)
    } catch (err) {
      console.log(err.message)
    } finally {
      forcedRefreshRef.current = false
    }
  }

  function askConfirmation(spot) {
    setAskPermission(true)
    setEliminationSpot(spot)
  }

  function askConfirmationPending(spot) {
    setAskPermissionPending(true)
    setEliminationSpot(spot)
  }

  async function deleteSpotById(spotId) {
    setLoading(true)
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Delete failed")
        setAskPermission(false)
        forcedRefreshRef.current = true        
        setRefreshTrigger(prev => prev + 1)    
    } catch (err) {
        setAskPermission(false)
    } finally {
        setLoading(false)
        setPendingSpots(!pendingSpots)
        setRefresh(!refresh)
    }
  }

  async function pendingSpot(spotId) {
    setLoading(true)
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId}?status=pending`;
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await getSpots()
      setAskPermissionPending(false)
      forcedRefreshRef.current = true
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      setAskPermissionPending(false)
    } finally {
      setLoading(false)
      setPendingSpots(spotId)
      setRefresh(!refresh)
    }
  }

  useEffect(() => { getSpots(forcedRefreshRef.current) }, [searchParams, refreshTrigger])

  const { contextSafe } = useGSAP(() => {}, { scope: smallContainerRef })

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
  }, { scope: smallContainerRef, dependencies: [data] })

  const handleModify = contextSafe((s, e) => {
    if (!smallContainerRef.current) return
    const els = gsap.utils.toArray(smallContainerRef?.current?.children)
    gsap.killTweensOf(els)
    const spot = e.getBoundingClientRect()
    const tl = gsap.timeline()
    tl.to(e, {
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
      onReverseComplete: () => {
        gsap.set(containerPermissionRef.current, { visibility: "hidden" })
      }
    })
    timelinePermissionRef.current
      .set(permissionRef.current, { yPercent: -500 })
      .to(permissionRef.current, { yPercent: 0, ease: "power2.out" })
  }, { scope: containerPermissionRef })

  useGSAP(() => {
    if (!containerPermissionPendingRef.current) return
    timelinePermissionPendingRef.current = gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        gsap.set(containerPermissionPendingRef.current, { visibility: "hidden" })
      }
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
        const els = gsap.utils.toArray(smallContainerRef?.current?.children)
        gsap.killTweensOf(els)
        gsap.killTweensOf(smallContainerRef.current)
        gsap.to(smallContainerRef.current, {
            yPercent: 200,
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
      {/* modal delete */}
      <div ref={containerPermissionRef} className="invisible fixed h-full inset-0 z-50 bg-black/40 overflow-hidden">
        <div className="w-full h-full flex justify-center items-center">
          <div ref={permissionRef} className={`w-2/3 md:full bg-amber-50 border-primary-500 border-dotted border-3 ${loading ? "animate-pulse" : ""}`}>
              <h1 className="text-red-800 text-center text-xl md:text-4xl p-5">do you realy want to delete {eliminationSpot?.name}?</h1>
              <div className="flex justify-center gap-3 p-3">
                  <button onClick={() => deleteSpotById(eliminationSpot.id)} className="px-5 text-sm md:text-xl">Yes</button>
                  <button onClick={() => setAskPermission(false)} className="px-5 text-sm md:text-xl">No</button>
              </div>
          </div>
        </div>
      </div>

      {/* modal pending */}
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

      {!data ? (
        <h1 className="text-2xl animate-pulse text-primary-500">Loading spots...</h1>
      ) : (
        <div>
          <SearchFilters />
          <SpotDetails />
          <div ref={smallContainerRef} className="grid_custom gap-1 py-3">
            {data.content.map((s) => (
              <div key={s.id} className="relative">
                <SpotCard spot={s} />
                <div className="absolute top-1 right-1 text-sm md:text-base flex flex-col gap-1">
                  <button onClick={() => askConfirmation(s)}>DELETE</button>
                  {s.status === "PENDING" ? null : <button onClick={() => askConfirmationPending(s)}>PENDING</button>}
                  <button onClick={(e) => handleModify(s.id, e.currentTarget.closest(".relative"))} className="nav-link text-sm md:text-base">MODIFY</button>
                </div>
                <div className={`absolute top-1 left-1 text-sm md:text-base px-1
                  ${s.status === "APPROVED" ? "bg-green-300" : ""}
                  ${s.status === "PENDING" ? "bg-orange-300 animate-pulse" : ""}
                  ${s.status === "UNAPPROVED" ? "bg-red-400" : ""}`}>{s.status}</div>
              </div>
            ))}
          </div>
          {data?.totalPages > 1 && <ArrowPageSelector totalPages={data?.totalPages} />}
        </div>
      )}
    </div>
  )
}