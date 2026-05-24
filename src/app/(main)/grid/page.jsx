import { Suspense } from "react"
import SpotCard from "../components/SpotCard"
import SpotDetails from "../components/SpotDetails"

function SpotCardSkeleton() {
  return (
    <div>
      <div className="rounded-xs w-full height_custom_spot_card bg-black/10 animate-pulse" />
      <div className="grid grid-cols-[2fr_auto] gap-1 mt-1">
        <div className="h-5 bg-black/10 animate-pulse rounded-xs" />
        <div className="h-5 w-16 bg-black/10 animate-pulse rounded-xs" />
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid_custom gap-1 px-2 py-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <SpotCardSkeleton key={i} />
      ))}
    </div>
  )
}

async function SpotGrid({ searchParams }) {
  const params = await searchParams
  const query = new URLSearchParams(params)
  const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/all?${query.toString()}`
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)

  return (
    <div className="grid_custom gap-1 px-2 py-0.5">
      {data.content.map((s) => <SpotCard key={s.id} spot={s} />)}
    </div>
  )
}

export default function Grid({ searchParams }) {
  return (
    <div>
      <SpotDetails />
      <Suspense fallback={<GridSkeleton />}>
        <SpotGrid searchParams={searchParams} />
      </Suspense>
    </div>
  )
}