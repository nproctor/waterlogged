"use client";

import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import LeafletControl from "@/app/components/LeafletControl";
import { FaLocationDot } from "react-icons/fa6";

const CurrentLocationButton = () => {

    const [isLoading, setIsLoading] = useState(false);

    const map = useMapEvents({
        locationfound: (loc) => {
            map.flyTo(loc.latlng, 10, { duration: 2});
            setIsLoading(false);
        }
    });

    const onClick = () => {
        if (!isLoading){
            setIsLoading(true);
            map.locate();
        }
    }

    return (
    <LeafletControl className={"leaflet-current-position-control"} position={"topleft"} onClick={onClick}>
        <FaLocationDot style={{height: "20px", width:"20px"}}/>
    </LeafletControl>
  );
}

export default CurrentLocationButton;