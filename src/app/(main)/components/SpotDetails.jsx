'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
import CarouselMedia from "./CarouselMedia"
import OpenMedia from "./OpenMedia";
import Weather from "./Weather";
import { useEffect, useRef, useState } from "react";
import useUserStore from "@/app/(account)/dashboard/components/UserStore";
import Map from "@/app/googleMaps/Map";
import MiniGlobe from "./MiniGlobe";

export default function SpotDetails(){
     const spotOpen = useInsetStore((state) => state.spotOpen);
     const setSpotOpen = useInsetStore((state)=>state.setSpotOpen)
     const setMediaOpen = useInsetStore((state)=>state.setMediaOpen)
     const setRefreshy = useUserStore((state)=>state.setRefresh)
     const refreshy = useUserStore((state)=>state.refresh)
     const [data, setData] = useState(null)
     const [refresh,setRefresh] =useState(null)
     const [liked, setLiked] =useState(null)
     const [token, setToken] = useState(null)
     const [maps, setMaps] = useState(false)
     const [pendingLike, setPendingLike] = useState(false)
     const likedPending = useRef(false)

    async function getSpot(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/single/${spotOpen}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok) throw new Error("Can't connect to the server")
            setData(data)
        }catch(err){
            console.log(err.message)
        }
    }
    async function getFav(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            })
            const data = await res.json()
            if(!res.ok){
                if(data.message.includes("token")){console.log("You can't like post if you aren't logged in!")}
                throw new Error()
            }
            setLiked(data)
        }catch(err){
            console.log(err.message)
        } finally {
            setPendingLike(false)
            likedPending.current = false
        }
    }
    async function setFav(){
        if(likedPending.current) return
        likedPending.current = true
        setPendingLike(true)
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't set fav")
            setRefresh(!refresh)
            setRefreshy(!refreshy)
            setLiked(true)
        }catch(err){
            console.log(err.message)
            setRefresh(!refresh)
            setRefreshy(!refreshy)
        } finally {
            setPendingLike(false)
            likedPending.current = false
        }
    }
    async function deleteFav(){
        if(likedPending.current) return
        likedPending.current = true
        setPendingLike(true)
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't delete fav")
            setRefresh(!refresh)
            setLiked(null)
            setRefreshy(!refreshy)
        }catch(err){
            setRefresh(!refresh)
            setLiked(null)
            setRefreshy(!refreshy)
        }finally {
            setPendingLike(false)
            likedPending.current = false
        }
    }
    useEffect(() => {
    setToken(localStorage.getItem('token'))
    }, [])
    useEffect(()=>{
        if(!spotOpen) return
        getSpot()
        getFav(); 
    },[spotOpen,refresh])
  
    if(!data) return(
        <div className={`${spotOpen ? "w-full opacity-100" : "w-0 opacity-0"} fixed inset-0 z-999 min-h-full flex justify-start items-center transition-all duration-500 overflow-hidden`}>
            <main className="w-full sm:w-2/3 max-w-[800px] h-fit">
                <div className="bg-amber-50">
                    {/* header */}
                    <article className="flex justify-between items-center gap-3 bg-primary-500 px-2 py-1">
                        <div className="h-7 w-32 bg-primary-400 animate-pulse rounded"/>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary-400 animate-pulse rounded"/>
                            <div className="h-8 w-8 bg-primary-400 animate-pulse rounded"/>
                        </div>
                    </article>

                    {/* carousel + map */}
                    <article className="flex h-full">
                        <div className="w-1/2 h-48 p-2">
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded"/>
                        </div>
                        <div className="w-1/2 border-s-2 border-primary-500 p-2 relative">
                            <div className="w-full h-48 bg-gray-200 animate-pulse rounded flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                        </div>
                    </article>

                    {/* info section */}
                    <section className="flex border-y-2 border-primary-500">
                        <div className="w-2/3">
                            <section>
                                {[...Array(5)].map((_,i)=>(
                                    <div key={i} className="flex justify-between items-center border-primary-300 border-t-2 px-2 py-1">
                                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"/>
                                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"/>
                                    </div>
                                ))}
                            </section>
                            <section className="p-2 flex flex-col gap-2">
                                <div className="h-3 w-full bg-gray-200 animate-pulse rounded"/>
                                <div className="h-3 w-5/6 bg-gray-200 animate-pulse rounded"/>
                                <div className="h-3 w-4/6 bg-gray-200 animate-pulse rounded"/>
                            </section>
                        </div>
                        <div className="w-1/3 flex flex-col border-s-2 border-primary-500">
                            <div className="m-2 p-2 flex flex-col gap-2">
                                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"/>
                                <div className="h-16 w-full bg-gray-200 animate-pulse rounded"/>
                            </div>
                            <div className="border-t-2 border-primary-500 p-2">
                                <div className="h-24 w-full bg-gray-200 animate-pulse rounded"/>
                            </div>
                        </div>
                    </section>

                    {/* name + risk */}
                    <section>
                        <div className="border-primary-500 px-2 border-b-2 pb-1">
                            <div className="h-16 w-64 bg-gray-200 animate-pulse rounded"/>
                        </div>
                        <div className="p-2 flex flex-col gap-2">
                            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"/>
                            <div className="flex justify-between items-center">
                                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"/>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_,i)=>(
                                        <div key={i} className="w-20 h-5 bg-gray-200 animate-pulse border border-primary-500"/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )

    if(data) return(
        <div 
        onClick={()=>{
            setSpotOpen(null)
            setMediaOpen(null)
            setLiked(null)
            setMaps(false)
            setTimeout(() => {
            setData(null)
            }, 200);
        }}
        className={` ${spotOpen ? "w-full opacity-100" : "w-0 opacity-0"} fixed inset-0 z-999 min-h-full bg-black/50 flex justify-start items-center transition-all duration-500  overflow-hidden overflow-scroll`}>
           <main onClick={(e)=>e.stopPropagation()} className="w-full sm:w-2/3 max-w-[800px] h-fit">
                <div className="bg-amber-50">
                    <article  className="flex justify-between items-center gap-3 bg-primary-500 px-2 py-1">
                        <h1 className="text-2xl font-bold">SPOT N°{data?.id?.slice(-5)}</h1>
                        <div  className="flex items-center gap-3 ">
                            {token && 
                            <div>
                                 {liked ? <button onClick={()=>deleteFav()}  className={`cursor-pointer bg-transparent text-3xl hover:scale-[1.2] ${pendingLike ? "animate-pulse" : ""}`}>♥</button>
                                  :<button onClick={()=>setFav()}  className={`cursor-pointer bg-transparent text-3xl hover:scale-[1.2] ${pendingLike ? "animate-pulse" : ""}`}>♡</button>}       
                             </div>
                             }
                             <button  onClick={()=>{
                                        setSpotOpen(null)
                                        setMediaOpen(null)
                                        setLiked(null)
                                        setMaps(false)
                                        setTimeout(() => {
                                        setData(null)
                                        }, 200);
                                    }} className="cursor-pointer bg-transparent text-2xl hover:border-b">X</button> 
                        </div>
                    </article>
                    <article className={`flex h-full  `}>
                         <div className="w-1/2 h-full flex items-center justify-center p-2 my-auto">
                           <CarouselMedia media={data?.image}/>
                         </div>
                         <div className="w-1/2 border-s-2 border-primary-500 flex justify-center items-center p-2 relative">
                           {maps ?<MiniGlobe lat={data?.latitude} lng={data?.longitude}/> : <Map lat={data?.latitude} lng={data?.longitude}/> }
                            <div className="absolute bottom-2 left-2 flex flex-col gap-2">
                                <button onClick={()=>setMaps(!maps)} className="border bg-amber-50 px-3  cursor-pointer text-sm">CHANGE VISIBILITY</button>
                            </div>
                         </div>
                    
                    </article>
                   <section className="flex border-y-2 border-primary-500">
                          <OpenMedia/>
                    <div className="w-2/3">
                        <section>
                            <div className="flex justify-between items-center"><p className="font-bold bg-transparent  ms-2 pt-1 text-s md:text-m lg:text-xl">//CONTINENT</p><p className="bg-transparent me-2 ">{data?.continents?.replace("NORTH","NORTH\n").replace("SOUTH", "SOUTH\n")}</p></div>
                            <div className="flex justify-between items-center border-primary-300 border-t-2 pt-0 md:pt-1"><p className="font-bold bg-transparent  ms-2  text-s md:text-m lg:text-xl">//COUNTRY</p><p className="bg-transparent me-2 ">{data?.country}</p></div>
                            <div className="flex justify-between items-center border-primary-300 border-t-2 pt-0 md:pt-1"><p className="font-bold bg-transparent  ms-2  text-s md:text-m lg:text-xl">//CITY</p><p className="bg-transparent me-2 ">{data?.city}</p></div>
                            <div className="flex justify-between items-center border-primary-300 border-t-2 pt-0 md:pt-1"><p className="font-bold bg-transparent  ms-2  text-s md:text-m lg:text-xl">//STREET</p><p className="bg-transparent me-2 ">{data?.street}</p></div>
                            <div className="flex justify-between items-center border-primary-300 border-y-2 pt-0 md:pt-1"><p className="font-bold bg-transparent  ms-2  text-s md:text-m lg:text-xl">//TYPE</p><p className="bg-transparent me-2 ">{data?.spotTypes?.map((t)=>t.toUpperCase()).join(", ")}</p></div>
                        </section>
                        <section className="p-2" >
                               <p className=" wrap-break-word bg-transparent text-xs md:text-sm lg:text-lg">{data?.description}</p>
                       </section>
                    </div>
                    <div className="w-1/3 flex  flex-col  border-s-2 border-primary-500 ">
                        <div className=" bg-primary m-2 p-2">
                            <h1 className="ms-2 text-md md:text-2xl">WEATHER</h1>
                            <Weather city={data?.city}/>
                        </div>
                        <div className="border-t-2 border-primary-500  p-2">
                             <CarouselMedia media={data?.video}/>
                        </div>
                    </div>
                   </section>
                   <section>
                        <div className="border-primary-500 px-2 border-b-2 pb-1"><h1 className="text-6xl md:text-8xl font-bold">{data?.name}</h1></div>
                        <div className=" p-2 ">
                                <h1 className="text-2xl ">RISK</h1>
                               <div className="flex justify-between items-center">
                                    <h1 className="text-4xl font-bold text-primary-700">{data?.risk}</h1>
                                    <aside className="flex gap-1">
                                    {[...Array(3)].map((_,i)=>(
                                    <div key={i} className={`w-20 h-5 border border-primary-500 
                                        ${data.risk === "HIGH" ? "bg-primary-500":""}
                                        ${data.risk === "MEDIUM" && i<2 ? "bg-primary-500":""}
                                        ${data.risk === "LOW" && i<1 ? "bg-primary-500":""}`}></div>
                                    ))}
                                    </aside>
                               </div>
                        </div>
                   </section>
                </div>
           </main>
           
           
        </div>
    )
}