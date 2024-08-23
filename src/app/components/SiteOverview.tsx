import {WaterData, WaterStatisticValue} from '@/app/types/types'
import { getColorFromPercentile, getPercentile } from '@/app/scripts/interpolate'


interface Props {
    todaysValues: WaterData,
    todaysStats: WaterStatisticValue[]
}

const SiteOverview = ({todaysValues, todaysStats} : Props) => {
    const recentValue = todaysValues.variable.values.at(-1)?.value;
    const percentile = recentValue ? getPercentile(recentValue, todaysStats) : undefined;
    return (
        <div className="details-site-overview">
            <h1 className="name">{todaysValues.name}</h1>
            <div className="geolocation">
                <p>Latitude: {todaysValues.geoLocation.latitude}</p>
                <p>Longitude: {todaysValues.geoLocation.longitude}</p>
            </div>
            <br></br>
            <span className="section-title">Current Value:</span>
            <table className="details-site-overview details-site-overview-table">
                <tbody>
                    <tr>
                        <th>Last Updated</th>
                        <th>{todaysValues.variable.variableName}</th>
                        <th>Percentile</th>
                    </tr>
                    <tr>
                        <td>{todaysValues.variable.values.at(-1)?.dateTime.toLocaleString()}</td>
                        <td>{todaysValues.variable.values.at(-1)?.value}</td>
                        <td style={{background: getColorFromPercentile(percentile) }}>{percentile?.toFixed(1)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default SiteOverview