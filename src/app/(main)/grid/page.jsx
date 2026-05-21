import SpotCard from "../components/SpotCard";
import SpotDetails from "../components/SpotDetails";

export default async function Grid(){
    let data;
    const url = "http://localhost:3003/spots/all";
    try
    { const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
    }
    })
    data = await res.json();
    console.log(data)
    if (!res.ok) throw new Error(data.message);
    }
    catch(error){
        console.log(error.message)
    }
    if(!data) return <p className="mx-2 px-1">Backend non raggiungibile</p> 
    return (
        <div>
            <SpotDetails/>
            <div className="grid_custom gap-1 px-2 py-0.5">
                {data.content.map((s)=><SpotCard key={s.id} spot={s}/>)}
            </div>
       </div>
    )
}