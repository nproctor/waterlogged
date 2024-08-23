import {getPercentile, interpolateWaterStatisticValues, linearInterpolation} from './interpolate';
import { WaterStatisticValue } from "@/app/types/types";

// ---------- Linear Interpolation ---------- 
describe('linearInterpolation', () => {
    test('x between positive increasing values',  () => {
        const x1 = 2, x2 = 10, y1 = 0, y2 = 20, x = 8;
        const y = linearInterpolation(x1, x2, x, y1, y2);
        expect(y).toBe(15);
    });

    test('x between positive decreasing values', () => {
        const x1 = 20, x2 = 10, y1 = 100, y2 = 95, x = 12;
        const y = linearInterpolation(x1, x2, x, y1, y2);
        expect(y).toBe(96);
    });
    
    test('x between negative increasing values', () => {
        const x1 = -5, x2 = 10, y1 = -5, y2 = 25, x = 0;
        const y = linearInterpolation(x1, x2, x, y1, y2);
        expect(y).toBe(5);
    });

    test('x between steady (non-changing) values', () => {
        const x1 = 5, x2 = 10, y1 = 7, y2 = 7, x = 0;
        const y = linearInterpolation(x1, x2, x, y1, y2);
        expect(y).toBe(7);
    });

    test('(x1,y1) is the same point as (x2, y2) and x is equal to x1 and x2', () => {
        const x1 = 5, x2 = 5, y1 = 7, y2 = 7, x = 5;
        const y = linearInterpolation(x1, x2, x, y1, y2);
        expect(y).toBe(7);
    });

    test('(x1,y1) is the same point as (x2, y2) and x is NOT equal to x1 and x2', () => {
        const x1 = 5, x2 = 5, y1 = 7, y2 = 7, x = 7;
        const y = linearInterpolation(x1, x2, x, y1, y2);
        expect(y).toBeNaN();
    });
});


// ---------- Linear Interpolation ---------- 
describe('interpolateWaterStatisticValue', () => {

    test('check values when all data available', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: 0, estimated: false};
        values[1] = {percentile: 5, value: 5, estimated: false};
        values[2] = {percentile: 10, value: 10, estimated: false};
        values[3] = {percentile: 20, value: 20, estimated: false};
        values[4] = {percentile: 25, value: 25, estimated: false};
        values[5] = {percentile: 50, value: 50, estimated: false};
        values[6] = {percentile: 75, value: 75, estimated: false};
        values[7] = {percentile: 80, value: 80, estimated: false};
        values[8] = {percentile: 90, value: 90, estimated: false};
        values[9] = {percentile: 95, value: 95, estimated: false};
        values[10] =  {percentile: 100, value: 100, estimated: false};
        const newValues = interpolateWaterStatisticValues(values);
        expect(newValues[0].value).toBe(0);
        expect(newValues[1].value).toBe(5);
        expect(newValues[2].value).toBe(10);
        expect(newValues[3].value).toBe(20);
        expect(newValues[4].value).toBe(25);
        expect(newValues[5].value).toBe(50);
        expect(newValues[6].value).toBe(75);
        expect(newValues[7].value).toBe(80);
        expect(newValues[8].value).toBe(90);
        expect(newValues[9].value).toBe(95);
        expect(newValues[10].value).toBe(100);
    });

    test('values and estimated tag when some data is missing', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: 0, estimated: false};
        values[1] = {percentile: 5, value: NaN, estimated: false};
        values[2] = {percentile: 10, value: 10, estimated: false};
        values[3] = {percentile: 20, value: NaN, estimated: false};
        values[4] = {percentile: 25, value: NaN, estimated: false};
        values[5] = {percentile: 50, value: 50, estimated: false};
        values[6] = {percentile: 75, value: 75, estimated: false};
        values[7] = {percentile: 80, value: 80, estimated: false};
        values[8] = {percentile: 90, value: NaN, estimated: false};
        values[9] = {percentile: 95, value: NaN, estimated: false};
        values[10] =  {percentile: 100, value: 100, estimated: false};
        const newValues = interpolateWaterStatisticValues(values);
        expect(newValues[0].value).toBe(0);
        expect(newValues[0].estimated).toBeFalsy();
        expect(newValues[1].value).toBe(5);
        expect(newValues[1].estimated).toBeTruthy();
        expect(newValues[2].value).toBe(10);
        expect(newValues[2].estimated).toBeFalsy();
        expect(newValues[3].value).toBe(20);
        expect(newValues[3].estimated).toBeTruthy();
        expect(newValues[4].value).toBe(25);
        expect(newValues[4].estimated).toBeTruthy();
        expect(newValues[5].value).toBe(50);
        expect(newValues[5].estimated).toBeFalsy();
        expect(newValues[6].value).toBe(75);
        expect(newValues[6].estimated).toBeFalsy();
        expect(newValues[7].value).toBe(80);
        expect(newValues[7].estimated).toBeFalsy();
        expect(newValues[8].value).toBe(90);
        expect(newValues[8].estimated).toBeTruthy();
        expect(newValues[9].value).toBe(95);
        expect(newValues[9].estimated).toBeTruthy();
        expect(newValues[10].value).toBe(100);
        expect(newValues[10].estimated).toBeFalsy();
    });

    test('all values are set NaN if p50 data is lacking', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: 0, estimated: false};
        values[1] = {percentile: 5, value: NaN, estimated: false};
        values[2] = {percentile: 10, value: 10, estimated: false};
        values[3] = {percentile: 20, value: NaN, estimated: false};
        values[4] = {percentile: 25, value: NaN, estimated: false};
        values[5] = {percentile: 50, value: NaN, estimated: false};
        values[6] = {percentile: 75, value: 75, estimated: false};
        values[7] = {percentile: 80, value: 80, estimated: false};
        values[8] = {percentile: 90, value: NaN, estimated: false};
        values[9] = {percentile: 95, value: NaN, estimated: false};
        values[10] =  {percentile: 100, value: 100, estimated: false};
        const newValues = interpolateWaterStatisticValues(values);
        expect(newValues[0].value).toBeNaN();
        expect(newValues[1].value).toBeNaN();
        expect(newValues[2].value).toBeNaN();
        expect(newValues[3].value).toBeNaN();
        expect(newValues[4].value).toBeNaN();
        expect(newValues[5].value).toBeNaN();
        expect(newValues[6].value).toBeNaN();
        expect(newValues[7].value).toBeNaN();
        expect(newValues[8].value).toBeNaN();
        expect(newValues[9].value).toBeNaN();
        expect(newValues[10].value).toBeNaN();
    });

    test('all values are set NaN if p0 data is lacking', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: NaN, estimated: false};
        values[1] = {percentile: 5, value: NaN, estimated: false};
        values[2] = {percentile: 10, value: 10, estimated: false};
        values[3] = {percentile: 20, value: NaN, estimated: false};
        values[4] = {percentile: 25, value: NaN, estimated: false};
        values[5] = {percentile: 50, value: 50, estimated: false};
        values[6] = {percentile: 75, value: 75, estimated: false};
        values[7] = {percentile: 80, value: 80, estimated: false};
        values[8] = {percentile: 90, value: NaN, estimated: false};
        values[9] = {percentile: 95, value: NaN, estimated: false};
        values[10] =  {percentile: 100, value: 100, estimated: false};
        const newValues = interpolateWaterStatisticValues(values);
        expect(newValues[0].value).toBeNaN();
        expect(newValues[1].value).toBeNaN();
        expect(newValues[2].value).toBeNaN();
        expect(newValues[3].value).toBeNaN();
        expect(newValues[4].value).toBeNaN();
        expect(newValues[5].value).toBeNaN();
        expect(newValues[6].value).toBeNaN();
        expect(newValues[7].value).toBeNaN();
        expect(newValues[8].value).toBeNaN();
        expect(newValues[9].value).toBeNaN();
        expect(newValues[10].value).toBeNaN();
    });

    test('all values are set NaN if p100 data is lacking', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: 0, estimated: false};
        values[5] = {percentile: 5, value: NaN, estimated: false};
        values[10] = {percentile: 10, value: 10, estimated: false};
        values[20] = {percentile: 20, value: NaN, estimated: false};
        values[25] = {percentile: 25, value: NaN, estimated: false};
        values[50] = {percentile: 50, value: 50, estimated: false};
        values[75] = {percentile: 75, value: 75, estimated: false};
        values[80] = {percentile: 80, value: 80, estimated: false};
        values[90] = {percentile: 90, value: NaN, estimated: false};
        values[95] = {percentile: 95, value: NaN, estimated: false};
        values[100] =  {percentile: 100, value: NaN, estimated: false};
        const newValues = interpolateWaterStatisticValues(values);
        expect(newValues[0].value).toBeNaN();
        expect(newValues[1].value).toBeNaN();
        expect(newValues[2].value).toBeNaN();
        expect(newValues[3].value).toBeNaN();
        expect(newValues[4].value).toBeNaN();
        expect(newValues[5].value).toBeNaN();
        expect(newValues[6].value).toBeNaN();
        expect(newValues[7].value).toBeNaN();
        expect(newValues[8].value).toBeNaN();
        expect(newValues[9].value).toBeNaN();
        expect(newValues[10].value).toBeNaN();
    });

});

