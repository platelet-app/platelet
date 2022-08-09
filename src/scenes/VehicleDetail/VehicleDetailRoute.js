import React from "react";
import { decodeUUID } from "../../utilities";
import VehicleDetail from "./components/VehicleDetail";

export default function VehicleDetailRoute(props) {
    const vehicleId = decodeUUID(props.match.params.vehicle_uuid_b62);
    return <VehicleDetail vehicleId={vehicleId} />;
}
