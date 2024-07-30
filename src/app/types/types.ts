
export interface WaterServicesResponse {
    value: {
        timeSeries: WaterServicesResponseData[]
    }
}

export interface WaterServicesResponseData {
    sourceInfo: {
        siteName: string,
        siteCode : {
            value: string,
        }[]
        geoLocation : {
            geogLocation: {
                latitude: number,
                longitude: number,
            }
        }
    }
    ,
    variable: {
        variableName: string,
        unit : {
            unitCode: string,
        }
        oid: number,
    },
    values: {
        value: {
            value: string,
            dateTime: Date,
        }[]
    
    }[]
}

export interface WaterData {
    name : string;
    id : number,
    geoLocation : {
        latitude : number,
        longitude : number,
    }
    variable: WaterDataVariable,
}

export interface WaterDataVariable {
    variableName : string,
    oid : number,
    unit : string,
    values : WaterDataVariableValue[],
}

export interface WaterDataVariableValue {
    value : number,
    dateTime : Date,
}

export interface WaterStatistic {
    max: number,
    min: number, 
    p05: number,
    p25: number,
    p75: number,
    p95: number

}