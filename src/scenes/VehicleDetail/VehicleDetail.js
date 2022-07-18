import React, { useEffect, useRef, useState } from "react";
import VehicleProfile from "./components/VehicleProfile";
import { decodeUUID } from "../../utilities";
import { useDispatch, useSelector } from "react-redux";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@mui/material/Typography";
import { PaddedPaper } from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import UserChip from "../../components/UserChip";
import UserCard from "../../components/UserCard";
import {
    dataStoreModelSyncedStatusSelector,
    getWhoami,
} from "../../redux/Selectors";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import { protectedFields, userRoles } from "../../apiConsts";
import { Divider, Stack } from "@mui/material";
import RiderPicker from "../../components/RiderPicker";
import AssignUserToVehicle from "./AssignUserToVehicle";

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
    const [assignment, setAssignment] = useState(null);
    const whoami = useSelector(getWhoami);
    const vehicleUUID = decodeUUID(props.match.params.vehicle_uuid_b62);
    const vehicleModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Vehicle;
    const assignmentObserver = useRef({ unsubscribe: () => {} });

    async function newVehicleProfile() {
        try {
            const newVehicle = await DataStore.query(
                models.Vehicle,
                vehicleUUID
            );
            assignmentObserver.current = DataStore.observeQuery(
                models.VehicleAssignment
            ).subscribe(({ items }) => {
                // TODO: simplify this workaround when DataStore is updated
                const assignedUser = items.find(
                    (item) =>
                        (item.vehicle && item.vehicle.id === newVehicle.id) ||
                        item.vehicleAssignmentsId === newVehicle.id
                );
                if (assignedUser) {
                    DataStore.query(
                        models.VehicleAssignment,
                        assignedUser.id
                    ).then((ass) => {
                        if (ass) {
                            setAssignment(ass);
                        } else {
                            console.log("The assignment was not found");
                            setAssignment(null);
                        }
                    });
                } else {
                    setAssignment(null);
                }
            });
            setIsFetching(false);
            if (newVehicle) setVehicle(newVehicle);
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
            console.log("Vehicle updated failed:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPosting(false);
        }
    }

    async function onAssignUser(user) {
        setIsPosting(true);
        try {
            const result = await DataStore.save(
                new models.VehicleAssignment({
                    vehicle: vehicle,
                    assignee: user,
                })
            );
            setAssignment(result);
            setIsPosting(false);
        } catch (error) {
            console.log("Vehicle assignment failed:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPosting(false);
        }
    }

    async function handleDeleteAssignment() {
        setIsPosting(true);
        try {
            await DataStore.delete(assignment);
            setAssignment(null);
            setIsPosting(false);
        } catch (error) {
            console.log("Vehicle assignment deletion failed:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPosting(false);
        }
    }

    const canAssign =
        whoami.roles &&
        [userRoles.admin, userRoles.coordinator, userRoles.rider].some(
            (role) => whoami.roles && whoami.roles.includes(role)
        );

    if (isFetching) {
        return <FormSkeleton />;
    } else if (notFound) {
        return <NotFound>Vehicle {vehicleUUID} could not be found.</NotFound>;
    } else {
        return (
            <Stack spacing={3} direction={"column"}>
                <PaddedPaper maxWidth={700}>
                    <Stack divider={<Divider />} direction="column" spacing={3}>
                        <VehicleProfile onUpdate={onUpdate} vehicle={vehicle} />
                        <AssignUserToVehicle
                            assignment={assignment}
                            onAssignUser={onAssignUser}
                            handleDeleteAssignment={handleDeleteAssignment}
                            isPosting={isPosting}
                            canAssign={canAssign}
                        />
                    </Stack>
                </PaddedPaper>
                <CommentsSection parentId={vehicleUUID} />
            </Stack>
        );
    }
}
