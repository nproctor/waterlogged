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
    day: Date,
    alltime: number | undefined,
    lastyear: number | undefined,
}

const AnnualValueGraph = ({allTimeStats, dailyValuesYear, todaysValues}: Props) => {
    
    const [comboData, setComboData] = useState<ComboType[]>([]);
    
    const processData = (allTimeStats: WaterStatistic[], dailyValuesYear: WaterData) => {
        const data : ComboType[] = [];
    
        for (let i = 1; i < 366; i ++){
            const d = new Date(0, 0, i);
            let x = allTimeStats.find((v) => v.dateTime.getMonth() === d.getMonth() && v.dateTime.getDate() === d.getDate());
            let y = dailyValuesYear.variable.values.find((v) =>  v.dateTime.getMonth() === d.getMonth() && v.dateTime.getDate() === d.getDate())
            data.push({day: d, alltime: x?.values[5].value, lastyear: y?.value})
        }
        let latestValue = todaysValues.variable.values[0]
        let val = data.find((v) => v.day.getDate() === latestValue.dateTime.getDate() && v.day.getMonth() === latestValue.dateTime.getMonth());
        val ? val.lastyear = todaysValues.variable.values[0].value : null ;
        setComboData(data);
    }

    useEffect( () => {
        processData(allTimeStats, dailyValuesYear);
    }, []);

    const xAxisFormatter = (value : number, index: number) => {
        let date = new Date(value);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }


    
    return (
        <Graph title={"Annual Values"}
                       data = {comboData} 
                       xAxisFormatter={xAxisFormatter}
                       xKeyMap={(v : ComboType) => v.day.valueOf()}
                       xLabel={"Day"}
                       xDomain={[new Date(0, 0, 1).valueOf(), new Date(0, 11, 31).valueOf()]}
                       xTicks={Array.from({length: 12}, (v, i) => (new Date(0, i, 1)).valueOf() )}
                       yLabel={"Streamflow, ft^3/s"}>
            <Area type="monotone" dataKey={(v) => v.alltime} fillOpacity={1} fill="lightgray" stroke="lightgray"/>
            <Line dataKey={(v) => v.lastyear} stroke="black" dot={false}/>
            <ReferenceDot x={new Date(0, todaysValues.variable.values[0].dateTime.getMonth(), todaysValues.variable.values[0].dateTime.getDate()).valueOf()}
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
