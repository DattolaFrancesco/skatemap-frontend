'use client'
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useNavigationStore from "../../store/NavigationStore";
import gsap from "gsap";
import { RxCross2 } from "react-icons/rx"
import { useGSAP } from "@gsap/react";
import TransitionLink from "../../components/TransitionLink";

export default function DonationSuccess() {
    const router = useRouter();
    const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
    const setStatusHref = useNavigationStore((state) => state.setStatusHref);
    const pendingHref = useNavigationStore((state) => state.pendingHref);
    const containerRef = useRef(null)
    const scopeContainerRef = useRef(null)
    setStatusHref(false)
    useGSAP(() => {
        if (!containerRef.current) return
        gsap.killTweensOf(containerRef.current)
        gsap.set(containerRef.current, { yPercent: -300 })
        gsap.to(containerRef.current, {
            yPercent: 0,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => { setStatusHref(false) }
        })
    }, { dependencies: [scopeContainerRef] })
    useEffect(() => {
        if (!pendingHref) return
        setStatusHref(true)
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
            yPercent: -300,
            duration: 0.75,
            ease: "power3.inOut",
            onComplete: () => {
                clearPendingHref()
                router.push(pendingHref)
            }
        })
    }, [pendingHref])
    return (
        <main ref={scopeContainerRef} className="justify-center items-center ps-2 flex flex-col flex-1">
            <div ref={containerRef} className="w-5/6 md:w-1/2">
                <div className="button--glass button p-3">
                    <div className="bg_login p-2 rounded-[5px]">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">DONATE</h1>
                            <TransitionLink className="p-2 button--glass button rounded-[5px]" href="/"><RxCross2 size={12}/></TransitionLink>
                        </div>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-bold mb-3">SKATE SPOT MAP</p>
                        <p className="text-[10px] sm:text-xs md:text-sm leading-tight mt-5">
                            YOUR DONATION MEANS A LOT TO US.
                        </p>
                        <p className="text-[10px] sm:text-xs md:text-sm leading-tight mt-3 text-gray-600">
                            EVERY CENT GOES DIRECTLY TO KEEPING THE SERVERS RUNNING AND THE MAP FREE FOR EVERY SKATER OUT THERE.
                            NO ADS, NO PAYWALLS — JUST SPOTS.
                        </p>
                        <div className="flex flex-col gap-2 mt-8">
                            <p className="text-sm sm:text-base md:text-xl font-bold">WHAT YOUR DONATION HELPS WITH</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">— UPGRADING THE SERVERS ONLINE</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">— FUTURE CHANCE TO ADD MORE PHOTOS AND CLIPS</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">— KEEPING THE MAP FREE AND AD-FREE</p>
                        </div>
                        <TransitionLink href="/" className="block button--glass button w-full py-3 text-lg sm:text-2xl md:text-3xl font-bold text-center mt-8">
                            BACK TO THE MAP
                        </TransitionLink>
                    </div>
                </div>
            </div>
        </main>
    )
}