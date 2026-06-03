'use client'
import useInsetStore from "@/app/(main)/store/InsetStore"
import CarouselMedia from "./CarouselMedia"
import OpenMedia from "./OpenMedia";
import Weather from "./Weather";
import { useEffect, useState } from "react";
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
        console.log(data)
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
        }
    }
    async function setFav(){
        const token = localStorage.getItem('token')
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fav/${spotOpen}`,{
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if(!res.ok) throw new Error("Can't set fav")
            setRefresh(!refresh)
            setRefreshy(!refreshy)
        }catch(err){
            console.log(err.message)
            setRefresh(!refresh)
            setRefreshy(!refreshy)
        }
    }
    async function deleteFav(){
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
    
    if(data) return(
        <div 
        onClick={()=>{
            setSpotOpen(null)
            setMediaOpen(null)
            setLiked(null)
            setData(null)
        }}
        className={` ${spotOpen ? "w-full opacity-100" : "w-0 opacity-0"} fixed  inset-0 z-999 min-h-full flex justify-start transition-all duration-500 overflow-scroll overflow-x-hidden`}>
           <main onClick={(e)=>e.stopPropagation()} className="w-full md:w-2/3 max-w-[800px] h-fit bg-amber-50">
                <div className="">
                    <article  className="flex justify-between items-center gap-3 bg-primary-500 px-2 py-1">
                        <h1 className="text-2xl">SPOT N°{data?.id?.slice(-5)}</h1>
                        {token && 
                        <div className="flex items-center gap-3 ">
                             {liked ? <button onClick={()=>deleteFav()} className="cursor-pointer bg-transparent text-2xl ">♥</button>
                              :<button onClick={()=>setFav()} className="cursor-pointer bg-transparent text-2xl hover:border-b">♡</button>}
                            <button  onClick={()=>{setSpotOpen(null);setLiked(null)}} className="cursor-pointer bg-transparent text-2xl hover:border-b">X</button>        
                         </div>
                         }
                    </article>
                    <article className="flex ">
                         <div className="w-1/2 h-full flex items-center justify-center p-2">
                           <CarouselMedia media={data?.image}/>
                         </div>
                         <div className="w-1/2 border-s-2 border-primary-500 flex justify-center items-center p-2">
                           {maps ?<MiniGlobe lat={40} lng={5}/> : <Map lat={40} lng={5}/> }
                         </div>
                          <OpenMedia/>
                    </article>
                   <section className="flex border-y-2 border-primary-500">
                    <div className="w-2/3">
                        <section>
                            <div className="flex justify-between"><p className="font-bold bg-transparent text-xl ms-2 pt-1">//CONTINENT</p><p className="bg-transparent me-2 pt-1">{data?.continents?.replace("NORTH","NORTH\n").replace("SOUTH", "SOUTH\n")}</p></div>
                            <div className="flex justify-between border-primary-300 border-t-2"><p className="font-bold bg-transparent text-xl ms-2 pt-1">//COUNTRY</p><p className="bg-transparent me-2 pt-1">{data?.country}</p></div>
                            <div className="flex justify-between border-primary-300 border-t-2"><p className="font-bold bg-transparent text-xl ms-2 pt-1">//CITY</p><p className="bg-transparent me-2 pt-1">{data?.city}</p></div>
                            <div className="flex justify-between border-primary-300 border-t-2"><p className="font-bold bg-transparent text-xl ms-2 pt-1">//STREET</p><p className="bg-transparent me-2 pt-1">{data?.street}</p></div>
                            <div className="flex justify-between border-primary-300 border-y-2"><p className="font-bold bg-transparent text-xl ms-2 pt-1">//TYPE</p><p className="bg-transparent me-2 pt-1">{data?.spotTypes?.map((t)=>t.toUpperCase()).join(", ")}</p></div>
                        </section>
                        <section className="p-2" >
                               <p className=" wrap-break-word bg-transparent">{data?.description}</p>
                       </section>
                    </div>
                    <div className="w-1/3 flex  flex-col  border-s-2 border-primary-500 ">
                        <div className=" bg-primary m-2 p-2">
                            <h1 className="ms-2 text-2xl">WEATHER</h1>
                            <Weather city={data?.city}/>
                        </div>
                        <div className="border-t-2 border-primary-500  p-2">
                             <CarouselMedia media={data?.video}/>
                        </div>
                    </div>
                   </section>
                   <section>
                        <div className="border-primary-500 px-2 border-b-2 pb-1"><h1 className="text-8xl font-bold">{data?.name}</h1></div>
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
    // return(
    //     <div 
    //     onClick={()=>{
    //         setSpotOpen(null)
    //         setMediaOpen(null)
    //         setLiked(null)
    //         setData(null)
    //     }}
    //     className={` ${spotOpen ? "block" : "hidden"} fixed  inset-0 z-999  bg-black/30 min-h-full flex justify-center items-center`}>
    //         <div
    //         onClick={(e)=>e.stopPropagation()}
    //         className="bg_custom_spot_details  break-words overflow-hidden">
    //            {spotOpen && data && (
    //             <main className="p-3 flex flex-col h-full overflow-y-auto gap-5">
    //                 <div className="flex flex-col justify-between  relative">
    //                     <div>
    //                         <div className="flex justify-between ">
    //                             <h1 className="font-bold font_details_h1">{data.name.toUpperCase()}</h1>
    //                             <div className="flex justify-center items-center gap-3">
    //                               {token && <div>
    //                                    {liked ? <HeartOff size={30} onClick={()=>deleteFav()} className="cursor-pointer"/>
    //                                     :<Heart size={30} onClick={()=>setFav()} className="cursor-pointer"/>}
    //                                </div>}
    //                                 <RxCross2 size={38} onClick={()=>{setSpotOpen(null);setLiked(null)}} className="cursor-pointer"/>
    //                             </div>
    //                         </div>
    //                         <aside className="flex gap-1">
    //                         {[...Array(5)].map((_,i)=>(
    //                         <div key={i} className={`custom_box_size rounded-sm border 
    //                             ${data.risk === "HIGH" ? "bg-primary-500":""}
    //                             ${data.risk === "MEDIUM" && i<3 ? "bg-primary-500":""}
    //                             ${data.risk === "LOW" && i<1 ? "bg-primary-500":""}`}></div>
    //                         ))}
    //                         </aside>
    //                     </div>
    //                <div className="h-full flex flex-col py-5 gap-5 ">
    //                     <section>
    //                         <div className="flex justify-between"><p className="font-bold">CONTINENT</p><p>{data.continents.replace("NORTH","NORTH\n").replace("SOUTH", "SOUTH\n")}</p></div>
    //                         <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">COUNTRY</p><p>{data.country}</p></div>
    //                         <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">CITY</p><p>{data.city}</p></div>
    //                         <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">STREET</p><p>{data.street}</p></div>
    //                         <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">WEATHER</p><Weather city={data.city}/></div>
    //                         <div className="flex justify-between border-primary-300 border-t"><p className="font-bold">TYPE</p><p>{data.spotTypes.map((t)=>t.toUpperCase()).join(", ")}</p></div>
    //                         <div className="flex justify-between border-primary-300 border-t "><p className="font-bold">RISK</p><p>{data.risk}</p></div>
    //                     </section>
    //                     <section className="py-20" >
    //                             <p className=" wrap-break-word">{data.description}</p>
    //                     </section>
    //                     <OpenMedia/>
    //                </div>
    //                  </div>
    //                 <section className="py-5 flex flex-col gap-5">
    //                     <div>
    //                         <h2 className="font-semibold font_details_h2">Images</h2>
    //                         <CarouselMedia media={data.image}/>
    //                     </div>
    //                     <div>
    //                         <h2 className="font-semibold font_details_h2">Videos</h2>
    //                         <CarouselMedia media={data.video}/>
    //                     </div>
    //                 </section>
    //                 <div className="w-full py-3 flex flex-col">
    //                     <p className="font-semibold font_details_h2 text-center mb-3">Google maps spot location</p>
    //                     <Map lat={data.latitude} lng={data.longitude} />
    //                 </div>
    //             </main>
    //            )}
    //         </div>
    //     </div>
    // )
}