import React, {useEffect} from "react";
import VehicleProfile from "../components/VehicleProfile";
import {decodeUUID} from "../utilities";
import {getVehicle} from "../redux/vehicles/VehiclesActions";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector, createNotFoundSelector} from "../redux/selectors";
import FormSkeleton from "../loadingComponents/FormSkeleton";
import NotFound from "../ErrorComponenents/NotFound";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {PaddedPaper} from "../css/common";
import CommentsSection from "./CommentsSection";
import {setMenuIndex} from "../redux/Actions";
import UserCard from "../components/UserCard";

export default function VehicleDetail(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_VEHICLE"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const notFoundSelector = createNotFoundSelector(["GET_VEHICLE"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const vehicleUUID = decodeUUID(props.match.params.vehicle_uuid_b62);
    const vehicle = useSelector(state => state.vehicle.vehicle);

    function componentDidMount() {
        dispatch(getVehicle(vehicleUUID));
    }
    useEffect(componentDidMount, [props.location.key]);

    useEffect(() => {
        dispatch(setMenuIndex(4))
    }, []);

    if (isFetching) {
        return (
            <FormSkeleton/>
        )
    } else if (notFound) {
        return <NotFound><Typography>Vehicle {vehicleUUID} could not be found.</Typography></NotFound>
    } else {
        return (
            <Grid container spacing={3} direction={"column"}>
                <Grid item>
                    <VehicleProfile vehicle={vehicle}/>
                </Grid>
                <Grid item>
                    <PaddedPaper width={"400px"}>
                        <Grid container direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
                            <Grid item>
                                <Typography variant={"h5"}>Assignee</Typography>
                            </Grid>
                            <Grid item>
                                {vehicle.assigned_user ?
                                    <UserCard user={vehicle.assigned_user}/> :
                                    <Typography>No assignee.</Typography>
                                }
                            </Grid>
                        </Grid>
                    </PaddedPaper>
                </Grid>
                <Grid item>
                    <PaddedPaper width={"400px"}>
                        <CommentsSection parentUUID={vehicleUUID}/>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}