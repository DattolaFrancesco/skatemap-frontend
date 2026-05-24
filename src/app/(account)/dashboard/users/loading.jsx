function UserRowSkeleton() {
  return (
    <div className="grid grid-col-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_100px_30px] gap-2 items-center py-2 border-b">
      <div className="h-6 bg-black/10 animate-pulse rounded-xs" />
      <div className="h-6 bg-black/10 animate-pulse rounded-xs" />
      <div className="h-6 bg-black/10 animate-pulse rounded-xs" />
      <div className="h-6 bg-black/10 animate-pulse rounded-xs" />
      <div className="h-7 w-full bg-black/10 animate-pulse rounded-xs" />
      <div className="h-7 w-7 bg-black/10 animate-pulse rounded-xs ms-auto" />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      {Array.from({ length: 8 }).map((_, i) => (
        <UserRowSkeleton key={i} />
      ))}
    </div>
  )
}