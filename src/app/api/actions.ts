
"use server";

import { WaterServicesResponse, WaterServicesResponseData, WaterData, WaterDataVariable } from "@/app/types/types"

export const getWaterServicesInstantaneousValues = async (bBox : string[]) : Promise<WaterData[]> => {
    const baseUrl = `https://waterservices.usgs.gov/nwis/iv/`;
    const url = `${baseUrl}?format=json&bBox=${[...bBox]}&modifiedSince=P1D&siteStatus=all&siteType=ST&parameterCd=00060,00065`;
    const data = await fetch(url)
    .then( (result) => {return result.json()})
    .then( (json) => { return simplifyResponse(json)})
    return data;
}

const simplifyResponse = async (response : WaterServicesResponse) : Promise<WaterData[]> => {
    const promise = new Promise<WaterData[]>( (resolve) => {
        const data : WaterData[] = [];
        let id : number | null = null;
        response.value.timeSeries.forEach( (point) => {
            if (id === parseInt(point.sourceInfo.siteCode[0].value)){
                data[data.length - 1].variables.push(mapVariableSchema(point));
            }
            else {
                const simplified = mapSchema(point);
                id = simplified.id;
                data.push(simplified);
            }
        })
        resolve(data);
    });
    return promise;
}

const mapSchema = (point : WaterServicesResponseData) : WaterData => {
    const simplified : WaterData = {
        name : point.sourceInfo.siteName,
        id : parseInt(point.sourceInfo.siteCode[0].value),
        geoLocation : point.sourceInfo.geoLocation.geogLocation,
        variables: [mapVariableSchema(point)]
    }
    return simplified;
}

const mapVariableSchema = (point : WaterServicesResponseData) : WaterDataVariable => {
    let varData = {
        variableName : point.variable.variableName,
        oid : point.variable.oid,
        unit : point.variable.unit.unitCode,
        value : parseFloat(point.values[0].value[0].value),
        dateTime : point.values[0].value[0].dateTime,
    }
    return varData;
}