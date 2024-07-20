
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
    variables: WaterDataVariable[],
}

export interface WaterDataVariable {
    variableName : string,
    oid : number,
    unit : string,
    value : number,
    dateTime : Date,
}