import SpotCardSkeleton from "@/app/(main)/components/SpotCardSkeleton";

export default function Loading() {
  return (
    <div className="grid_custom gap-1 py-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SpotCardSkeleton key={i} />
      ))}
    </div>
  )
}