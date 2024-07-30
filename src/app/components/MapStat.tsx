import { WaterData } from '@/app/types/types'
import Link from 'next/link';

interface Props {
    data : WaterData;
}

const MapStat = ({data}: Props) => {
    return (
        <div>
            <Link href={`/details/${encodeURIComponent(data.id)}`}>
                <b>{data.name}</b>
            </Link>
            <table className="leaflet-popup-table-stats">
                <tr key={data.variable.oid}>
                    <td><b>{data.variable.variableName}</b></td>
                    <td>{data.variable.values[0].value}</td>
                </tr>
            </table>
        </div>
    )
}

export default MapStat;