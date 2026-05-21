import SpotCard from "../components/SpotCard";
import SpotDetails from "../components/SpotDetails";

export default async function Grid(){
    const url = "http://localhost:3003/spots/all";
    const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
        }
    })
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log(data)
    return (
       <div>
            <SpotDetails/>
            <div className="grid_custom gap-1 px-2 py-0.5">
                {data.content.map((s)=><SpotCard key={s.id} spot={s}/>)}
            </div>
       </div>
    )
}