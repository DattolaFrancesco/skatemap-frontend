"use client";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function Map({lat,lng}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
 

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex justify-center w-full h-full ">
     <GoogleMap 
     mapContainerStyle={{ width:"100%", height:"100%"}} 
     center={{ lat, lng }} 
     zoom={8}> 
     <Marker position={{ lat, lng }}/> 
     </GoogleMap>
      
    </div>
  );
}