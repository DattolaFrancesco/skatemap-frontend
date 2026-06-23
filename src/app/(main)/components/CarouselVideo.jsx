'use client'
import useEmblaCarousel from 'embla-carousel-react'

const getYoutubeId = (url) => {
  if (url.includes("shorts/")) return url.split("shorts/")[1]?.split("?")[0]
  if (url.includes("v=")) return url.split("v=")[1]?.split("&")[0]
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0]
}

export default function CarouselVideo({ media }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ })

  return (
    <div className="relative w-full">
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex gap-2">
          {media.map((v, i) => (
            <div key={i} className="shrink-0 w-[250px] h-[140px]">
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(v.link)}`}
                className="w-full h-full rounded-[5px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
              />
            </div>
          ))}
        </div>
      </div>
     {media.length > 1 && <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 button--glass w-[30px] h-[30px] rounded-[5px] text-white"
      >
        ‹
      </button>}
      {media.length > 1 &&<button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 button--glass w-[30px] h-[30px] rounded-[5px] text-white"
      >
        ›
      </button>}
    </div>
  )
}