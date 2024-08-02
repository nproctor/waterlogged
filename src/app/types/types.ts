
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
    id : string,
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

export type WaterStatistic = ApproxValue[];


interface ApproxValue {
    label : string,
    value : number,
    estimated : boolean,
}