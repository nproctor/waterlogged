import {WaterData, WaterStatistic} from '@/app/types/types'
import { getColorFromPercentile, getPercentile } from '@/app/scripts/interpolate'


interface Props {
    todaysValues: WaterData,
    todaysStats: WaterStatistic
}

const SiteOverview = ({todaysValues, todaysStats} : Props) => {
    const percentile = getPercentile(todaysValues.variable.values.at(-1)?.value, todaysStats);
    return (
        <div className="details-site-overview">
            <h1 className="name">{todaysValues.name}</h1>
            <div className="geolocation">
                <p>Latitude: {todaysValues.geoLocation.latitude}</p>
                <p>Longitude: {todaysValues.geoLocation.longitude}</p>
            </div>
            <table>
                <tr>
                    <th>Last Updated</th>
                    <th>{todaysValues.variable.variableName}</th>
                    <th>Approximated Percentile</th>
                </tr>
                <tr>
                    <td>{todaysValues.variable.values.at(-1)?.dateTime.toLocaleString()}</td>
                    <td>{todaysValues.variable.values.at(-1)?.value}</td>
                    <td style={{color: getColorFromPercentile(percentile)}}>{percentile?.toFixed(1)}</td>
                </tr>
            </table>
        </div>
    );
}

export default SiteOverview