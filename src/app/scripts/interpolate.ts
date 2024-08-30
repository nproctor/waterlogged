import { WaterStatisticValue } from "@/app/types/types";

   /**
   * Takes a WaterStatisticValue array and fills in the NaN values with interpolated values.
   * If there are not enough values to be interpolated, an empty array is returned.
   * If there are no values that need to be interpolated, the array is returned unmodified.
   * After this method is executed, all values in WaterStatisticValue[] will be numbers
   * or NaN.
   *
   * @param stats - the WaterStaticValue array that will be interpolated
   * @returns The WaterStatisticValue array with interpolated values
   *
   */
export const interpolateWaterStatisticValues = (stats: WaterStatisticValue[]) : WaterStatisticValue[] => {
    const sorted = stats.sort((a, b) => a.percentile - b.percentile);
    // If min, max or median are NaN, not enough data for any reasonable interpolation
    if (isNaN(sorted[0].value) || isNaN(sorted[5].value) || isNaN(sorted[10].value)){
        sorted.forEach((v, i) => v.value = NaN);
        return sorted;
    }
    
    let j = 0;
    for (let i = 0; i < sorted.length; i ++){

        // If it does not have a value
        if (isNaN(sorted[i].value)){
            // Find the number after it that has a non-NaN value
            // Guaranteed that p0 and p100 exist, so this will never be infinite
            j = j < i? i: j; 
            while (isNaN(sorted[j].value)){ 
                j += 1; 
            }
            // Interpolate using the preceeding value and the next non-NaN value
            // following it
            sorted[i].value = linearInterpolation(  sorted[i-1].percentile,
                                                                sorted[j].percentile,
                                                                sorted[i].percentile,
                                                                sorted[i-1].value,
                                                                sorted[j].value);
            // Tag this value as estimated
            sorted[i].estimated = true;
        }
    }

    return sorted;
}

   /**
   * Returns the estimated y values of x using a linear interpolation between (x1, y2) and (x2, y2). 
   * The value of x should be between x1 and x2. If x is not between x1 and x2, this function returns NaN.
   * If both (x1, y1) and (x2, y1) are the same point and x === x1, the function return y1. 
   *
   * @param x1 - The x value of the first point.
   * @param x2 - The x value of the second point.
   * @param y1 - The y value of the first point.
   * @param y2 - The y value of the second point.
   * @param x - The x values whose y value is estimated.
   * @returns The estimated y value of x using a linear interpolation.
   *
   */
export const linearInterpolation = (x1 : number, x2: number, x: number, y1: number, y2: number) => {
    if (x1 === x2 && y1 === y2 && x1 === x)
        return y1;
    return (y2 - y1) / (x2 - x1) * (x - x1) + y1;
}


/**
   * Given a specific value, calculated the estimated corresponding percentile
   *
   * @param value: the Stream Flow value whose percentile is being percentile
   * @param stats: the WaterStatsValue[] that contains the percentiles that are to be used for the estimatation
   */
export const getPercentile = (value: number, stats: WaterStatisticValue[]) : number => {
    // Ensure they are sorted
    const sorted = stats.sort((a, b) => a.percentile - b.percentile);
    // Find the percentiles that the value is between
    let p1, p2, v1, v2 : number | undefined;
    sorted.forEach((stat, i) => {
        // Find the largest stat value that's smaller than the target value
        if (stat.value <= value){
            v1 = stat.value;
            p1 = stat.percentile;
        }
        // Find the smallest stat value that's larger than the target value
        if (stat.value > value && v2 === undefined){
            v2 = stat.value;
            p2 = stat.percentile;
        }
    });
    // If it's equal to the largest smaller value, return that percentile
    if (v1 === value && p1)
        return p1;
    // If it's equal to the smallest larger value, return that percentil
    if (v2 === value && p2)
        return p2;
    // smallest value ever recorded
    if (v1 === undefined || p1 === undefined)
        return -Infinity;
    // largest value ever recorded
    if (v2 === undefined || p2 === undefined)
        return Infinity;
    return linearInterpolation(v1, v2, value, p1, p2);

}

/**
   * Given a specific percentile, returns the corresponding color
   *
   * @param percentile number representing the percentile
   */
export const getColorFromPercentile = (percentile: number | undefined) => {
    if (percentile === Infinity || percentile === -Infinity || percentile === undefined)
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