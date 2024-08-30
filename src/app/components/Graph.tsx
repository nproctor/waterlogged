import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label, TooltipProps, ComposedChart} from 'recharts';
import { WaterDataVariableValue, WaterStatistic, WaterStatisticValue} from '@/app/types/types';
import { PropsWithChildren, useState } from 'react';

interface Props extends PropsWithChildren{
    title: string,
    data: any[];
    xAxisFormatter: (value: number, index: number) => string,
    xKeyMap: (v : any) => number,
    yKeyMap?: (v: any) => number,
    xDomain: [number, number],
    xLabel: string,
    yLabel : string,
    xTicks? : number[],
}
  

const Graph = ({title, data, xAxisFormatter, xKeyMap, yKeyMap, xDomain, xLabel, yLabel, xTicks, children}: Props) => {

  const [rangeScalar, setRangeScalar] = useState<number>(2);

    return (
      <div className="date-time-graph">
        <span className="section-title">{title}</span>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{top: 10, bottom: 80, left: 30, right: 30}}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={(v) => xKeyMap(v)} 
                        tickFormatter={xAxisFormatter} 
                        height={30} 
                        type='number' 
                        domain={xDomain} 
                        ticks={xTicks}>
                    <Label value={xLabel} position='bottom' color="black"/>
                </XAxis>
                <YAxis domain={[(dataMin : number) => (dataMin / rangeScalar), (dataMax : number) => (dataMax * rangeScalar)]} 
                       tickFormatter={(v) => v.toFixed(1)}
                       dataKey={yKeyMap}
                       type='number'>
                    <Label value={yLabel} angle={-90} position='left' color="black"/>
                </YAxis>
                {children}
                <Tooltip content={<CustomTooltip yLabel={yLabel} xLabel={xLabel} xAxisFormatter={xAxisFormatter}/>} />  
            </ComposedChart>
        </ResponsiveContainer>
      </div>);
}


const CustomTooltip = ({active, payload, label, xLabel, yLabel, xAxisFormatter}: TooltipProps<number, string> 
  & {xLabel: string, yLabel: string, xAxisFormatter: (value: number, index: number) => string,}) => {

    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
            <p className="xlabel"> {xLabel} </p>
          <p className="xvalue"> {xAxisFormatter(label, 0)} </p>
          <br></br>
          <p className="ylabel"> {yLabel} </p>
          <p className="yvalue"> {payload[0].value}</p>
        </div>
      );
    }

    return null;
  };

export default Graph;
