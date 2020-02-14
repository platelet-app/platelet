import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getVehicle} from "../redux/Actions";
import {decodeUUID} from "../utilities";
import { useDispatch, useSelector } from "react-redux";

function VehicleDetail(props) {
    const dispatch = useDispatch();
    function componentDidMount() {
        //const vehicleResult = props.tasks.filter(task => task.uuid === decodeUUID(props.match.params.task_id));
        dispatch(getVehicle(decodeUUID(props.match.params.vehicle_id)));
    }

    useEffect(componentDidMount, []);
    const vehicle = useSelector(state => state.vehicle);
    console.log(vehicle)
    if (vehicle) {
        return (
            <>
                <br>
                </br>
                <br>
                </br>
                <br>
                </br>
                {vehicle.name}
            </>
        )
    }
    else {
        return (
            <>

            <br>
            </br>
            <br>
            </br>
        <br>
        </br>
                </>
    )
    }


}


export default VehicleDetail
