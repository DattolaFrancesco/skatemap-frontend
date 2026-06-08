'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
import { useState } from "react";

export default function OpenMedia() {
    const mediaOpen = useInsetStore((state) => state.mediaOpen);
    const setMediaOpen = useInsetStore((state) => state.setMediaOpen);
    const [active, setActive] = useState(null);

    const close = () => {
        setMediaOpen(null);
        setActive(null);
    };

    return (
        <div className={`${mediaOpen ? "block" : "hidden"} fixed inset-0 z-50 h-full overflow-hidden bg-black/70`}>
            <div className="h-full w-full" onClick={close}>
                {mediaOpen && (
                    mediaOpen.format === "image" ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-3 sm:gap-6 sm:p-6">
                            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                                <img
                                    src={active ?? mediaOpen.media.link}
                                    alt="skate photo"
                                    onClick={(e) => e.stopPropagation()}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>

                            <div className="flex w-full shrink-0 flex-wrap justify-center gap-2 sm:gap-3">
                                {mediaOpen.photos.map((p) => {
                                    const isActive = (active ?? mediaOpen.media.link) === p.link;
                                    return (
                                        <div
                                            key={p.link}
                                            className="h-12 w-16 cursor-pointer overflow-hidden  sm:h-16 sm:w-24"
                                        >
                                            <img
                                                src={p.link}
                                                alt="skate photo"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActive(p.link);
                                                }}
                                                className={`h-full w-full object-cover ${isActive ? "border-2 border-primary-500" : ""}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center p-3 sm:p-6">
                            <video
                                src={mediaOpen.link}
                                onClick={(e) => e.stopPropagation()}
                                className="max-h-[80vh] max-w-[90vw]"
                                controls
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
}