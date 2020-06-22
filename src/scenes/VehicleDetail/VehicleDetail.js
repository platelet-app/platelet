import React, {useEffect} from "react";
import VehicleProfile from "./components/VehicleProfile";
import {decodeUUID} from "../../utilities";
import {getVehicle, updateVehicle} from "../../redux/vehicles/VehiclesActions";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector, createNotFoundSelector} from "../../redux/selectors";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import NotFound from "../../ErrorComponenents/NotFound";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {PaddedPaper} from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import {setMenuIndex} from "../../redux/Actions";
import UserCard from "../../components/UserCard";
import Button from "@material-ui/core/Button";

export default function VehicleDetail(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_VEHICLE"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const notFoundSelector = createNotFoundSelector(["GET_VEHICLE"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const vehicleUUID = decodeUUID(props.match.params.vehicle_uuid_b62);
    const vehicle = useSelector(state => state.vehicle.vehicle);
    const assignedUser = useSelector(state => state.vehicle.vehicle.assigned_user);
    const whoami = useSelector(state => state.whoami.user);


    function componentDidMount() {
        dispatch(getVehicle(vehicleUUID));
    }
    useEffect(componentDidMount, [props.location.key]);

    useEffect(() => {
        dispatch(setMenuIndex(4))
    }, []);
    function onAssignUser(user) {
        if (user)
            dispatch(
                updateVehicle(
                    {vehicleUUID: vehicle.uuid, payload: {...vehicle, assigned_user: user, assigned_user_uuid: user.uuid}}
                    )
            );

    }
    const assignToMeButton =
        <Button disabled={vehicle.assigned_user_uuid === whoami.uuid} onClick={() => {
            onAssignUser(whoami)
        }}>
            Assign to me
        </Button>;


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
                                {assignedUser ?
                                    <UserCard user={assignedUser}/> :
                                    <Typography>No assignee.</Typography>
                                }
                            </Grid>
                            <Grid item>
                                {assignToMeButton}
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