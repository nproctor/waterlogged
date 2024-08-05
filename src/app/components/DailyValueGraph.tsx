import { ReferenceArea, Legend, Line} from 'recharts';
import { WaterData, WaterDataVariableValue, WaterStatisticValue } from '@/app/types/types';
import { PropsWithChildren, useEffect } from 'react';
import DateTimeGraph from '@/app/components/DateTimeGraph';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = 60 * 24;

interface Props extends PropsWithChildren{
    todaysValues : WaterData,
    todaysStats : WaterStatisticValue[]
}
  

const DailyValueGraph = ({todaysValues, todaysStats}: Props) => {


    const timeMap = (v : WaterDataVariableValue) : number => {
        return v.dateTime.getHours() * 60 + v.dateTime.getMinutes();
    }

    const xAxisFormatter = (timeInMinutes : number, index: number) => {
        const hours = (timeInMinutes / 60).toFixed(0).padStart(2, '0');
        const minutes = (timeInMinutes % 60).toFixed(0).padStart(2, '0');
        return `${hours}:${minutes}`;
    }


    return (
        <DateTimeGraph title={"Todays Values"}
                       data={todaysValues.variable.values} 
                       xAxisFormatter={xAxisFormatter}
                       xKeyMap={timeMap}
                       xDomain={[0, MINUTES_IN_DAY]}
                       xLabel={"Time"}
                       yLabel={todaysValues.variable.variableName} 
                       xTicks={Array.from({length:HOURS_IN_DAY}, (_,i) => i * MINUTES_IN_HOUR)}>
            <Legend payload={[{value: "Very High > 90%", type:"circle", color:"var(--color-water-max)"}, 
                                  {value:"High 75% - 90%", type:"circle", color:"var(--color-water-high)"},
                                  {value:"Normal 25% - 75%", type:"circle", color:"var(--color-water-normal)"},
                                  {value:"Low 10% - 25%", type:"circle", color:"var(--color-water-low)"},
                                  {value:"Very Low < 10%", type:"circle", color:"var(--color-water-min)"}]} 
                                  verticalAlign="top"
                                  wrapperStyle={{padding: 10}}
                                  />
            <Line type="monotone" dataKey={(v: WaterDataVariableValue) => v.value} stroke="black" />

            <ReferenceArea y1={todaysStats[0].value} y2={todaysStats[10].value} fill="var(--color-water-min)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats[10].value} y2={todaysStats[25].value} fill="var(--color-water-low)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats[25].value} y2={todaysStats[75].value} fill="var(--color-water-normal)" ifOverflow="hidden"/>
            <ReferenceArea y1={todaysStats[75].value} y2={todaysStats[90].value} fill="var(--color-water-high)" ifOverflow="hidden"/>  
            <ReferenceArea y1={todaysStats[90].value} y2={todaysStats[100].value} fill="var(--color-water-max)" ifOverflow="hidden"/>

        </DateTimeGraph>)
}

export default DailyValueGraph;
