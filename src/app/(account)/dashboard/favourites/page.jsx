'use client'

import MySpots from "../page"



export default function Favourites(){
return(
    <MySpots/>
)
}
// 'use client'

// import SpotCard from "@/app/(main)/components/SpotCard"
// import { useEffect, useState, useRef } from "react"
// import useUserStore from "../components/UserStore";
// import SpotDetails from "@/app/(main)/components/SpotDetails";
// import ArrowPageSelector from "@/app/(main)/components/ArrowPageSelector";
// import useNavigationStore from "@/app/(main)/store/NavigationStore"
// import useInsetStore from "@/app/(main)/store/InsetStore";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { useRouter } from "next/navigation";

// const PAGE_SIZE = 20;

// export default function Favourites() {
//     const [allFavs, setAllFavs] = useState(null)
//     const [currentPage, setCurrentPage] = useState(0)
//     const refresh = useUserStore((data) => data.refresh)
//     const setSpotOpen = useInsetStore((data) => data.setSpotOpen)
//     const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
//     const setRefresh = useUserStore((data) => data.setRefresh)
//     const setStatusHref = useNavigationStore((state) => state.setStatusHref);
//     const smallContainerRef = useRef(null)
//     const shouldBlockAnimateRef = useRef(false)
//     const pendingHref = useNavigationStore((state) => state.pendingHref);
//     const clearPendingHref = useNavigationStore((state) => state.clearPendingHref);
//     const router = useRouter();

//     useEffect(() => {
//         setStatusHref(false)
//         async function getFav() {
//             const token = localStorage.getItem('token')
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/all`, {
//                     method: "GET",
//                     headers: { "Authorization": `Bearer ${token}` }
//                 })
//                 const data = await res.json()
//                 if (!res.ok) throw new Error("Can't connect to the server")
//                 setAllFavs(data)  
//             } catch (err) {
//                 console.log(err.message)
//             }
//         }
//         getFav()
//     }, [refresh])
//     const totalPages = Math.ceil((allFavs?.length || 0) / PAGE_SIZE)
//     const paginatedFavs = allFavs?.slice(
//         currentPage * PAGE_SIZE,
//         (currentPage + 1) * PAGE_SIZE
//     ) || []
//     async function deleteFav(spotId) {
//         const token = localStorage.getItem('token')
//         try {
//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotId}`, {
//                 method: "DELETE",
//                 headers: { "Authorization": `Bearer ${token}` }
//             })
//             if (!res.ok) throw new Error("Can't connect to the server")
//             setAllFavs(prev => prev.filter(s => s.id !== spotId))
//             setRefresh(!refresh)
//         } catch (err) {
//             console.log(err.message)
//         }
//     }

//     useGSAP(() => {
//         if (!smallContainerRef.current) return
//         if (shouldBlockAnimateRef.current) {
//             shouldBlockAnimateRef.current = false
//             return
//         }
//         if (pendingHref) return
//         const els = gsap.utils.toArray(smallContainerRef?.current?.children)
//         if (!els.length) return
//         gsap.killTweensOf(els)
//         gsap.set(els, { y: window.innerHeight, opacity: 0 })
//         gsap.to(els, {
//             y: 0,
//             opacity: 1,
//             duration: 0.2,
//             stagger: 0.1,
//             ease: "power2.out",
//             clearProps: "transform,opacity",
//             onComplete: () => { setStatusHref(false) }
//         })
//     }, { scope: smallContainerRef, dependencies: [paginatedFavs] })

//     useEffect(() => {
//         if (!pendingHref) return
//         setStatusHref(true)
//         const els = gsap.utils.toArray(smallContainerRef?.current?.children)
//         gsap.killTweensOf(els)
//         gsap.to(els, {
//             y: window.innerHeight,
//             duration: 0.5,
//             stagger: 0.05,
//             ease: "power3.in",
//             onComplete: () => {
//                 clearPendingHref()
//                 router.push(pendingHref)
//             }
//         })
//     }, [pendingHref])
//     useEffect(()=>{ if(!allFavs || allFavs.length === 0)setMediaOpen(null);setSpotOpen(null);},[allFavs])

//     if (!allFavs || allFavs.length === 0) return (
//         <h1 className="text-2xl text-primary-500">You don't have favourite spots</h1>
//     )

//     return (
//         <>
//             <SpotDetails />
//             <div ref={smallContainerRef} className="grid_custom gap-1 py-3">
//                 {paginatedFavs.map((s) => (
//                     <div key={s.id} className="relative">
//                         <SpotCard spot={s} />
//                         <button
//                             onClick={() => deleteFav(s.id)}
//                             className="absolute top-1 right-1 text-sm md:text-base"
//                         >
//                             REMOVE
//                         </button>
//                     </div>
//                 ))}
//             </div>
//             {totalPages > 1 && (
//                 <ArrowPageSelector
//                     totalPages={totalPages}
//                     currentPage={currentPage}
//                     onPageChange={setCurrentPage}
//                 />
//             )}
//         </>
//     )
// }