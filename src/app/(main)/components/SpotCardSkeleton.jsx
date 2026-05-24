export default function SpotCardSkeleton() {
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