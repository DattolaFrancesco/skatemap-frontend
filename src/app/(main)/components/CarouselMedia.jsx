'use client'
import useEmblaCarousel from 'embla-carousel-react'
import useInsetStore from "@/app/(main)/store/InsetStore"
import { usePathname } from 'next/navigation'


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
  const pathname = usePathname()
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true })
  const setMediaOpen = useInsetStore((state) => state.setMediaOpen)
  const isMobile = window.innerWidth < 992
  function getYouTubeThumbnail(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/
  );
  
  if (!match) return null;
  
  const id = match[1];
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  const handleDownload = async (url) => {
  const res = await fetch(url)  
  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = url.split('/').pop() 
  a.click()
  URL.revokeObjectURL(a.href)
  }
  const allVideos = (medias)=>{
    const videos = []
    medias.forEach(element => {
      if(element.format === "video")
        videos.push(element.link)
    });
    videos.forEach((e)=>handleDownload(e))
    
  }
  const openYouTube = (url) => {
  window.open(url, '_blank');
  };
  const photos = media.filter(m=>m.format === "image")
  if (!media) return <CarouselSkeleton />
  if (media.length === 0) return <p className="text-xs opacity-50 py-1 bg-transparent">No media available</p>


return (
  <div className="overflow-hidden" ref={emblaRef}>
    <div className="flex gap-1">
      {media.map((m, i) => {
        if (m.format === "image") {
          return (
            <img
              key={i}
              src={m.link}
              alt="spot media"
              onClick={() => setMediaOpen({ photos, media: m, format: "image" })}
              className="w-[90%] h-[150px] md:h-[220px] object-cover shrink-0"
            />
          )
        }
        if(i === 0 && m.status === "PENDING"){
        return (
            <button onClick={() =>allVideos(media)}>Download</button>
        )}
        if(m.status === "DONE") {
          return (
          <div
            key={i}
            onClick={() => openYouTube(m.link)}
            className="relative w-[90%] h-[150px] md:h-[220px] shrink-0 cursor-pointer"
          >
            <img
              src={getYouTubeThumbnail(m.link)}
              alt="video is not on yt yet"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 rounded-full w-12 h-12 flex items-center justify-center">
                <svg className="w-5 h-5 fill-white ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>)
        }
      })}
    </div>
  </div>
)
}