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
        <div className="grid_custom">
            {data.content.map((s)=>(
                <div className="bg-amber-300">
                    {s.name}
                </div>
            ))}
        </div>
    )
}