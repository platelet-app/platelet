import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {getVehicle} from "../redux/Actions";
import {decodeUUID} from "../utilities";
import { useDispatch, useSelector } from "react-redux";
import {TextFieldControlled} from "../components/TextFieldControlled";
import Box from "@material-ui/core/Box";
import {createLoadingSelector} from "../redux/selectors";
import FormSkeleton from "../loadingComponents/FormSkeleton";

function VehicleDetail(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_VEHICLE"]);
    const isFetching = useSelector(state => loadingSelector(state));
    function componentDidMount() {
        dispatch(getVehicle(decodeUUID(props.match.params.vehicle_uuid_b62)));
    }

    useEffect(componentDidMount, []);
    const vehicle = useSelector(state => state.vehicle);
    if (isFetching) {
        return (
            <FormSkeleton/>
        )
    }
    else {
        return (
            <>
                <TextFieldControlled
                    value={vehicle.name}
                    label={"Name"}
                    id={"vehicle-name"}
                    onSelect={() => {
                    }}/>
                <TextFieldControlled
                    value={vehicle.manufacturer}
                    label={"Manufacturer"}
                    id={"vehicle-manufacturer"}
                    onSelect={() => {
                    }}/>
                <TextFieldControlled
                    value={vehicle.model}
                    label={"Model"}
                    id={"vehicle-model"}
                    onSelect={() => {
                    }}/>
                <TextFieldControlled
                    value={vehicle.registration_number}
                    label={"Registration"}
                    id={"vehicle-registration"}
                    onSelect={() => {
                    }}/>
            </>
        )
    }


}


export default VehicleDetail
