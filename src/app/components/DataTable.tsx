"use client";

import { WaterData } from "@/app/types/types"
import {useState, useEffect} from 'react'
import { WaterDataVariable } from "@/app/types/types"

interface Props {
    title: string,
    data: WaterData,
}

const DataTable = ({title, data} : Props) => {

    return (
        <div className="details-table">
            <span>{title}</span>
            <table>
                <tr>
                    <th>Day</th><th>{data.variable.variableName}</th>
                </tr>
                {data.variable.values.map( (val) => { 
                    return <tr key={val.dateTime.toString()}><td>{val.dateTime.toDateString()}</td><td>{val.value}</td></tr>
                })}

            </table>
        </div>
    )
}

export default DataTable;