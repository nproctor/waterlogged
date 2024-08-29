import { Scatter, Cell, Legend, Tooltip, ScatterChart, Line, ReferenceDot} from 'recharts';
import { WaterData, WaterDataVariable, WaterStatisticValue } from '@/app/types/types';
import { PropsWithChildren, useEffect } from 'react';
import Graph from '@/app/components/Graph';
import { getColorFromPercentile, getPercentile } from '../scripts/interpolate';


interface Props extends PropsWithChildren{
    todaysStats : WaterStatisticValue[],
    todaysValues: WaterData,
}
  

const PercentileGraph = ({todaysStats, todaysValues}: Props) => {
    const recentValue = todaysValues.variable.values.at(-1)?.value;
    const percentile = recentValue ? getPercentile(recentValue, todaysStats) : undefined;

    const xAxisFormatter = (value : number, index: number) => {
        return `${value}%`;
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
                       xTicks={[0,5,10,25,50,75,80,90,95,100]}>
            <Legend payload={[{value: "Actual", type: "circle", color: "gray"}, 
                                {value: "Estimated", type: "circle", color: "lightgray"},
                                {value: "Current", type: "circle", color: getColorFromPercentile(percentile)}]} 
                                verticalAlign="top"
                                wrapperStyle={{padding: 10}} />
                <Line type="linear" dataKey={(v) => v.value} stroke="black" />
                <Scatter data={todaysStats}>
                    {todaysStats.map((v, i) => {
                        return <Cell key={`cell-${i}`} fill={v.estimated? "lightgray" : "gray"}></Cell>
                    })}
                </Scatter>
                <ReferenceDot y={recentValue} x={percentile} stroke="black" fill={getColorFromPercentile(percentile)} r={6}/>
    </Graph>)  
}

export default PercentileGraph;