"use client";
import { ClipLoader } from 'react-spinners';
import useFetchData from '@/app/hooks/useFetchData';
import Graph from '@/app/components/Graph';
import SiteDetailHeader from '@/app/components/SiteDetailHeader';
import { ReferenceArea, Label } from 'recharts';

import '@/app/style/details.css'

interface Props {
  params : {
    id : number
  }
}

export default function Page( {params: {id}} : Props) {
  const {dailyValues, todaysValues, allTimeStats, todaysStats } = useFetchData(id);
  const todaysDate = new Date();

    return (
        <div className="details">
          {
           dailyValues &&
           todaysValues &&
           allTimeStats &&
           todaysStats ? 
                  <div className="details-content"> 
                    {/* Site Information */}
                    <SiteDetailHeader data={todaysValues}/>

                    {/* Todays values */}
                    <div className="details-current-data">
                      <Graph title={"Today's Values"} data={todaysValues}>
                        <ReferenceArea x1={0} x2={24*60} y1={todaysStats.min} y2={todaysStats.p05} fill="var(--color-water-min)" ifOverflow="hidden"/>
                        <ReferenceArea x1={0} x2={24*60} y1={todaysStats.p95} y2={todaysStats.max} fill="var(--color-water-max)" ifOverflow="hidden"/>
                        <ReferenceArea x1={0} x2={24*60} y1={todaysStats.p05} y2={todaysStats.p25} fill="var(--color-water-low)" ifOverflow="hidden"/>
                        <ReferenceArea x1={0} x2={24*60} y1={todaysStats.p75} y2={todaysStats.p95} fill="var(--color-water-high)" ifOverflow="hidden"/>
                        <ReferenceArea x1={0} x2={24*60} y1={todaysStats.p25} y2={todaysStats.p75} fill="var(--color-water-normal)" ifOverflow="hidden"/>  
                      </Graph>
                    </div>
                    
                  </div> : 
                  <div className="details-loading">
                    <ClipLoader size={100} color="black"></ClipLoader>
                  </div>
                  }
        </div>
    );
  }
  