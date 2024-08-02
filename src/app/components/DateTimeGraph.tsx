import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label, TooltipProps} from 'recharts';
import { WaterData } from '@/app/types/types';
import { PropsWithChildren, useRef, useEffect, useState } from 'react';

interface Props extends PropsWithChildren{
    title: string,
    data: WaterData,
    xAxisFormatter: (value: number, index: number) => string,
    keyMap: (date: Date) => number,
    xDomain: [number, number],
    xLabel: string,
    xTicks? : number[],
}
  

const DateTimeGraph = ({title, data, xAxisFormatter, keyMap, xDomain, xLabel, xTicks, children}: Props) => {

  const [rangeScalar, setRangeScalar] = useState<number>(2);

    return (
      <div className="date-time-graph">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart title={title} data={data.variable.values} margin={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Line type="monotone" dataKey="value" stroke="black" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={(v) => keyMap(v.dateTime)} 
                        tickFormatter={xAxisFormatter} 
                        height={30} 
                        type='number' 
                        domain={xDomain} 
                        ticks={xTicks}>
                    <Label value={xLabel} position='bottom' color="black"/>
                </XAxis>
                <YAxis domain={[(dataMin : number) => (dataMin / rangeScalar), (dataMax : number) => (dataMax * rangeScalar)]} tickFormatter={(v) => v.toFixed(1)}>
                    <Label value={data.variable.variableName} angle={-90} position='left' color="black"/>
                </YAxis>
                {children}
                <Tooltip content={<CustomTooltip yLabel={data.variable.variableName} xLabel={xLabel} xAxisFormatter={xAxisFormatter}/>} />
            </LineChart>
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

export default DateTimeGraph;
