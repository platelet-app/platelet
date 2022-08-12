import { decodeUUID } from "../../utilities";
import LocationDetail from "./components/LocationDetail";

export default function LocationDetailRoute(props) {
    const locationUUID = decodeUUID(props.match.params.location_uuid_b62);
    return <LocationDetail locationId={locationUUID} />;
}
