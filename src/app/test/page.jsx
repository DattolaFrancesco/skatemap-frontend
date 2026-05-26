"use client";

import { GoogleMap, Autocomplete, useLoadScript, Marker } from "@react-google-maps/api";
import { useRef, useState } from "react";

export default function MapWithSearch() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
    const [coordinates, setCoordinates] = useState({lat:45.4642,lng:9.19})
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  function getAddressFromCoords(lat, lng) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode(
    { location: { lat, lng } },
    (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0];
        console.log(place)
                  console.log(place.address_components[1].short_name)
          console.log(place.address_components[2].short_name)
          console.log(place.address_components[5].short_name)
          console.log(place.address_components[6].long_name)
   
      }
    }
  );
}

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
      {/* INPUT */}
      <Autocomplete
        onLoad={(auto) => (autocompleteRef.current = auto)}
        onPlaceChanged={() => {
          const place = autocompleteRef.current.getPlace();
                     console.log(place.address_components[0].short_name)
          console.log(place.address_components[1].short_name)
          console.log(place.address_components[4].short_name)
          console.log(place.address_components[5].long_name)
          setCoordinates({lat:place.geometry.location.lat(),lng:place.geometry.location.lng()})
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search place..."
          className="border p-2 w-64"
        />
      </Autocomplete>

      {/* MAP */}
     <GoogleMap 
     mapContainerStyle={{ width: "500px", height: "500px" }} 
     center={coordinates} 
     zoom={5} 
     onClick={(e)=>{
        setCoordinates({lat:e.latLng.lat(),lng:e.latLng.lng()})
        getAddressFromCoords(e.latLng.lat(),e.latLng.lng())
    }} 
     > 
     <Marker position={coordinates}/> 
     </GoogleMap>
      
    </div>
  );
}