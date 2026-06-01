'use client'
import { useEffect, useState, useRef } from "react"
import SpotCard from "@/app/(main)/components/SpotCard"
import SpotDetails from "@/app/(main)/components/SpotDetails"
import { RxCross2 } from "react-icons/rx"
import { FaPencilAlt } from "react-icons/fa"
import { ClipboardClock } from 'lucide-react';
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import SearchFilters from "../components/SearchFilters";
import useUserStore from "../components/UserStore";
import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector"

export default function AllSpotGrid() {
  const [data, setData] = useState(null)
  const [askPermission, setAskPermission] = useState(false)
  const [askPermissionPending, setAskPermissionPending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ message: "", type: "" })
  const [eliminationSpot, setEliminationSpot] = useState(null)
  const searchParams = useSearchParams()
  const setPendingSpots = useUserStore((data)=> data.setPendingSpots)
  const pendingSpots = useUserStore((data)=> data.pendingSpots)
  const refresh = useUserStore((data)=> data.refresh)
  const setRefresh = useUserStore((data)=> data.setRefresh)
  const firstDataRef = useRef(null)
  const firstRenderRef = useRef(false)

async function getSpots() {
    const query = new URLSearchParams(searchParams)
    query.delete('_t')
    if (query.toString() === "" && firstRenderRef.current) {
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
        if (!res.ok) throw new Error(json.message)
        if (!firstRenderRef.current && query.toString() === "") {
            firstDataRef.current = data   
            firstRenderRef.current = true
        }
        console.log(data)
        setData(data)
    } catch(err) {
        console.log(err.message)
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
      await getSpots()
      setAskPermission(false)
      setMessage({ message: `${eliminationSpot?.name} deleted successfully`, type: "good" })
      setTimeout(() => setMessage({ message: "", type: "" }), 3000)
    } catch(err) {
      setMessage({ message: `${eliminationSpot?.name} deleting went wrong, try again`, type: "bad" })
      setAskPermission(false)
      setTimeout(() => setMessage({ message: "", type: "" }), 3000)
    } finally {
      setLoading(false)
      setPendingSpots(!pendingSpots)
      setRefresh(!refresh)
    }
  }
  async function pendingSpot(spotId){
        setLoading(true)
        const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/status/${spotId}?status=pending`;
        try
        { const res = await fetch(url,{
        method:"PATCH",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
        })
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        await getSpots()
        setAskPermissionPending(false)
        setMessage({ message: `${eliminationSpot?.name} returned pending successfully`, type: "pending" })
        setTimeout(() => setMessage({ message: "", type: "" }), 3000)
      } catch(err) {
        setMessage({ message: `${eliminationSpot?.name} pending went wrong, try again`, type: "bad" })
        setAskPermissionPending(false)
        setTimeout(() => setMessage({ message: "", type: "" }), 3000)
      } finally {
        setLoading(false)
        setPendingSpots(spotId)
        setRefresh(!refresh)
      }

  }

  useEffect(() => { getSpots() }, [searchParams])

  if (!data) return <h1 className="text-2xl animate-pulse">Loading spots...</h1>
  return (
    <div>
      {message.type === "bad" || message.type === "good" && (
        <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce">
          <h1 className="text-red-500 text-2xl px-3 py-1">{message.message}</h1>
        </div>
      )}
      {message.type === "pending" && (
        <div className="absolute bottom-10 right-10 bg-black/20 animate-bounce">
          <h1 className="bg-orange-500 text-2xl px-3 py-1 text-white">{message.message}</h1>
        </div>
      )}

      {/* modal conferma delete */}
      <div className={`${askPermission ? "block" : "hidden"} fixed h-full inset-0 z-50 bg-black/40 overflow-hidden`}>
        <div className="w-full h-full flex justify-center items-center">
          <div className={`bg-white ${loading ? "animate-pulse" : ""}`}>
            <h1 className="text-red-800 text-4xl p-5">do you really want to delete {eliminationSpot?.name}?</h1>
            <div className="flex justify-center gap-3 p-3">
              <button onClick={() => deleteSpotById(eliminationSpot.id)} className="px-5">Yes</button>
              <button onClick={() => setAskPermission(false)} className="px-5">No</button>
            </div>
          </div>
        </div>
      </div>
      {/* modal conferma pending */}
      <div className={`${askPermissionPending ? "block" : "hidden"} fixed h-full inset-0 z-50 bg-black/40 overflow-hidden`}>
        <div className="w-full h-full flex justify-center items-center">
          <div className={`bg-white ${loading ? "animate-pulse" : ""}`}>
            <h1 className="text-orange-500 text-4xl p-5">do you really want to set as pending {eliminationSpot?.name}?</h1>
            <div className="flex justify-center gap-3 p-3">
              <button onClick={() => pendingSpot(eliminationSpot.id)} className="px-5">Yes</button>
              <button onClick={() => setAskPermissionPending(false)} className="px-5">No</button>
            </div>
          </div>
        </div>
      </div>

      <SearchFilters />
      <SpotDetails />
      <div className="grid_custom gap-1 py-3">
        {data?.content?.map((s) => (
          <div key={s.id} className="relative">
            <SpotCard spot={s} />
          <div className="absolute top-1 right-1 flex flex-col gap-1">
              <button onClick={() => askConfirmation(s)}>
                <RxCross2 size={20} />
              </button>
              {s.status !== "PENDING" &&
              <button onClick={() => askConfirmationPending(s)}>
                <ClipboardClock size={20}/>
              </button>}
              <Link className=" nav-link" href={`/spot/modify/${s.id}`}>
                <FaPencilAlt size={20} className="py-1" />
              </Link>
        </div>
            <div className={`absolute top-1 left-1 rounded-full w-[15px] h-[15px]
              ${s.status === "APPROVED" ? "bg-green-500" : ""}
              ${s.status === "PENDING" ? "bg-orange-400 animate-pulse" : ""}
              ${s.status === "UNAPPROVED" ? "bg-red-500" : ""}`}
            />
          </div>
        ))}
      </div>
       {data?.totalPages>1 &&<ArrowPageSelector totalPages={data?.totalPages}/>}
    </div>
  )
}