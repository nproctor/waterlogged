"use client";

import {useEffect, PropsWithChildren, useRef, MouseEvent } from "react";
import { Control, DomUtil, ControlPosition, DomEvent} from 'leaflet';
import { useMap } from "react-leaflet";



interface Props {
    position: ControlPosition,
    className?: string,
    onClick: () => void,
}

const CustomControl = (props : PropsWithChildren<Props>) => {
    const map = useMap();
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect( () => {
        const controlInstance = new Control({position: props.position});
        if (buttonRef.current){
            const button = buttonRef.current;
            controlInstance.onAdd = () => {
                DomEvent.disableClickPropagation(button);
                DomEvent.disableScrollPropagation(button);
                return button;
            }
        }
        controlInstance.addTo(map);
        return () => {controlInstance.remove()}; 
    }, [map])

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        props.onClick();
    }

    return (
        <button className={`leaflet-control leaflet-bar ${props.className}`} onClick={handleClick} ref={buttonRef}>
            <a>
               {props.children} 
            </a>
        </button>
    )
}

export default CustomControl;