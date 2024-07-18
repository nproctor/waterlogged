"use client";

import { MapContainer, TileLayer, ScaleControl } from "react-leaflet"

import CurrentLocationButton from "@/app/components/CurrentLocationButton";

const Map = () => { 
    return (
        <MapContainer center={[40.0, -100.0]} zoom={4} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <ScaleControl position="bottomleft"/>
          <CurrentLocationButton/>
        </MapContainer>
    )
}

export default Map;