
"use server";

import { WaterDataResponse } from "@/app/types/types"

export const getWaterServicesInstantaneousValues = async (bBox : string[]) : Promise<WaterDataResponse> => {
    const baseUrl = `https://waterservices.usgs.gov/nwis/iv/`;
    const url = `${baseUrl}?format=json&bBox=${[...bBox]}&modifiedSince=P1D&siteStatus=all&siteType=ST&parameterCd=00060`;
    const result = await fetch(url)
    return result.json();
}