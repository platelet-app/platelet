import React, { useEffect, useState } from "react";
import VehicleProfile from "./components/VehicleProfile";
import { decodeUUID } from "../../utilities";
import {
    getVehicleRequest,
    updateVehicleRequest,
} from "../../redux/vehicles/VehiclesActions";
import { useDispatch, useSelector } from "react-redux";
import {
    createLoadingSelector,
    createNotFoundSelector,
} from "../../redux/LoadingSelectors";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { PaddedPaper } from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import UserCard from "../../components/UserCard";
import Button from "@mui/material/Button";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { DataStore } from "@aws-amplify/datastore";
import { protectedFields } from "../../apiConsts";

const initialVehicleState = {
    name: "",
    manufacturer: "",
    model: "",
    dateOfManufacture: null,
    dateOfRegistration: null,
};

export default function VehicleDetail(props) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [vehicle, setVehicle] = useState(initialVehicleState);
    const vehicleUUID = decodeUUID(props.match.params.vehicle_uuid_b62);
    const whoami = useSelector(getWhoami);
    const assignedUser = false;

    async function newVehicleProfile() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const vehicle = await DataStore.query(
                    models.Vehicle,
                    vehicleUUID
                );
                setIsFetching(false);
                if (vehicle) setVehicle(vehicle);
                else setNotFound(true);
            } catch (error) {
                setIsFetching(false);
                dispatch(
                    displayErrorNotification(
                        `Failed to get vehicle: ${error.message}`
                    )
                );
                console.log("Request failed", error);
            }
        }
    }
    useEffect(
        () => newVehicleProfile(),
        [props.location.key, dataStoreReadyStatus]
    );

    async function onUpdate(value) {
        setIsPosting(true);
        try {
            const existingVehicle = await DataStore.query(
                models.Vehicle,
                vehicle.id
            );
            await DataStore.save(
                models.Vehicle.copyOf(existingVehicle, (updated) => {
                    for (const [key, newValue] of Object.entries(value)) {
                        if (!protectedFields.includes(key))
                            updated[key] = newValue;
                    }
                })
            );
            setIsPosting(false);
        } catch (error) {
            console.log("Update request failed", error);
            dispatch(displayErrorNotification(error.message));
            setIsPosting(false);
        }
    }

    function onAssignUser(user) {
        if (user)
            dispatch(
                updateVehicleRequest(vehicle.uuid, {
                    ...vehicle,
                    assigned_user: user,
                    assigned_user_uuid: user.uuid,
                })
            );
    }
    const assignToMeButton = (
        <Button
            disabled={vehicle.assigned_user_uuid === whoami.id}
            onClick={() => {
                onAssignUser(whoami);
            }}
        >
            Assign to me
        </Button>
    );

    if (isFetching) {
        return <FormSkeleton />;
    } else if (notFound) {
        return <NotFound>Vehicle {vehicleUUID} could not be found.</NotFound>;
    } else {
        return (
            <Grid container spacing={3} direction={"column"}>
                <Grid item>
                    <PaddedPaper>
                        <VehicleProfile onUpdate={onUpdate} vehicle={vehicle} />
                    </PaddedPaper>
                </Grid>
                <Grid item>
                    <PaddedPaper width={"400px"}>
                        <Grid
                            container
                            direction={"column"}
                            spacing={3}
                            justify={"center"}
                            alignItems={"flex-start"}
                        >
                            <Grid item>
                                <Typography variant={"h5"}>Assignee</Typography>
                            </Grid>
                            <Grid item>
                                {assignedUser ? (
                                    <UserCard user={assignedUser} />
                                ) : (
                                    <Typography>No assignee.</Typography>
                                )}
                            </Grid>
                            <Grid item>{assignToMeButton}</Grid>
                        </Grid>
                    </PaddedPaper>
                </Grid>
                <Grid item>
                    <CommentsSection parentUUID={vehicleUUID} />
                </Grid>
            </Grid>
        );
    }
}
