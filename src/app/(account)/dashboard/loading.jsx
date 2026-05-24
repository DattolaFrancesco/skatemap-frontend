function NavSkeleton() {
  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="w-full flex flex-col gap-3">
        <div className="h-14 w-48 bg-black/20 animate-pulse" />
        <div className="h-7 w-36 bg-black/20 animate-pulse mt-3" />
        <div className="h-7 w-52 bg-black/20 animate-pulse" />
      </div>
      <div className="w-full flex flex-col justify-around">
        <div className="flex ms-auto">
          <div className="nav-link w-16 h-5 bg-black/20 animate-pulse" />
        </div>
        <div className="flex justify-end gap-3 py-4">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="h-14 w-12 bg-black/20 animate-pulse" />
            <div className="h-5 w-14 bg-black/20 animate-pulse" />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="h-14 w-12 bg-black/20 animate-pulse" />
            <div className="h-5 w-20 bg-black/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LinksSkeleton() {
  return (
    <div className="w-full flex flex-wrap justify-between gap-2 py-2 border-t border-b mt-3">
      <div className="flex gap-2">
        <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
        <div className="nav-link w-20 h-5 animate-pulse bg-black/20" />
        <div className="nav-link w-20 h-5 animate-pulse bg-black/20" />
        <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
      </div>
      <div className="flex">
        <div className="nav-link w-16 h-5 animate-pulse bg-black/20" />
      </div>
    </div>
  )
}

function SpotsSkeleton() {
  return (
    <div>
      <div className="border-b py-2 flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-black/10 animate-pulse rounded-xs" />
          <div className="h-5 w-20 bg-black/10 animate-pulse rounded-xs" />
          <div className="h-5 w-24 bg-black/10 animate-pulse rounded-xs" />
        </div>
        <div className="h-5 w-20 bg-black/10 animate-pulse rounded-xs" />
      </div>
      <div className="grid_custom gap-1 py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="rounded-xs w-full height_custom_spot_card bg-black/10 animate-pulse" />
            <div className="grid grid-cols-[2fr_auto] gap-1 mt-1">
              <div className="h-5 bg-black/10 animate-pulse rounded-xs" />
              <div className="h-5 w-16 bg-black/10 animate-pulse rounded-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="px-2 py-1">
      <NavSkeleton />
      <LinksSkeleton />
      <SpotsSkeleton />
    </div>
  )
}