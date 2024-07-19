"use client";

import L from "leaflet";
import {useRef, PropsWithChildren } from "react";
import { ControlPosition } from 'leaflet';
import { createControlComponent } from '@react-leaflet/core'
import { renderToStaticMarkup } from "react-dom/server";



interface Props {
    position: ControlPosition,
    className?: string,
    onClick: () => void,
}

const createControlLayer = (props : PropsWithChildren<Props>) => {
    const controlInstance = new L.Control({position: props.position});
    controlInstance.onAdd = () => {
        const button = L.DomUtil.create("div", `leaflet-control leaflet-bar ${props.className}`);
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.disableScrollPropagation(button);
        button.innerHTML = renderToStaticMarkup(
            <a>{props.children}</a>
        );
        button.onclick = props.onClick;
        return button;
    }  
    return controlInstance;
};

const CustomControl = createControlComponent(createControlLayer);

export default CustomControl;