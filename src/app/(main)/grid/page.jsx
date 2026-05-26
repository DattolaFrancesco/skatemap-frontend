import ArrowPageSelector from "../components/ArrowPageSelector";
import SpotCard from "../components/SpotCard";
import SpotDetails from "../components/SpotDetails";

export default async function Grid({ searchParams }){
    const params = await searchParams
    const query = new URLSearchParams(params)  
    let data;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/approved/all?${query.toString()}`;
    try
    { const res = await fetch(url,{
        method:"GET",
         headers: {
            "Content-Type": "application/json",
    }
    })
    data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log(data)
    }
    catch(error){
        console.log(error.message)
    }
    if(!data) return <h1 className="text-2xl px-2 text-primary-500">Server is not available</h1> 
    if(data?.content?.length === 0) return <h1 className="text-2xl px-2 text-primary-500">There aren't spot</h1> 
    return (
        <div>
            <SpotDetails/>
            <div className="grid_custom gap-1 px-2 py-0.5">
                {data.content.map((s)=><SpotCard key={s.id} spot={s}/>)}
            </div>
            {data?.totalPages>1 && <ArrowPageSelector totalPages={data?.totalPages}/>}
       </div>
    )
}