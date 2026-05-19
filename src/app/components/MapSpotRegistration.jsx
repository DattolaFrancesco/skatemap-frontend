import { useEffect, useState } from 'react';
import usePinRegistration from '../store/PinRegistration';


// imports for leaflet from the documentation
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
// finish leaflet imports

export default function MapSpotRegistration(){
    const [urlMap, setUrlMap] = useState("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png")
    const [position, setPosition] = useState(null);
   const setPin = usePinRegistration((state) => state.setPin);
    function ClickHandler(){
        useMapEvents({
            click(e){
                const { lat, lng } = e.latlng;
                setPin({ lat, lng })
                setPosition(e.latlng)
                console.log(e.latlng)
            }
        })
        return null
    }
    return(
        <MapContainer
                    center={[45.4642, 9.1900]}
                    zoom={3}
                    minZoom={1}
                    style={{ height: '200px', width: '200px' }}
                    className='relative'
                >
                <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url={urlMap}
                />
                <ClickHandler/>
               <div className='absolute z-[999] right-0 flex flex-col gap-0.5'>
                    <button className='bg-black/20 cursor-pointer' onClick={(e)=>{
                        setUrlMap("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png")
                        e.stopPropagation()
                    }}>dark</button>
                    <button className='bg-black/20 cursor-pointer' onClick={()=>{
                        setUrlMap("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png")}
                    }>light</button>
                    <button className='bg-black/20 cursor-pointer' onClick={()=>{
                        setUrlMap("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")}
                    }>normal</button>
               </div>
                {position && (<Marker position={position} />)}
                </MapContainer>

    )
}