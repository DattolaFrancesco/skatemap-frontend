'use client'
import { RxCross2 } from "react-icons/rx"
import useSpotForm from "./SpotFormStore"

export default function SpotDetailPreview(){
    const spot = useSpotForm((data) => data.spot);
    const spotImage = useSpotForm((data) => data.spotImage);
    const spotVideo = useSpotForm((data) => data.spotVideo);
    const types = spot.spotTypes || spot.types || []
    return(
        <div className="h-full w-full flex justify-center items-center">
            <div className="w-full h-full bg_preview break-words overflow-hidden">
                <main className="p-3 flex flex-col justify-between h-full overflow-scroll">
                    <div className="flex flex-col justify-between h-full relative">
                        <div>
                            <div className="flex justify-between">
                                <h1 className="font-bold font_details_h1">{spot.name?.toUpperCase()}</h1>
                                <RxCross2 size={38} className="cursor-pointer"/>
                            </div>
                            <aside className="flex gap-1">
                                {[...Array(5)].map((_,i)=>(
                                    <div key={i} className={`custom_box_size rounded-sm border 
                                        ${spot.risk === "HIGH" ? "bg-black":""}
                                        ${spot.risk === "MEDIUM" && i<3 ? "bg-black":""}
                                        ${spot.risk === "LOW" && i<1 ? "bg-black":""}`}>
                                    </div>
                                ))}
                            </aside>
                        </div>
                        <div className="h-full flex flex-col justify-around">
                            <section>
                                <div className="flex justify-between"><p>CONTINENT</p><p className="whitespace-pre-line">{spot.continent?.replace("NORTH","NORTH\n").replace("SOUTH","SOUTH\n")}</p></div>
                                <div className="flex justify-between border-t"><p>COUNTRY</p><p>{spot.country}</p></div>
                                <div className="flex justify-between border-t"><p>CITY</p><p>{spot.city}</p></div>
                                <div className="flex justify-between border-t"><p>STREET</p><p>{spot.street}</p></div>
                                <div className="flex justify-between border-t"><p>TYPE</p><p>{types.map((t)=>t.toUpperCase()).join(", ")}</p></div>
                                <div className="flex justify-between border-t"><p>RISK</p><p>{spot.risk}</p></div>
                            </section>
                            <section>
                                <p>{spot.description}</p>
                            </section>
                        </div>
                    </div>
                 <section>
                    <div>
                        <h2 className="font-semibold font_details_h2">Images</h2>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="aspect-square w-1/5 max-w-[100px] bg-black/10 border"/>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold font_details_h2">Videos</h2>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="aspect-square w-1/5 max-w-[100px] bg-black/10 border"/>
                            ))}
                        </div>
                    </div>
                </section>
        </main>
    </div>
</div>
)
}