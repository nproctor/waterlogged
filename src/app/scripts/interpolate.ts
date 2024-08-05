import { WaterStatisticValue } from "@/app/types/types";

export const interpolateValues = (stats: WaterStatisticValue[]) : WaterStatisticValue[] => {
    // If min, max or median are NaN, not enough data for any reasonable interpolation
    if (isNaN(stats[0].value) || isNaN(stats[100].value) || isNaN(stats[50].value))
        return [];
    
    const percentiles: number[] = []; 
    stats.forEach((_,i) => percentiles.push(i)); 
    
    let j = 0;
    for (let i = 0; i < percentiles.length; i ++){
        let p = percentiles[i];

        // If a percentile does not have a value
        if (isNaN(stats[p].value)){
            j = j < i? i: j; 
            while (isNaN(stats[percentiles[j]].value)){ 
                j += 1; 
            }
            stats[percentiles[i]].value = linearInterpolation(  percentiles[i-1],
                                                                percentiles[j],
                                                                percentiles[i],
                                                                stats[percentiles[i-1]].value,
                                                                stats[percentiles[j]].value);
            stats[percentiles[i]].estimated = true;
        }
    }

    return stats;
}

const linearInterpolation = (x1 : number, x2: number, x: number, y1: number, y2: number) => {
    return (y2 - y1) / (x2 - x1) * (x - x1) + y1;
}

export const getPercentile = (value: number | undefined, stats: WaterStatisticValue[]) => {
    if (!value)
        return undefined;
    let p1 = 0, p2 = 0, v1 = 0, v2 = 0;
    stats.forEach((stat, i) => {
        if (stat.value < value){
            v1 = stat.value;
            p1 = i;
        }
        else if (stat.value < value && !v2){
            v2 = stat.value;
            p2 = i;
        }
    });
    return linearInterpolation(v1, v2, value, p1, p2);

}

export const getColorFromPercentile = (percentile: number | undefined) => {
    if (!percentile)
        return "var(--color-water-undefined)";
    if (percentile < 10)
        return "var(--color-water-min)";
    if (percentile < 25)
        return "var(--color-water-low)";
    if (percentile < 75)
        return "var(--color-water-normal)";
    if (percentile < 90)
        return "var(--color-water-high)";
    else
        return "var(--color-water-max)";
}