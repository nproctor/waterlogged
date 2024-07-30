import {WaterData} from '@/app/types/types'


interface Props {
    data: WaterData;
}

const SiteDetailHeader = ({data} : Props) => {
    return (
        <div className="details-site-overview">
            <h1 className="name">{data.name}</h1>
            <div className="geolocation">
                <p>Latitude: {data.geoLocation.latitude}</p>
                <p>Longitude: {data.geoLocation.longitude}</p>
            </div>
        </div>
    );
}

export default SiteDetailHeader