'use client'
import useEmblaCarousel from 'embla-carousel-react'

export default function ImageCarousel({ media }) {
    const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true})

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-1">
                {media.map((m, i) => {
                    if(m.format === "image"){
                    return(<img key={i} src={m.link} alt="spot media" className="w-[100px] h-[100px] object-cover shrink-0"/>)
                    }
                    else  return(<video key={i} src={m.link}  alt="spot media" className="w-[100px] h-[100px] object-cover shrink-0"/>)
                }
                    
                )}
            </div>
        </div>
    )
}