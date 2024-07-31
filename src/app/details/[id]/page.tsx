"use client";
import { ClipLoader } from 'react-spinners';
import useFetchData from '@/app/hooks/useFetchData';
import DailyValueGraph from '@/app/components/DailyValueGraph';
import SiteDetailHeader from '@/app/components/SiteDetailHeader';
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
                    <DailyValueGraph todaysValues={todaysValues} todaysStats={todaysStats}/>
                    
                  </div> : 
                  <div className="details-loading">
                    <ClipLoader size={100} color="black"></ClipLoader>
                  </div>
                  }
        </div>
    );
  }
  