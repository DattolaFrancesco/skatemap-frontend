'use client'
import { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import usePinRegistration from "@/app/spot/components/PinRegistration";
import useSpotForm from "@/app/spot/components/SpotFormStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation"


const options = [
  { value: 'RAIL', label: 'Rail' },
  { value: 'LEDGE', label: 'Ledge' },
  { value: 'STREET', label: 'Street' },
  { value: 'SKATEPARK', label: 'Skatepark' },
  { value: 'STAIR', label: 'Stair' },
]

export default function ModifySpotForm() {
  const router = useRouter()
  const pathname = usePathname()
  const sections = pathname.split("/")
  const section = sections[3]
  const pin = usePinRegistration((state) => state.pin);
  const setSpot = useSpotForm((data) => data.setSpot);
  const [existsImages,setExistsImages] = useState(null)
  const [existsVideos,setExistsVideos] = useState(null)
  const [eliminatedExistsImages,setEliminatedExistsImages] = useState({id:[]})
  const [eliminatedExistsVideos,setEliminatedExistsVideos] = useState({id:[]})
  let imageRestrictionNumber = 5 -  (existsImages?.length - eliminatedExistsImages?.id?.length);
  let videoRestrictionNumber = 3 -  (existsVideos?.length - eliminatedExistsVideos?.id?.length);
  const [images,setImages] = useState(null)
  const [videos,setVideos] = useState(null)
  const [error, setError] = useState(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [firstLoad,setFirstLoad] = useState(true)
  const [form, setForm] = useState({
    name: '', latitude: '', longitude: '',
    description: '', risk: 'LOW', types: [],
    city: '', country: '', continent: '', street: '',
  });
  useEffect(() => {
    if(firstLoad) return
    if (!pin) return
    setForm((prev) => ({ ...prev, latitude: pin.lat, longitude: pin.lng }));
    handleCoordinates(pin.lat, pin.lng)
  }, [pin])
  useEffect(() => {
    setSpot(form)
  }, [form])
  useEffect(() => {
    console.log(videoRestrictionNumber)
  }, [videoRestrictionNumber])
  useEffect(() => {
    getSpot()
  }, [])
  async function getSpot() {
  const token = localStorage.getItem('token')
    try{const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${section}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error("unable to get spot");
    console.log(data)
    setFirstLoad(false)
    setForm({
    name: data.name, latitude: data.latitude, longitude: data.longitude,
    description: data.description, risk: data.risk, types: data.spotTypes.map((t)=>t),
    city: data.city, country: data.country, continent: data.continents, street: data.street,
    })
    setExistsImages(data.image)
    setExistsVideos(data.video)
  }catch(err){console.log(err.message)}
  }
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
  async function deleteExistingImage(){
    const token = localStorage.getItem('token')
    await Promise.all(
          eliminatedExistsImages.id.map(async(i)=>{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/${i}`,{
              method: "DELETE",
              headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
              },
            })
            if (!res.ok) throw new Error("delete existing images failed");
          })
      )
    }
  async function deleteExistingVideo(){
    const token = localStorage.getItem('token')
    await Promise.all(
          eliminatedExistsVideos.id.map(async(i)=>{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/${i}`,{
              method: "DELETE",
              headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
              },
            })
            if (!res.ok) throw new Error("delete existing videos failed");
          })
      )
    }
  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.latitude || !form.longitude) {
        setError("Click on the map to set the location")
        return
    }
    setLoading(true)
    try{
      await deleteExistingImage()
      await deleteExistingVideo()
      await handleImagesSubmit(section)
      await handleVideosSubmit(section)
      await handleForm(section)
      setLoading(false)
      router.push('/dashboard')
      }catch(err) {
      setError(err.message, "last error")
      setLoading(false)
      return
      }
  }
  async function handleForm(spotId){
     const token = localStorage.getItem('token')
    const res = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
  }
  async function handleVideosSubmit(spotId){
    if (!videos || videos.length === 0) return
    const formData = new FormData()
    Array.from(videos).forEach(e => {
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
    if (!images || images.length === 0) return
    const formData = new FormData()
    Array.from(images).forEach(e => {
      formData.append("file",e)
    });
     const token = localStorage.getItem('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/image/${spotId}`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    })
    if (!res.ok) throw new Error("Image upload failed");
  }
  return (
  <div className={`flex flex-col w-full h-full justify-center items-center ${loading ? "animate-pulse" : ""}`}>
    <div className="w-full mb-0.5 md:mb-1">
      <Link href={"/dashboard"} className={`nav-link block text-center py-0.5 text-xs md:text-sm ${loading ? "invisible" : ""}`}>BACK</Link>
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
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">IMAGES</label>
            <input ref={imageInputRef} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs" type="file" accept="image/*" multiple 
              onChange={(e) => {
                const files = Array.from(e.target.files)
                const onlyImages = files.filter(f => f.type.startsWith('image/'))
                if (onlyImages.length !== files.length) { setError("Only images accepted"); e.target.value = ''; return }
                if (onlyImages.length > imageRestrictionNumber) { setError("Max 5 Images"); e.target.value = ''; return }
                setImages(e.target.files)
              }}
            />
          <div className="flex gap-1 flex-wrap">
              {existsImages &&  existsImages.map((img) => (
              <div key={img.id} className={`relative ${eliminatedExistsImages.id.includes(img.id)?"hidden":""}`}>
              <img src={img.link} className="w-16 h-16 object-cover" />
              <button onClick={(e) => {
                e.preventDefault()
                setEliminatedExistsImages((prev)=>({id:[...prev.id,img.id]}))}
                } className={"absolute top-1 right-1"}>
              <RxCross2 size={14}/>
              </button>
          </div>
            ))}
          </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs md:text-sm lg:text-2xl font-semibold">VIDEOS</label>
            <input ref={videoInputRef} className="bg-white py-0.5 md:py-1 lg:py-2 text-xs" type="file" accept="video/*" multiple
              onChange={(e) => {
                const files = Array.from(e.target.files)
                const onlyVideos = files.filter(f => f.type.startsWith('video/'))
                if (onlyVideos.length !== files.length) { setError("Only videos accepted"); e.target.value = ''; return }
                if (onlyVideos.length > videoRestrictionNumber) { setError("Max 3 videos"); e.target.value = ''; return }
                setVideos(e.target.files)
              }}
            />
          <div className="flex gap-1 flex-wrap">
              {existsVideos &&  existsVideos.map((img) => (
              <div key={img.id} className={`relative ${eliminatedExistsVideos.id.includes(img.id)?"hidden":""}`}>
              <img src={img.thumbnailUrl} className="w-16 h-16 object-cover"/>
              <button onClick={(e) => {
                e.preventDefault()
                setEliminatedExistsVideos((prev)=>({id:[...prev.id,img.id]}))}
                } className={"absolute top-1 right-1"}>
              <RxCross2 size={14}/>
              </button>
          </div>
            ))}
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