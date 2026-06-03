'use client'
import useEmblaCarousel from 'embla-carousel-react'
import useInsetStore from "@/app/(main)/store/InsetStore"

function CarouselSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[100px] h-[100px] bg-black/10 animate-pulse shrink-0" />
        ))}
      </div>
    </div>
  )
}

export default function ImageCarousel({ media }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true })
  const setMediaOpen = useInsetStore((state) => state.setMediaOpen)

  if (!media) return <CarouselSkeleton />
  if (media.length === 0) return <p className="text-xs opacity-50 py-1">No media available</p>

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-1">
        {media.map((m, i) => {
          if (m.format === "image") {
            return <img key={i} src={m.link} alt="spot media" onClick={() => setMediaOpen(m)} className="w-[90%] h-[150px] md:h-[220px] object-cover shrink-0" />
          }
          return <img key={i} src={m.thumbnailUrl} onClick={() => setMediaOpen(m)} className="w-full h-[150px] md:h-[220px] object-cover shrink-0" />
        })}
      </div>
    </div>
  )
}