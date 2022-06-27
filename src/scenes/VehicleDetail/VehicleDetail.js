import React, { useEffect, useState } from "react";
import VehicleProfile from "./components/VehicleProfile";
import { decodeUUID } from "../../utilities";
import { useDispatch, useSelector } from "react-redux";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@mui/material/Typography";
import { PaddedPaper } from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import UserCard from "../../components/UserCard";
import {
    dataStoreModelSyncedStatusSelector,
    getWhoami,
} from "../../redux/Selectors";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import { protectedFields } from "../../apiConsts";
import { Stack } from "@mui/material";

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
    const [notFound, setNotFound] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [vehicle, setVehicle] = useState(initialVehicleState);
    const vehicleUUID = decodeUUID(props.match.params.vehicle_uuid_b62);
    const assignedUser = false;
    const vehicleModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Vehicle;

    async function newVehicleProfile() {
        try {
            const vehicle = await DataStore.query(models.Vehicle, vehicleUUID);
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
    useEffect(
        () => newVehicleProfile(),
        [props.location.key, vehicleModelSynced]
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
        return;
    }

    if (isFetching) {
        return <FormSkeleton />;
    } else if (notFound) {
        return <NotFound>Vehicle {vehicleUUID} could not be found.</NotFound>;
    } else {
        return (
            <Stack spacing={3} direction={"column"}>
                <PaddedPaper maxWidth={700}>
                    <VehicleProfile onUpdate={onUpdate} vehicle={vehicle} />
                </PaddedPaper>
                <PaddedPaper width={"400px"}>
                    <Stack
                        direction={"column"}
                        spacing={3}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                    >
                        <Typography variant={"h5"}>Assignee</Typography>
                        {assignedUser ? (
                            <UserCard user={assignedUser} />
                        ) : (
                            <Typography>No assignee.</Typography>
                        )}
                    </Stack>
                </PaddedPaper>
                <CommentsSection parentId={vehicleUUID} />
            </Stack>
        );
    }
}
