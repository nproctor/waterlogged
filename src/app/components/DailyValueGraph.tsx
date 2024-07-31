import { ReferenceArea, Legend} from 'recharts';
import { WaterData, WaterStatistic } from '@/app/types/types';
import { PropsWithChildren, useEffect } from 'react';
import DateTimeGraph from '@/app/components/DateTimeGraph';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = 60 * 24;

interface Props extends PropsWithChildren{
    todaysValues : WaterData,
    todaysStats : WaterStatistic
}
  

const DailyValueGraph = ({todaysValues, todaysStats}: Props) => {


    const interpolate = (stats: WaterStatistic) => {
        // Linear interpolation
        if (!isNaN(stats.max) && !isNaN(stats.p75) && isNaN(stats.p95))
            stats.p95 = (stats.max - stats.p75) / (25) * 20 + stats.p75;
        if (!isNaN(stats.p25) && !isNaN(stats.min) && isNaN(stats.p05))
            stats.p05 = (stats.p25 - stats.min) / (25) * 5 + stats.min;
    }
    interpolate(todaysStats);


    const timeMap = (x : Date) : number => {
        return x.getHours() * 60 + x.getMinutes();
    }

    const xAxisFormatter = (timeInMinutes : number, index: number) => {
        const hours = (timeInMinutes / 60).toFixed(0).padStart(2, '0');
        const minutes = (timeInMinutes % 60).toFixed(0).padStart(2, '0');
        return `${hours}:${minutes}`;
      }


    return (
        <DateTimeGraph title={"Todays Values"}
                       data={todaysValues} 
                       xAxisFormatter={xAxisFormatter}
                       keyMap={timeMap} 
                       xDomain={[0, MINUTES_IN_DAY]}
                       xLabel={"Time"} 
                       xTicks={Array.from({length:HOURS_IN_DAY}, (_,i) => i * MINUTES_IN_HOUR)}>
            <Legend payload={[{value: "Very High > 95%", type:"circle", color:"var(--color-water-max)"}, 
                                  {value:"High 75% - 95%", type:"circle", color:"var(--color-water-high)"},
                                  {value:"Normal 25% - 75%", type:"circle", color:"var(--color-water-normal)"},
                                  {value:"Low 5% - 25%", type:"circle", color:"var(--color-water-low)"},
                                  {value:"Very Low < 5%", type:"circle", color:"var(--color-water-min)"}]} 
                                  verticalAlign="top"
                                  wrapperStyle={{padding: 10}}
                                  />

            <ReferenceArea y1={todaysStats.min} y2={todaysStats.p05} fill="var(--color-water-min)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats.p95} y2={todaysStats.max} fill="var(--color-water-max)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats.p05} y2={todaysStats.p25} fill="var(--color-water-low)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats.p75} y2={todaysStats.p95} fill="var(--color-water-high)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats.p25} y2={todaysStats.p75} fill="var(--color-water-normal)" ifOverflow="hidden"/>  

        </DateTimeGraph>)
}

export default DailyValueGraph;
