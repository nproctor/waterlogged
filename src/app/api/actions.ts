
"use server";

import { WaterServicesResponse, WaterServicesResponseData, WaterData, WaterDataVariable, WaterStatistic, WaterStatisticValue } from "@/app/types/types"
import { parse } from "path";
import { decode } from 'html-entities';

export const getAllTimeStatisticalData = async (id: number) : Promise<any> => {
    const baseUrl = `https://waterservices.usgs.gov/nwis/stat/`;
    const url = `${baseUrl}?format=rdb,1.0&sites=${id}&statReportType=daily&statTypeCd=median,min,max,p05,p10,p20,p25,p50,p75,p80,p90,p95&parameterCd=00060`
    const data = await fetch(url)
    .then( (res) => res.text())
    .then( (text) => parseStatisticalData(text));
    return data;
}

export const getSiteDailyValues = async (id: number, days: number) : Promise<WaterData> => {
    const baseUrl = `https://waterservices.usgs.gov/nwis/dv/`;
    const url = `${baseUrl}?format=json&sites=${id}&period=P${days}D&siteStatus=all&siteType=ST&parameterCd=00060`;
    const data = await fetch(url)
    .then( (result) => {return result.json()})
    .then( (json) => { return individualResponse(json)})
    return data;
}

export const getSiteInstantaneousValues = async (id: number, startDate: Date) : Promise<WaterData> => {
    const baseUrl = `https://waterservices.usgs.gov/nwis/iv/`;
    const url = `${baseUrl}?format=json&sites=${id}&startDT=${startDate.toISOString()}&siteStatus=all&siteType=ST&parameterCd=00060`
    const data = await fetch(url)
    .then( (result) => {return result.json()})
    .then( (json) => { return individualResponse(json)})
    return data;
}

export const getEnvelopeInstantaneousValues = async (bBox : string[]) : Promise<WaterData[]> => {
    const baseUrl = `https://waterservices.usgs.gov/nwis/iv/`;
    const url = `${baseUrl}?format=json&bBox=${[...bBox]}&modifiedSince=P1D&siteStatus=all&siteType=ST&parameterCd=00060`;
    const data = await fetch(url)
    .then( (result) => {return result.json()})
    .then( (json) => { return groupResponse(json)})
    return data;
}

const groupResponse = async (response : WaterServicesResponse) : Promise<WaterData[]> => {
    const promise = new Promise<WaterData[]>( (resolve) => {
        const data : WaterData[] = []
        response.value.timeSeries.forEach( (point) => {
            try {
                const simplified = mapSchema(point);
                data.push(simplified);
            }
            catch (err) {   
            }
        })
        resolve(data);
    });
    return promise;
}

const individualResponse = async (response: WaterServicesResponse) : Promise<WaterData> => {
    const promise = new Promise<WaterData> ( (resolve, reject) => {
        if (response.value.timeSeries.length != 1)
            reject();
        resolve(mapSchema(response.value.timeSeries[0]))
    });
    return promise;
}

const mapSchema = (point : WaterServicesResponseData) : WaterData => {
    const simplified : WaterData = {
        name : point.sourceInfo.siteName,
        id : point.sourceInfo.siteCode[0].value,
        geoLocation : point.sourceInfo.geoLocation.geogLocation,
        variable: mapVariableSchema(point)
    }
    return simplified;
}

const mapVariableSchema = (point : WaterServicesResponseData) : WaterDataVariable => {
    let varData = {
        variableName : decode(point.variable.variableName),
        oid : point.variable.oid,
        unit : point.variable.unit.unitCode,
        values : 
            point.values[0].value.map((v) => {
                return {value: parseFloat(v.value), 
                        dateTime: new Date(v.dateTime)}
            })
        
    }
    return varData;
}

// Sparse Array of Statistic Data for the year
const parseStatisticalData = (response: string) : WaterStatistic[] => {
    const waterStatisticData : WaterStatistic[] = [];
    let lines : string[] = response.split("\n");

    // Skip comments
    while (lines.length > 0 && lines[0][0] === "#"){
        lines.shift();
    }

    // Grab headers
    const headers = lines.shift()?.split("\t");
    if (!headers) { return waterStatisticData; }
    const maxIdx = headers.indexOf("max_va");
    const minIdx = headers.indexOf("min_va");
    const p05Idx = headers.indexOf("p05_va");
    const p10Idx = headers.indexOf("p10_va");
    const p20Idx = headers.indexOf("p20_va");
    const p25Idx = headers.indexOf("p25_va");
    const p50Idx = headers.indexOf("p50_va");
    const p75Idx = headers.indexOf("p75_va");
    const p80Idx = headers.indexOf("p80_va");
    const p90Idx = headers.indexOf("p90_va");
    const p95Idx = headers.indexOf("p95_va");
    const dayIdx = headers.indexOf("day_nu");
    const monthIdx = headers.indexOf("month_nu");
    
    // Skip next row
    lines.shift();

    // Get Data
    lines.forEach( (line) => {
        const row = line.split("\t");
        if (row.length > 1){
            const waterStat : WaterStatisticValue[] = [];
            waterStat[100] = {label: "max", value: parseInt(row[maxIdx]), estimated: false},
            waterStat[0] = {label: "min", value: parseInt(row[minIdx]), estimated: false},
            waterStat[5] = {label: "p05", value: parseInt(row[p05Idx]), estimated: false},
            waterStat[10] = {label: "p10", value: parseInt(row[p10Idx]), estimated: false},
            waterStat[20] = {label: "p20", value: parseInt(row[p20Idx]), estimated: false},
            waterStat[25] = {label: "p25", value: parseInt(row[p25Idx]), estimated: false},
            waterStat[50] = {label: "p50", value: parseInt(row[p50Idx]), estimated: false},
            waterStat[75] = {label: "p75", value: parseInt(row[p75Idx]), estimated: false},
            waterStat[80] = {label: "p80", value: parseInt(row[p80Idx]), estimated: false},
            waterStat[90] = {label: "p90", value: parseInt(row[p90Idx]), estimated: false},
            waterStat[95] = {label: "p95", value: parseInt(row[p95Idx]), estimated: false}
            const month = parseInt(row[monthIdx]);
            const day = parseInt(row[dayIdx])
            waterStatisticData.push({month: month, day: day, values: waterStat});
        }
    });

    return waterStatisticData;
}