'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
export default function OpenMedia(){
    const mediaOpen = useInsetStore((state) => state.mediaOpen);
    const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
    return(
        <div className={` ${mediaOpen ? "block" : "hidden"} absolute h-full  inset-0 z-50 bg-black/10 overflow-hidden`}>
           <div className="h-full" onClick={()=>setMediaOpen(null)}>
                {mediaOpen && (
                    mediaOpen.format === "image" ?
                    <div className="flex justify-center items-center w-full h-full">
                        <img src={mediaOpen.link}
                         onClick={(e)=>e.stopPropagation()} 
                        alt="media of a skate spot" 
                        className="w-[50%]"
                        />
                    </div>
                    :
                    <div className="flex justify-center items-center w-full h-full">
                        <video 
                        src={mediaOpen.link}
                         onClick={(e)=>e.stopPropagation()}
                        alt="media of a skate spot"
                        className="h-full"
                        controls={true}
                        ></video>
                    </div>
                )}
           </div>
        </div>
    )
}