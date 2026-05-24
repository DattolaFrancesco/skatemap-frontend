import SpotCardSkeleton from "../components/SpotCardSkeleton"

export default function Loading() {
  return (
    <div className="grid_custom gap-1 px-2 py-0.5">
      {Array.from({ length: 12 }).map((_, i) => (
        <SpotCardSkeleton key={i} />
      ))}
    </div>
  )
}