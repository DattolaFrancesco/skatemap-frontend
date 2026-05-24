export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[90%] md:w-[40%] bg_login px-2 py-0.5 flex flex-col gap-3 animate-pulse">
        <div className="h-10 w-32 bg-black/10 rounded-xs" />
        <div className="h-4 w-16 bg-black/10 rounded-xs" />
        <div className="h-8 w-full bg-black/10 rounded-xs" />
        <div className="h-4 w-24 bg-black/10 rounded-xs" />
        <div className="h-8 w-full bg-black/10 rounded-xs" />
        <div className="flex justify-between items-end py-1">
          <div className="h-3 w-48 bg-black/10 rounded-xs" />
          <div className="h-8 w-1/3 bg-black/10 rounded-xs" />
        </div>
      </div>
    </div>
  )
}