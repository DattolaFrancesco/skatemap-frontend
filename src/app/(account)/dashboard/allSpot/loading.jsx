function SpotCardSkeleton() {
  return (
    <div className="relative">
      <div className="rounded-xs w-full height_custom_spot_card bg-black/10 animate-pulse" />
      <div className="grid grid-cols-[2fr_auto] gap-1 mt-1">
        <div className="h-5 bg-black/10 animate-pulse rounded-xs" />
        <div className="h-5 w-16 bg-black/10 animate-pulse rounded-xs" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div>
      <div className="h-8 w-48 bg-black/10 animate-pulse rounded-xs mb-2" />
      <div className="grid_custom gap-1 py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SpotCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}