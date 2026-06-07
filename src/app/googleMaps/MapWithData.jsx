"use client";

import {
  GoogleMap,
  Autocomplete,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";
import {  useRef, useState } from "react";
import useSpotForm from "../spot/components/SpotFormStore";
import { X } from "lucide-react";

export default function MapWithData({lat, lng}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const setPosition = useSpotForm((data) => data.setPosition);
  const setLatLng = useSpotForm((data) => data.setLatLng);

  function getAddressFromCoords(lat, lng) {
    const geocoder = new google.maps.Geocoder();

    function getComponent(components, type, field = "long_name") {
      const found = components.find((c) => c.types.includes(type));
      return found ? found[field] : null;
    }

    geocoder.geocode(
      {
        location: { lat, lng },
        language: "en", 
      },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          const place = results[0];
          const components = place.address_components;

          setPosition({
            street:
              getComponent(components, "route") ||
              place.formatted_address?.split(",")[0],

            city:
              getComponent(components, "locality") ??
              getComponent(
                components,
                "administrative_area_level_2"
              ),

            country: getComponent(
              components,
              "country",
              "long_name"
            ),
          });
        }
      }
    );
  }


  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <section className="flex">
        <Autocomplete
          className="w-full"
          onLoad={(auto) => (autocompleteRef.current = auto)}
          fields={["address_components", "geometry", "name"]}
          onPlaceChanged={() => {
            if (!autocompleteRef.current) return;

            const place = autocompleteRef.current.getPlace();
            if (!place.address_components) return;

            function getComponent(components, type, field = "long_name") {
              const found = components.find((c) =>
                c.types.includes(type)
              );
              return found ? found[field] : null;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setCoordinates({ lat, lng });
            setLatLng({ lat, lng });

            setPosition({
              street:
                getComponent(place.address_components, "route") ||
                place.formatted_address?.split(",")[0],

              city:
                getComponent(place.address_components, "locality") ??
                getComponent(
                  place.address_components,
                  "administrative_area_level_2"
                ),

              country: getComponent(
                place.address_components,
                "country",
                "long_name"
              ),
            });
          }}
        >
          <input
            ref={inputRef}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            placeholder="Search a place..."
            className="p-2 w-full bg-primary relative"
          />
        </Autocomplete>

        <button
          type="button"
          className="w-[30px] bg-primary-500 flex justify-center items-center"
          onClick={() => (inputRef.current.value = "")}
        >
          <X size={15} />
        </button>
      </section>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: lat ? lat : 42.4, lng: lng ? lng : 43.2 }}
        zoom={2}
        options={{ minZoom: 2 }}
        onClick={(e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          setLatLng({ lat, lng });
          setCoordinates({ lat, lng });
          getAddressFromCoords(lat, lng);
        }}
      >
          <Marker position={{ 
        lat: coordinates.lat || parseFloat(lat) || 45, 
        lng: coordinates.lng || parseFloat(lng) || 10 
    }} />
      </GoogleMap>
    </div>
  );
}