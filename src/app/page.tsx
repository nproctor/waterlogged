"use client";

import dynamic  from 'next/dynamic';
import {Toaster} from 'react-hot-toast';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import '@/app/style/page.css';
import '@/app/style/map.css';

const LazyMap = dynamic(() => import('@/app/components/Map'), {
  ssr: false
});

export default function Home() {


  return (
    <div className="main">
        <Toaster/>
        <LazyMap/>
    </div>
  );
}
