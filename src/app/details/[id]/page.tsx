"use client";
import { ClipLoader } from 'react-spinners';
import useFetchData from '@/app/hooks/useFetchData';
import DailyValueGraph from '@/app/components/DailyValueGraph';
import SiteOverview from '@/app/components/SiteOverview';
import '@/app/style/details.css'
import AnnualValueGraph from '@/app/components/AnnualValueGraph';
import PercentileGraph from '@/app/components/PercentileGraph';

interface Props {
  params : {
    id : number
  }
}

export default function Page( {params: {id}} : Props) {
    const {dailyValues, todaysValues, allTimeStats, todaysStats } = useFetchData(id);

    return (
        <div className="details">
          {
           dailyValues &&
           todaysValues &&
           allTimeStats &&
           todaysStats ? 
                  <div> 
                    {/* Site Information */}
                    <SiteOverview todaysValues={todaysValues} todaysStats={todaysStats}/>
                    <br></br>
                    {/* Todays Graph */}
                    <DailyValueGraph todaysValues={todaysValues} todaysStats={todaysStats}/>

                    {/* Percentile Graph */}
                    <PercentileGraph todaysStats={todaysStats} />
                    {/* Weekly Trend */}

                    {/* Yearly Trend */}
                    <AnnualValueGraph allTimeStats={allTimeStats}/>
                    
                  </div> : 
                  <div className="details-loading">
                    <ClipLoader size={100} color="black"></ClipLoader>
                  </div>
                  }
        </div>
    );
  }
  