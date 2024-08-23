import { Scatter, Cell} from 'recharts';
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
            <Scatter data={todaysStats}>
                {todaysStats.map((v, i) => {
                    return <Cell key={i} fill={v.estimated? "red" : "green"}></Cell>
                })}
            </Scatter>
    </DateTimeGraph>)  
}

export default PercentileGraph;