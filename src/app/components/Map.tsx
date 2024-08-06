"use client";

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, ScaleControl, Popup } from "react-leaflet"
import { LatLngBounds } from "leaflet";
import toast from 'react-hot-toast';
import "leaflet-defaulticon-compatibility";


import CurrentLocationButton from "@/app/components/CurrentLocationButton";
import SearchAreaButton from "@/app/components/SearchAreaButton";
import MapStat from '@/app/components/MapStat';
import useSearchArea from "@/app/hooks/useSearchArea";


const Map = () => { 
    const {gaugeData, getGaugeData} = useSearchArea();

    return (
        <MapContainer center={[40.0, -100.0]} zoom={4} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <ScaleControl position="bottomleft"/>
          <CurrentLocationButton/>
          <SearchAreaButton getGaugeData ={getGaugeData}/>
          {gaugeData.map( (data) => <Marker 
                                      key={data.id}
                                      position={[data.geoLocation.latitude,
                                                 data.geoLocation.longitude]}>
                                      <Popup>
                                        <MapStat data={data}/>
                                      </Popup>
                                    </Marker>)}
        </MapContainer>
    )
}

export default Map;