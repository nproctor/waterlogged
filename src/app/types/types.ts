
export interface WaterDataResponse {
    value: {
        timeSeries: WaterData[]
    }
}

export interface WaterData {
    sourceInfo: {
        siteName: string,
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