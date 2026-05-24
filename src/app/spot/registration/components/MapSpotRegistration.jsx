'use client'
import { useState, useCallback, memo } from 'react';
import usePinRegistration from '@/app/spot/registration/components/PinRegistration';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MAP_URLS = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  normal: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
}

function ClickHandler({ onPin }) {
  useMapEvents({
    click(e) {
      onPin(e.latlng)
    }
  })
  return null
}

function MapSpotRegistration() {
  const [urlMap, setUrlMap] = useState(MAP_URLS.normal)
  const [position, setPosition] = useState(null);
  const setPin = usePinRegistration((state) => state.setPin);

  const handlePin = useCallback((latlng) => {
    setPin({ lat: latlng.lat, lng: latlng.lng })
    setPosition(latlng)
  }, [setPin])

  const handleDark = useCallback((e) => {
    e.stopPropagation()
    setUrlMap(MAP_URLS.dark)
  }, [])
  const handleNormal = useCallback(() => setUrlMap(MAP_URLS.normal), [])

  return (
    <MapContainer
      center={[45.4642, 9.1900]}
      zoom={3}
      minZoom={1}
      style={{ height: '100%', width: '100%' }}
      className='relative'
    >
      <TileLayer attribution='&copy; OpenStreetMap contributors' url={urlMap} />
      <ClickHandler onPin={handlePin} />
      <div className='absolute z-[999] right-[1.5%] top-[4.5%] flex flex-col gap-0.5'>
        <button className={`bg-black/20 cursor-pointer ${urlMap === MAP_URLS.dark? "bg-white text-black":""}`} onClick={handleDark}>DARK</button>
        <button className={`bg-black/20 cursor-pointer ${urlMap === MAP_URLS.dark? "bg-white text-black":""}`} onClick={handleNormal}>LIGHT</button>
      </div>
      {position && <Marker position={position} />}
    </MapContainer>
  )
}

export default memo(MapSpotRegistration)