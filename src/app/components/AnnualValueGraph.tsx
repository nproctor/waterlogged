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


    const dayOfYear = (date: Date) => {

        const daysElapsedByMonth : { [key: number]: number } = {
            0: 0, 1: 31, 2: 60, 3: 91, 4: 121, 5: 152, 6: 182, 7: 213, 8: 244, 9: 274, 10: 305, 11: 335
        }
        return daysElapsedByMonth[date.getMonth()] + date.getDate();
    }
    
    const processData = (allTimeStats: WaterStatistic[], dailyValuesYear: WaterData) => {
        const data : ComboType[] = [];
        for (let i = 0; i < 365; i ++){
            let x = allTimeStats.find((v) => dayOfYear(v.dateTime) === i);
            let y = dailyValuesYear.variable.values.find((v) =>  dayOfYear(v.dateTime) === i)
            data.push({day: i, alltime: x?.values[5].value, lastyear: y?.value})
        }
        let val = data.find((v) => v.day === dayOfYear(todaysValues.variable.values[0].dateTime));
        if (val)
            val.lastyear = todaysValues.variable.values[0].value;
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
                    //    xTicks={Array.from(Object.keys(daysElapsedByMonth), (v) => daysElapsedByMonth[parseInt(v)] + 1)}
                       yLabel={"Streamflow, ft^3/s"}>
            <Area type="monotone" dataKey={(v) => v.alltime} fillOpacity={1} fill="lightgray" stroke="lightgray"/>
            <Line dataKey={(v) => v.lastyear} stroke="black" dot={false}/>
            <ReferenceDot x={dayOfYear(todaysValues.variable.values[0].dateTime)}
                        y={todaysValues.variable.values[0].value} 
                        r={5}
                        fill='black'
                        stroke="black">
                            <Label position="top">Today</Label>
                        </ReferenceDot>
            <Legend payload={[{value: "All Time Median", type: "square", color: "lightgray"}, 
                    {value: "Last Year's Values", type: "line", color: "black"}]}
                    verticalAlign="top"
                    wrapperStyle={{padding: 10}} />
        </Graph>)
}

export default AnnualValueGraph;
