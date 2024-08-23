import { Scatter, Cell, Legend, Tooltip} from 'recharts';
import { WaterStatisticValue } from '@/app/types/types';
import { PropsWithChildren, useEffect } from 'react';
import DateTimeGraph from '@/app/components/DateTimeGraph';


interface Props extends PropsWithChildren{
    todaysStats : WaterStatisticValue[]
}
  

const PercentileGraph = ({todaysStats}: Props) => {

    const xAxisFormatter = (value : number, index: number) => {
        return `${value}%`;
    }

    return (
        <DateTimeGraph title={"Percentile"}
                       data = {todaysStats} 
                       xAxisFormatter={xAxisFormatter}
                       xKeyMap={(v : WaterStatisticValue) => {return (v.percentile)}}
                       yKeyMap={(v : WaterStatisticValue) => {return (v.value)}}
                       xLabel={"Percentile"}
                       xDomain={[0,100]}
                       yLabel={"Streamflow, ft^3/s"}>
            <Legend payload={[{value: "Actual", type: "circle", color: "var(--color-water-max)"}, 
                                  {value: "Estimated", type: "circle", color: "var(--color-water-min)"}]} 
                                  verticalAlign="top"
                                  wrapperStyle={{padding: 10}} />
            <Scatter line fill="gray" >
                {todaysStats.map((v, i) => {
                    return <Cell key={`cell-${i}`} fill={v.estimated? "var(--color-water-min)" : "var(--color-water-max)"}></Cell>
                })}
            </Scatter>
    </DateTimeGraph>)  
}

export default PercentileGraph;