export  async function GET(request) {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    if (!city) return Response.json({ error: "city is required" }, { status: 400 })
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) return Response.json({ error: data.message }, { status: res.status })
        return Response.json(data)
}