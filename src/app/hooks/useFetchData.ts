import {useState, useEffect} from 'react';
import { getAllTimeStatisticalData, getSiteDailyValues, getSiteInstantaneousValues } from '@/app/api/actions';
import { WaterData, WaterDataVariableValue, WaterStatistic } from '@/app/types/types';
import { interpolateValues } from '@/app/scripts/interpolate';

const useFetchData = (id: number) => {
    const [dailyValues, setDailyValues] = useState<WaterData | null>(null);
    const [todaysValues, setTodaysValues]= useState<WaterData | null>(null);
    const [allTimeStats, setAllTimeStats] = useState<WaterStatistic[][] | null>(null);
    const [todaysStats, setTodaysStats] = useState<WaterStatistic | null>(null);

    useEffect( () => {
        // 7 day daily values
        getSiteDailyValues(id, 7)
        .then((res) => {
            setDailyValues(res)
            
        })

        // Values since midnight
        const date = new Date(Date.now());
        date.setHours(0,0,0,0);

        getSiteInstantaneousValues(id, date)
        .then((res) => {
            setTodaysValues(res);
        })

        // Statistic
        getAllTimeStatisticalData(id)
        .then( (res) => {
            setAllTimeStats(res);
            setTodaysStats(interpolateValues(res[date.getMonth()][date.getDate()]));
        });

    }, []);

    return {dailyValues, todaysValues, allTimeStats, todaysStats};
}

export default useFetchData;