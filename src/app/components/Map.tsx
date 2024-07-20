"use client";

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, ScaleControl, Popup } from "react-leaflet"
import { LatLngBounds } from "leaflet";
import toast from 'react-hot-toast';
import "leaflet-defaulticon-compatibility";


import CurrentLocationButton from "@/app/components/CurrentLocationButton";
import SearchAreaButton from "@/app/components/SearchAreaButton";
import { getWaterServicesInstantaneousValues } from "@/app/api/actions";
import { WaterData } from "@/app/types/types";
import Stat from '@/app/components/Stat';


const Map = () => { 

  const [gaugeData, setGaugeData] = useState<WaterData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getGaugeData = (bounds: LatLngBounds) => {
    if (isLoading)
      return;
    setIsLoading(true);
    const bBox = [bounds.getWest().toFixed(7), 
                  bounds.getSouth().toFixed(7), 
                  bounds.getEast().toFixed(7), 
                  bounds.getNorth().toFixed(7)];
    
    const promise = new Promise<void>((resolve, reject) => {
      getWaterServicesInstantaneousValues(bBox)
      .then((res) => {
        setGaugeData(res);
        resolve();
      })
      .catch(() => reject())
      .finally(() => setIsLoading(false))
    });

    toast.promise(promise, {
      loading: "Loading...",
      success: "Done!",
      error: "Error: Unable to load data",
    });
  }


    return (
        <MapContainer center={[40.0, -100.0]} zoom={4} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <ScaleControl position="bottomleft"/>
          <CurrentLocationButton/>
          <SearchAreaButton onSearch ={getGaugeData}/>
          {gaugeData.map( (data) => <Marker 
                                      key={data.id}
                                      position={[data.geoLocation.latitude,
                                                 data.geoLocation.longitude]}>
                                      <Popup>
                                        <Stat data={data}/>
                                      </Popup>
                                    </Marker>)}
        </MapContainer>
    )
}

export default Map;