// ---------- Get Percentile -------------
describe('getPercentile', () => {

    test('standard case, all values increasing, and percentile is between two', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: 0, estimated: false};
        values[1] = {percentile: 5, value: 5, estimated: false};
        values[2] = {percentile: 10, value: 10, estimated: false};
        values[3] = {percentile: 20, value: 20, estimated: false};
        values[4] = {percentile: 25, value: 25, estimated: false};
        values[5] = {percentile: 50, value: 50, estimated: false};
        values[6] = {percentile: 75, value: 75, estimated: false};
        values[7] = {percentile: 80, value: 80, estimated: false};
        values[8] = {percentile: 90, value: 90, estimated: false};
        values[9] = {percentile: 95, value: 95, estimated: false};
        values[10] =  {percentile: 100, value: 100, estimated: false};
        const newValues = getPercentile(44, values);
        expect(newValues).toBe(44);
    });

    test('check percentile is correctly found', () => {
        const values : WaterStatisticValue[] = [];
        values[0] = {percentile: 0, value: 0, estimated: false};
        values[1] = {percentile: 5, value: 0, estimated: false};
        values[2] = {percentile: 10, value: 0, estimated: false};
        values[3] = {percentile: 20, value: 0, estimated: false};
        values[4] = {percentile: 25, value: 0, estimated: false};
        values[5] = {percentile: 50, value: 0, estimated: false};
        values[6] = {percentile: 75, value: 25, estimated: false};
        values[7] = {percentile: 80, value: 30, estimated: false};
        values[8] = {percentile: 90, value: 40, estimated: false};
        values[9] = {percentile: 95, value: 45, estimated: false};
        values[10] =  {percentile: 100, value: 50, estimated: false};
        expect(getPercentile(35, values)).toBe(85);
        expect(getPercentile(0, values)).toBe(50);
        expect(getPercentile(50, values)).toBe(100);
        expect(getPercentile(55, values)).toBe(Infinity);
        expect(getPercentile(-10, values)).toBe(-Infinity);
    });
});