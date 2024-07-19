"use client";

import {useMap} from 'react-leaflet';
import LeafletControl from "@/app/components/LeafletControl";
import { LatLngBounds } from 'leaflet';
import toast from 'react-hot-toast';

interface Props {
    onSearch: (bounds: LatLngBounds) => void;
}

const SearchAreaButton = (props: Props) => {
    const map = useMap();

    const onClick = () => {
        if (map.getZoom() < 9){
            toast.error("Zoom in to search this area!");
            return;
        }
        const bounds = map.getBounds();
        props.onSearch(bounds);
    }

    return (
    <LeafletControl className={"leaflet-search-area-button"} position={"topright"} onClick={onClick}>
        <span>Search This Area</span>
    </LeafletControl>
  );
}

export default SearchAreaButton;