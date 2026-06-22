'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
import { useState } from "react";

export default function OpenMedia() {
    const mediaOpen = useInsetStore((state) => state.mediaOpen);
    const setMediaOpen = useInsetStore((state) => state.setMediaOpen);
    const [active, setActive] = useState(0); // ← indice invece di link

    const close = () => {
        setMediaOpen(null);
        setActive(0);
    };

    if (!mediaOpen) return null

    return (
        <div className="fixed inset-0 z-50 h-full  overflow-hidden bg_openPhotos">
            <div className="h-full w-full" onClick={close}>
                <div className="flex h-[90%] w-full flex-col items-center justify-center gap-4 p-3 sm:gap-6 sm:p-6">
                    
                    {/* Foto principale */}
                    <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                        <img
                            src={mediaOpen.media[active].link}
                            alt="skate photo"
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-full max-w-full object-contain button--glass button p-2"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex w-full shrink-0 flex-wrap justify-center gap-2 sm:gap-3">
                        {mediaOpen.media.map((p, i) => (
                            <img
                                key={i}
                                src={p.link}
                                alt="skate photo"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActive(i);
                                }}
                                className={`h-12 w-16 object-cover  button--glass button p-2 cursor-pointer sm:h-16 sm:w-24 ${active === i ? "border-2 border-white" : ""}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}