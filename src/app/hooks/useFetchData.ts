import {useState, useEffect} from 'react';
import { getAllTimeStatisticalData, getSiteDailyValues, getSiteInstantaneousValues } from '@/app/api/actions';
import { WaterData, WaterDataVariableValue, WaterStatistic, WaterStatisticValue } from '@/app/types/types';
import { interpolateWaterStatisticValues } from '@/app/scripts/interpolate';

const useFetchData = (id: number) => {
    const [todaysValues, setTodaysValues]= useState<WaterData | null>(null);
    const [allTimeStats, setAllTimeStats] = useState<WaterStatistic[] | null>(null);
    const [todaysStats, setTodaysStats] = useState<WaterStatisticValue[] | null>(null);
    const [dailyValuesYear, setDailyValuesYear] = useState<WaterData | null>(null);

    useEffect( () => {

        // 365 day daily values
        getSiteDailyValues(id, 365)
        .then((res) => {
            setDailyValuesYear(res)
        })

        // Values since midnight
        const date = new Date(Date.now());
        date.setHours(0,0,0,0);

        // Returns true if the day is today and false otherwise
        const isToday = (data: WaterStatistic) => {
            if (data.day === date.getDate() && data.month === (date.getMonth() + 1))
                return true;
            return false;
        }

        getSiteInstantaneousValues(id, date)
        .then((res) => {
            setTodaysValues(res);
        })

        // Statistic
        getAllTimeStatisticalData(id)
        .then( (res) => {
            setAllTimeStats(res);
            const todaysData = res.find(isToday);
            if (todaysData){
                setTodaysStats(interpolateWaterStatisticValues(todaysData.values));
            }
        });

    }, []);

    return {dailyValuesYear, todaysValues, allTimeStats, todaysStats};
}

export default useFetchData;