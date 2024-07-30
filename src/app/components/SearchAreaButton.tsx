"use client";

import {useMap} from 'react-leaflet';
import LeafletControl from "@/app/components/LeafletControl";
import { LatLngBounds } from 'leaflet';
import toast from 'react-hot-toast';

interface Props {
    getGaugeData: (bounds: LatLngBounds) => void;
}

const SearchAreaButton = ({getGaugeData}: Props) => {
    const map = useMap();

    const onClick = () => {
        const bounds = map.getBounds();
        getGaugeData(bounds);
    }

    return (
    <LeafletControl className={"leaflet-search-area-button"} position={"topright"} onClick={onClick}>
        <span>Search This Area</span>
    </LeafletControl>
  );
}

export default SearchAreaButton;