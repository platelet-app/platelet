import React, { useEffect, useRef, useState } from "react";
import VehicleProfile from "./VehicleProfile";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "../../../ErrorComponents/NotFound";
import { PaddedPaper } from "../../../styles/common";
import CommentsSection from "../../Comments/CommentsSection";
import {
    dataStoreModelSyncedStatusSelector,
    getWhoami,
    tenantIdSelector,
} from "../../../redux/Selectors";
import * as models from "../../../models/index";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import { protectedFields, userRoles } from "../../../apiConsts";
import { Divider, Stack, Skeleton } from "@mui/material";
import AssignUserToVehicle from "./AssignUserToVehicle";

const initialVehicleState = {
    name: "",
    manufacturer: "",
    model: "",
    dateOfManufacture: null,
    dateOfRegistration: null,
};

export default function VehicleDetail({ vehicleId }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const tenantId = useSelector(tenantIdSelector);
    const [vehicle, setVehicle] = useState(initialVehicleState);
    const [assignment, setAssignment] = useState(null);
    const whoami = useSelector(getWhoami);
    const vehicleModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Vehicle;
    const assignmentObserver = useRef({ unsubscribe: () => {} });
    const vehicleObserver = useRef({ unsubscribe: () => {} });

    const newVehicleProfile = React.useCallback(
        async (vehicleId) => {
            try {
                const newVehicle = await DataStore.query(
                    models.Vehicle,
                    vehicleId
                );
                vehicleObserver.current.unsubscribe();
                vehicleObserver.current = DataStore.observe(
                    models.Vehicle,
                    vehicleId
                ).subscribe(({ element }) => {
                    setVehicle(element);
                });
                assignmentObserver.current.unsubscribe();
                assignmentObserver.current = DataStore.observeQuery(
                    models.VehicleAssignment
                ).subscribe(({ items }) => {
                    // TODO: simplify this workaround when DataStore is updated
                    const assignedUser = items.find(
                        (item) =>
                            (item.vehicle &&
                                item.vehicle.id === newVehicle.id) ||
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
        },
        [dispatch]
    );
    useEffect(
        () => newVehicleProfile(vehicleId),
        [vehicleId, vehicleModelSynced, newVehicleProfile]
    );

    useEffect(() => {
        return () => {
            assignmentObserver.current.unsubscribe();
            vehicleObserver.current.unsubscribe();
        };
    }, []);

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
            console.log("Vehicle update failed:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPosting(false);
        }
    }

    async function onAssignUser(user) {
        setIsPosting(true);
        try {
            if (!tenantId) throw new Error("Tenant ID is not set");
            if (!user) throw new Error("User is not set");
            if (!vehicle) throw new Error("Vehicle is not set");
            const result = await DataStore.save(
                new models.VehicleAssignment({
                    vehicle: vehicle,
                    assignee: user,
                    tenantId,
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
        return (
            <React.Fragment>
                <PaddedPaper maxWidth={700}>
                    <Stack direction={"column"} spacing={3}>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                        >
                            <Skeleton variant="text" width={300} height={50} />
                        </Stack>
                        <Divider />
                        <Stack
                            direction={"column"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                            maxWidth={700}
                        >
                            <Skeleton
                                variant="text"
                                maxWidth={700}
                                height={50}
                            />
                            <Skeleton
                                variant="text"
                                maxWidth={700}
                                height={50}
                            />
                            <Skeleton
                                variant="text"
                                maxWidth={700}
                                height={50}
                            />
                        </Stack>
                    </Stack>
                </PaddedPaper>
                <Stack height={50}></Stack>
                <PaddedPaper maxWidth={300}>
                    <Skeleton variant="text" MaxWidth={700} height={50} />
                </PaddedPaper>
                <Stack height={50}></Stack>
                <PaddedPaper maxWidth={850}>
                    <Stack direction={"row"} spacing={3}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={200} height={50} />
                    </Stack>
                    <Stack direction={"column"} spacing={3}>
                        <Skeleton variant="text" MaxWidth={700} height={50} />
                    </Stack>
                </PaddedPaper>
            </React.Fragment>
        );
    } else if (notFound) {
        return <NotFound>Vehicle {vehicleId} could not be found.</NotFound>;
    } else {
        return (
            <Stack spacing={3} direction={"column"}>
                <PaddedPaper maxWidth={700}>
                    <Stack divider={<Divider />} direction="column" spacing={3}>
                        <VehicleProfile
                            key={vehicle.id}
                            onUpdate={onUpdate}
                            vehicle={vehicle}
                        />
                        <AssignUserToVehicle
                            assignment={assignment}
                            onAssignUser={onAssignUser}
                            handleDeleteAssignment={handleDeleteAssignment}
                            isPosting={isPosting}
                            canAssign={canAssign}
                        />
                    </Stack>
                </PaddedPaper>
                <CommentsSection parentId={vehicleId} />
            </Stack>
        );
    }
}
