"use client";

import { WaterData } from "@/app/types/types"
import {useState, useEffect} from 'react'
import { WaterDataVariable } from "@/app/types/types"

interface Props {
    title: string,
    data: WaterData,
}

const SummaryTable = ({title, data} : Props) => {

    return (
        <div className="details-table">
            <span>{title}</span>
            <table>
                <tr>
                    <th>{data.variable.variableName}</th>
                </tr>
                <tr>
                    <td>{data.variable.values.at(-1)?.value}</td>
                </tr>

            </table>
        </div>
    )
}

export default SummaryTable;