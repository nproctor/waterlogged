import { Scatter, Cell, Legend, Tooltip, ScatterChart, Line, ReferenceDot, Label} from 'recharts';
import { WaterData, WaterDataVariable, WaterStatisticValue } from '@/app/types/types';
import { PropsWithChildren, useEffect, useState } from 'react';
import Graph from '@/app/components/Graph';
import { getColorFromPercentile, getPercentile } from '../scripts/interpolate';


interface Props extends PropsWithChildren{
    todaysStats : WaterStatisticValue[],
    todaysValues: WaterData,
}
  

const PercentileGraph = ({todaysStats, todaysValues}: Props) => {
    const recentValue = todaysValues.variable.values.at(-1)?.value;
    const [percentile, setPercentile] = useState<number>(NaN);

    useEffect( () => {
        if (recentValue){
            const p = getPercentile(recentValue, todaysStats)
            setPercentile(p);
        }
    }, [])

    const xAxisFormatter = (value : number, index: number) => {
        return `${value.toFixed(0)}%`;
    }

    return (
        <Graph title={"Percentile"}
                       data = {todaysStats} 
                       xAxisFormatter={xAxisFormatter}
                       xKeyMap={(v : WaterStatisticValue) => {return (v.percentile)}}
                       yKeyMap={(v : WaterStatisticValue) => {return (v.value)}}
                       xLabel={"Percentile"}
                       xDomain={[0,100]}
                       yLabel={"Streamflow, ft^3/s"}
                       xTicks={[0,5,10,20,25,50,75,80,90,95,100]}>
            <Legend payload={[{value: "Actual", type: "circle", color: "gray"}, 
                                {value: "Estimated", type: "circle", color: "lightgray"}]} 
                                verticalAlign="top"
                                wrapperStyle={{padding: 10}} />
                <Line type="linear" dataKey={(v) => v.value} stroke="black" />
                <Scatter data={todaysStats}>
                    {todaysStats.map((v, i) => {
                        return <Cell key={`cell-${i}`} fill={v.estimated? "lightgray" : "gray"}></Cell>
                    })}
                </Scatter>
                <ReferenceDot y={recentValue} x={percentile} stroke="black" fill={getColorFromPercentile(percentile)} r={6}>
                
                    <Label position="top">Current</Label>
                </ReferenceDot>
    </Graph>)  
}

export default PercentileGraph;