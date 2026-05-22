'use client'
import { useEffect, useState } from "react";
import Select from 'react-select';
import usePinRegistration from "@/app/generic/store/PinRegistration";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useSpotForm from "./SpotFormStore"

const MapSpotRegistration = dynamic(() => import('./MapSpotRegistration'), { ssr: false })

const options = [
  { value: 'RAIL', label: 'Rail' },
  { value: 'LEDGE', label: 'Ledge' },
  { value: 'STREET', label: 'Street' },
  { value: 'SKATEPARK', label: 'Skatepark' },
  { value: 'STAIR', label: 'Stair' },
]

export default function SpotForm() {
  const pin = usePinRegistration((state) => state.pin);
  const setSpot = useSpotForm((data) => data.setSpot);
  const setSpotImage = useSpotForm((data) => data.setSpotImage);
  const router = useRouter();
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '', latitude: '', longitude: '',
    description: '', risk: 'LOW', types: [],
    city: '', country: '', continent: '', street: '',
  });

  useEffect(() => {
    if (!pin) return
    setForm((prev) => ({ ...prev, latitude: pin.lat, longitude: pin.lng }));
    handleCoordinates(pin.lat, pin.lng)
  }, [pin])

  useEffect(() => {
    setSpot(form)
  }, [form])


  async function handleCoordinates(lat, lng) {
    try {
      const [bigData, nominatim] = await Promise.all([
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`).then(r => r.json()),
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`).then(r => r.json())
      ])
      const city = (bigData.city || bigData.locality || '').toUpperCase()
      const continent = (bigData.continent || '').toUpperCase().replace(/\s/g, '')
      const country = (bigData.countryName || '').toUpperCase()
      const street = (nominatim.address?.road || nominatim.address?.pedestrian || nominatim.address?.footway || '').toUpperCase()
      setForm((prev) => ({ ...prev, city, continent, country, street }))
    } catch (err) {
      console.log(err.message)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'description' && value.length > 500) return
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.latitude || !form.longitude) {
        setError("Click on the map to set the location")
        return
    }
    
    console.log(form,images,videos)
    // const token = localStorage.getItem('token')
    // try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${token}`
    //     },
    //     body: JSON.stringify(form),
    //   });
    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message);

    //   // fetch separate per immagini e video
    //   if (images.length > 0) {
    //     const formData = new FormData()
    //     images.forEach(img => formData.append('files', img))
    //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${data.id}/images`, {
    //       method: "POST",
    //       headers: { "Authorization": `Bearer ${token}` },
    //       body: formData,
    //     })
    //   }

    //   if (videos.length > 0) {
    //     const formData = new FormData()
    //     videos.forEach(vid => formData.append('files', vid))
    //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${data.id}/videos`, {
    //       method: "POST",
    //       headers: { "Authorization": `Bearer ${token}` },
    //       body: formData,
    //     })
    //   }

    //   router.push('/')
    // } catch (err) {
    //   setError(err.message)
    // }
  }

  return (
    <div className="flex w-full h-[90%] justify-center items-cente p-4">
      <div className="w-full bg_login px-3 py-3 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <div className="flex flex-row gap-3">
            <div className="flex flex-col gap-2 w-1/2">
              <h1 className="text-4xl font-bold">ADD SPOT</h1>
              <div className="flex flex-col gap-1">
               <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold">NAME</h1>
                    <p className="text-xs self-end">{form.name.length}/20</p>
               </div>
                <input className="bg-white py-2" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">LATITUDE</h1>
                <input className="bg-white py-2 opacity-50" readOnly  name="latitude" value={form.latitude} placeholder="Click on map" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">LONGITUDE</h1>
                <input className="bg-white py-2 opacity-50" readOnly  name="longitude" value={form.longitude} placeholder="Click on map" />
              </div>
            </div>
            <div className="w-full">
              <MapSpotRegistration />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">CONTINENT</h1>
              <select className="bg-white py-2" name="continent" value={form.continent} onChange={handleChange}>
                <option value="">Select continent</option>
                <option value="AFRICA">AFRICA</option>
                <option value="ANTARCTICA">ANTARCTICA</option>
                <option value="ASIA">ASIA</option>
                <option value="EUROPE">EUROPE</option>
                <option value="NORTHAMERICA">NORTH AMERICA</option>
                <option value="OCEANIA">OCEANIA</option>
                <option value="SOUTHAMERICA">SOUTH AMERICA</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">COUNTRY</h1>
              <input className="bg-white py-2" name="country" value={form.country} onChange={handleChange} placeholder="Country" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">CITY</h1>
              <input className="bg-white py-2" name="city" value={form.city} onChange={handleChange} placeholder="City" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">STREET</h1>
              <input className="bg-white py-2" name="street" required value={form.street} onChange={handleChange} placeholder="Street" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">RISK</h1>
              <select className="bg-white py-2" name="risk" value={form.risk} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">TYPES</h1>
              <Select
                isMulti
                required
                options={options}
                value={options.filter((o) => form.types.includes(o.value))}
                onChange={(selected) => setForm((prev) => ({
                  ...prev,
                  types: selected ? selected.map((s) => s.value) : [],
                }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">IMAGES</h1>
              <input
                className="bg-white py-2"
                type="file"
                accept="image/*"
                multiple
                required
                onChange={(e) => {
                  const files = Array.from(e.target.files)
                  if (files.length > 5) { setError("Max 5 images"); e.target.value = ''; return }
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">VIDEOS</h1>
              <input
                className="bg-white py-2"
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files)
                  if (files.length > 5) { setError("Max 5 videos"); e.target.value = ''; return }
       
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold">DESCRIPTION</h1>
              <p className="text-xs self-end">{form.description.length}/500</p>
            </div>
            <textarea required className="bg-white py-2 w-full" rows={4} name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          </div>

          {error && <p className="text-red-800 py-1">{error}</p>}

          <aside className="flex justify-end items-end">
            <button type="submit" className="bg-black/30 hover:bg-black/40 text-2xl font-semibold w-1/3 py-2">SUBMIT</button>
          </aside>
        </form>
      </div>
    </div>
  )
}