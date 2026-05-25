'use client'
import { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import usePinRegistration from "@/app/spot/components/PinRegistration";
import dynamic from "next/dynamic";
import useSpotForm from "./SpotFormStore"
import Link from "next/link";


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
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
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
    const start = e.target.selectionStart
    const end = e.target.selectionEnd
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleAddImages(e) {
  const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
  const merged = [...images, ...incoming]
  if (merged.length > 5) { setError("Max 5 images"); return }
  setImages(merged)
  e.target.value = '' // reset input così puoi riaprirlo
  }

  function handleAddVideos(e) {
  const incoming = Array.from(e.target.files).filter(f => f.type.startsWith('video/'))
  const merged = [...videos, ...incoming]
  if (merged.length > 3) { setError("Max 3 videos"); return }
  setVideos(merged)
  e.target.value = ''
  }

  function removeImage(index) {
  setImages(prev => prev.filter((_, i) => i !== index))
  }

  function removeVideo(index) {
  setVideos(prev => prev.filter((_, i) => i !== index))
  }
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.latitude || !form.longitude) {
        setError("Click on the map to set the location")
        return
    }
    setLoading(true)
     const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      try{
        await handleImagesSubmit(data.id)
        await handleVideosSubmit(data.id)
      }
      catch(err){
        await deleteSpotById(data.id)
        setError(err.message)
        setMessage("")
        setLoading(false)
        return
      }
      setError("")
      setMessage("SPOT CREATED")
      setForm({
        name: '', latitude: '', longitude: '',
        description: '', risk: 'LOW', types: [],
        city: '', country: '', continent: '', street: '',
      })
      imageInputRef.current.value = ''
      setImages([])
      videoInputRef.current.value = ''
      setVideos([])
      setLoading(false)
     } catch (err) {
      setError(err.message)
      setMessage("")
      setLoading(false)
     }
  }
  async function handleVideosSubmit(spotId){
    if (!videos || videos.length === 0) return
    const formData = new FormData()
      videos.forEach(e => {
      formData.append("file",e)
    });
     const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/video/${spotId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    })
    if (!res.ok) throw new Error("Video upload failed");
  }
  async function handleImagesSubmit(spotId){
    if (!images || images.length === 0) throw new Error(data.message)
      const formdata = new FormData()
      images.forEach((i)=>{
      formdata.append("file",i)
    })
     const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/image/${spotId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formdata,
    })
    if (!res.ok) throw new Error("Image upload failed");
  }
  async function deleteSpotById(spotId){;
    try{
       const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message);
      }
      catch(err){console.log(err.message, "delete")}
  }

  return (
  <div className={`flex flex-col w-full h-full justify-center items-center ${loading ? "animate-pulse" : ""}`}>
    <div className="w-full mb-0.5 md:mb-1">
      <Link href={"/"} className={`nav-link block text-center py-0.5 text-xs md:text-sm ${loading ? "invisible" : ""}`}>BACK</Link>
    </div>
    <div className="w-full h-full bg_login px-2 py-1.5 md:px-3 md:py-2 flex flex-col overflow-y-auto">
      <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between gap-1.5 md:gap-2 lg:gap-3">

        {/* TOP: name + map */}
        <div className="flex flex-row gap-1.5 md:gap-2 lg:gap-3">
          <div className="flex flex-col gap-1 w-1/2">
            <h1 className="text-lg md:text-xl lg:text-2xl xl:text-4xl font-bold">ADD SPOT</h1>
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between">
                <label className="text-xs md:text-sm lg:text-2xl font-semibold">NAME</label>
                <p className={`text-xs self-end ${form.name.length > 30 ? "text-red-800" : ""}`}>{form.name.length}/30</p>
              </div>
              <input className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" required name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs md:text-sm lg:text-2xl font-semibold">LATITUDE</label>
              <input className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm opacity-50" readOnly name="latitude" value={form.latitude} placeholder="Click on map" />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs md:text-sm lg:text-2xl font-semibold">LONGITUDE</label>
              <input className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm opacity-50" readOnly name="longitude" value={form.longitude} placeholder="Click on map" />
            </div>
          </div>
          <div className="w-full">
            <MapSpotRegistration />
          </div>
        </div>

        {/* GRID FIELDS */}
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-1.5 md:gap-2 lg:gap-3">
          <div className="flex flex-col gap-0.5">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">CONTINENT</label>
            <select className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="continent" value={form.continent} onChange={handleChange}>
              <option value="">Select</option>
              <option value="AFRICA">AFRICA</option>
              <option value="ANTARCTICA">ANTARCTICA</option>
              <option value="ASIA">ASIA</option>
              <option value="EUROPE">EUROPE</option>
              <option value="NORTHAMERICA">N. AMERICA</option>
              <option value="OCEANIA">OCEANIA</option>
              <option value="SOUTHAMERICA">S. AMERICA</option>
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">COUNTRY</label>
            <input className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="country" value={form.country} onChange={handleChange} placeholder="Country" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-sm lg:text-2xl font-semibold">CITY</label>
            <input className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="city" value={form.city} onChange={handleChange} placeholder="City" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">STREET</label>
            <input className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="street" required value={form.street} onChange={handleChange} placeholder="Street" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">RISK</label>
            <select className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm" name="risk" value={form.risk} onChange={handleChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">TYPES</label>
            <Select
              isMulti
              options={options}
              value={options.filter((o) => form.types.includes(o.value))}
              onChange={(selected) => setForm((prev) => ({
                ...prev,
                types: selected ? selected.map((s) => s.value) : [],
              }))}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center">
                <label className="text-xs md:text-sm font-semibold">IMAGES</label>
                <button type="button" onClick={() => imageInputRef.current.click()} className="text-xs border px-2 py-0.5">+ Add</button>
              </div>
              <input ref={imageInputRef} className="hidden" type="file" accept="image/*" multiple onChange={handleAddImages} />
              <div className="flex flex-wrap gap-1 mt-1">
                {images.map((file, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs md:text-sm font-semibold">VIDEOS</label>
                  <button type="button" onClick={() => videoInputRef.current.click()} className="text-xs border px-2 py-0.5">+ Add</button>
                </div>
                <input ref={videoInputRef} className="hidden" type="file" accept="video/*" multiple onChange={handleAddVideos} />
                <div className="flex flex-wrap gap-1 mt-1">
                  {videos.map((file, i) => (
                    <div key={i} className="relative w-16 h-16">
                      <video src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded"></video>
                      <button type="button" onClick={() => removeVideo(i)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">DESCRIPTION</label>
            <p className="text-xs self-end">{form.description.length}/500</p>
          </div>
          <textarea required className="bg-white py-0.5 md:py-1 lg:py-2 text-xs md:text-sm w-full" rows={2} name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        </div>

        {error && <p className="text-red-800 text-xs py-0.5">{error}</p>}
        {message && <p className="text-green-800 text-xs py-0.5">{message}</p>}

        <aside className="flex justify-end">
          <button disabled={loading} type="submit" className="bg-black/30 hover:bg-black/40 text-xs md:text-sm lg:text-2xl xl:text-2xl font-semibold w-1/3 py-1 md:py-1.5 lg:py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            SUBMIT
          </button>
        </aside>
      </form>
    </div>
  </div>
)
}