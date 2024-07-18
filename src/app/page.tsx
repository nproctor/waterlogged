import dynamic  from 'next/dynamic';

import '@/app/style/page.css';
import '@/app/style/map.css';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const LazyMap = dynamic(() => import('@/app/components/Map'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="main">
        <LazyMap/>
    </div>
  );
}
