"use client";

import {useMap} from 'react-leaflet';
import LeafletControl from "@/app/components/LeafletControl";
import { LatLngBounds } from 'leaflet';
import toast from 'react-hot-toast';

interface Props {
    onSearch: (bounds: LatLngBounds) => void;
}

function getArea(bounds: LatLngBounds){
    const height = bounds.getNorth() - bounds.getSouth();
    const width = bounds.getEast() - bounds.getWest();
    return (height * width);
}

const SearchAreaButton = (props: Props) => {
    const map = useMap();

    const onClick = () => {
        const bounds = map.getBounds();
        if (getArea(bounds) > 25){
            toast.error("Zoom in to search this area!");
            return;
        }
        props.onSearch(bounds);
    }

    return (
    <LeafletControl className={"leaflet-search-area-button"} position={"topright"} onClick={onClick}>
        <span>Search This Area</span>
    </LeafletControl>
  );
}

export default SearchAreaButton;