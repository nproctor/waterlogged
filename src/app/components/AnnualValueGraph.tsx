import { ReferenceArea, Legend, Area, Line, ReferenceLine, ReferenceDot, Cell, Scatter, LineChart, ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Label} from 'recharts';
import { WaterData, WaterDataVariableValue, WaterStatistic } from '@/app/types/types';
import { PropsWithChildren, useEffect, useState } from 'react';
import Graph from '@/app/components/Graph';


interface Props extends PropsWithChildren{
    allTimeStats: WaterStatistic[],
    dailyValuesYear: WaterData,
    todaysValues: WaterData,
}

interface ComboType {
    day: number,
    alltime: number | undefined,
    lastyear: number | undefined,
}

const AnnualValueGraph = ({allTimeStats, dailyValuesYear, todaysValues}: Props) => {
    
    const [comboData, setComboData] = useState<ComboType[]>([]);

    const daysElapsedByMonth : { [key: number]: number } = {
        1: 0, 2: 31, 3: 60, 4: 91, 5: 121, 6: 152, 7: 182, 8: 213, 9: 244, 10: 274, 11: 305, 12: 335
    }
    
    const processData = (allTimeStats: WaterStatistic[], dailyValuesYear: WaterData) => {
        const data : ComboType[] = [];
        for (let i = 0; i < 365; i ++){
            let x = allTimeStats.find((v) => v.day + daysElapsedByMonth[v.month] === i);
            let y = dailyValuesYear.variable.values.find((v) => v.dateTime.getDate() + daysElapsedByMonth[v.dateTime.getMonth() + 1] === i)
            data.push({day: i, alltime: x?.values[5].value, lastyear: y?.value})
        }
        setComboData(data);
    }

    useEffect( () => {
        processData(allTimeStats, dailyValuesYear);
    }, []);

    // const xAxisFormatter = (daysElapsed : number, index: number) => {
    //     let month = 1;
    //     let day = 0;
    //     Object.keys(daysElapsedByMonth).forEach( (v) => {
    //         let pairMonth = parseInt(v);
    //         let pairDays = daysElapsedByMonth[pairMonth]; 
    //         if (pairDays < daysElapsed && pairDays > day){
    //             day = pairDays;
    //             month = pairMonth;
    //         }
    //     });
    //     return `${month}/${daysElapsed - day}`;
    // }


    const xAxisFormatter = (v: number, i: number) => {
        return `${v}`;
    }

    
    return (
        <Graph title={"Annual Values"}
                       data = {comboData} 
                       xAxisFormatter={xAxisFormatter}
                       xKeyMap={(v : ComboType) => v.day}
                       xLabel={"Day"}
                       xDomain={[1,366]}
                       xTicks={Array.from(Object.keys(daysElapsedByMonth), (v) => daysElapsedByMonth[parseInt(v)] + 1)}
                       yLabel={"Streamflow, ft^3/s"}>
            <Area type="monotone" dataKey={(v) => v.alltime} fillOpacity={1} fill="lightgray" stroke="lightgray"/>
            <Line dataKey={(v) => v.lastyear} stroke="black" dot={false}/>
            <ReferenceDot x={daysElapsedByMonth[todaysValues.variable.values[0].dateTime.getMonth() + 1] + todaysValues.variable.values[0].dateTime.getDate()}
                        y={todaysValues.variable.values[0].value} 
                        r={5}
                        fill='black'
                        stroke="black">
                            <Label position="top">Today</Label>
                        </ReferenceDot>
        </Graph>)
}

export default AnnualValueGraph;
