import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label, TooltipProps, Legend} from 'recharts';
import { WaterData } from '@/app/types/types';
import { PropsWithChildren } from 'react';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = 60 * 24;

interface Props extends PropsWithChildren{
    title: string,
    data: WaterData
}

const xAxisFormatter = (timeInMinutes : number, index: number) => {
    const hours = (timeInMinutes / 60).toFixed(0).padStart(2, '0');
    const minutes = (timeInMinutes % 60).toFixed(0).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  

const Graph = ({title, data, children}: Props) => {


    const timeMap = (x : Date) : number => {
        return x.getHours() * 60 + x.getMinutes();
    }


    return (
        <ResponsiveContainer width="95%" height="95%">
            <LineChart title={title} data={data.variable.values} margin={{top: 20, bottom: 20, left: 20, right: 20}}>
                <Line type="monotone" dataKey="value" stroke="black" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={(v) => timeMap(v.dateTime)} 
                        tickFormatter={xAxisFormatter} 
                        height={30} 
                        type='number' 
                        domain={[0, MINUTES_IN_DAY]} 
                        ticks={Array.from({length:HOURS_IN_DAY}, (_,i) => i * MINUTES_IN_HOUR)}>
                    <Label value="Time" position='bottom' color="black"/>
                </XAxis>
                <YAxis domain={[(dataMin : number) => (dataMin / 2), (dataMax : number) => (dataMax * 2)]}>
                    <Label value={data.variable.variableName} angle={-90} position='left' color="black"/>
                </YAxis>
                {children}
                <Tooltip content={<CustomTooltip yLabel={data.variable.variableName} xLabel={"Time"}/>} />
                <Legend payload={[{value: "Very High > 95%", type:"circle", color:"var(--color-water-max)"}, 
                                  {value:"High 75% - 95%", type:"circle", color:"var(--color-water-high)"},
                                  {value:"Normal 25% - 75%", type:"circle", color:"var(--color-water-normal)"},
                                  {value:"Low 5% - 25%", type:"circle", color:"var(--color-water-low)"},
                                  {value:"Very Low < 5%", type:"circle", color:"var(--color-water-min)"}]} 
                                  verticalAlign="top"
                                  wrapperStyle={{padding: 10}}
                                  />
            </LineChart>
        </ResponsiveContainer>);
}


const CustomTooltip = ({active, payload, label, xLabel, yLabel}: TooltipProps<number, string> & {xLabel: string, yLabel: string}) => {
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
