import { ReferenceArea, Legend, Area} from 'recharts';
import { WaterData, WaterStatistic } from '@/app/types/types';
import { PropsWithChildren, useEffect } from 'react';
import DateTimeGraph from '@/app/components/DateTimeGraph';


interface Props extends PropsWithChildren{
    allTimeStats: WaterStatistic[]
}  

const AnnualValueGraph = ({allTimeStats}: Props) => {

    const daysElapsedByMonth : { [key: number]: number } = {
        1: 0, 2: 31, 3: 60, 4: 91, 5: 121, 6: 152, 7: 182, 8: 213, 9: 244, 10: 274, 11: 305, 12: 335
    }

    const xAxisFormatter = (daysElapsed : number, index: number) => {
        let month = 1;
        let day = 0;
        Object.keys(daysElapsedByMonth).forEach( (v) => {
            let pairMonth = parseInt(v);
            let pairDays = daysElapsedByMonth[pairMonth]; 
            if (pairDays < daysElapsed && pairDays > day){
                day = pairDays;
                month = pairMonth;
            }
        });
        return `${month}/${daysElapsed - day}`;
    }

    
    return (
        <DateTimeGraph title={"Annual Values"}
                       data = {allTimeStats} 
                       xAxisFormatter={xAxisFormatter}
                       xKeyMap={(v : WaterStatistic) => {return (v.day) + daysElapsedByMonth[v.month]}}
                       xLabel={"Day"}
                       xDomain={[1,366]}
                       xTicks={Array.from(Object.keys(daysElapsedByMonth), (v) => daysElapsedByMonth[parseInt(v)] + 1)}
                       yLabel={"Streamflow, ft^3/s"}>
            <Area type="monotone" dataKey={(v : WaterStatistic) => {return v.values[5].value}} fillOpacity={1} fill="#8884d8" stroke="#8884d8" />
    </DateTimeGraph>)
}

export default AnnualValueGraph;
