import React, { useRef, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { useSelector } from "react-redux";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { convertListDataToObject } from "../../../utilities";
import { Avatar, Chip, Stack } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Slide from "@mui/material/Slide";
import _ from "lodash";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import RiderConfirmationHomeContents from "./RiderConfirmationHomeContents";

async function calculateRidersStatus() {
    console.log("calculating active riders");
    const assignments = await DataStore.query(models.TaskAssignee, (a) =>
        a.role("eq", userRoles.rider)
    );
    const activeRidersFiltered = assignments
        .filter(
            (assignment) =>
                assignment.task &&
                assignment.task.status !== tasksStatus.completed
        )
        .map((a) => a.assignee);
    return convertListDataToObject(activeRidersFiltered);
}

function ActiveRidersChips() {
    const [activeRiders, setActiveRiders] = useState({});
    const [updatingRider, setUpdatingRider] = useState(null);
    const timeSet = useRef(null);
    const tasksObserver = useRef({ unsubscribe: () => {} });
    const assignmentsObserver = useRef({ unsubscribe: () => {} });
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const animate = useRef(false);

    // debounce the call because multiple tasks are being updated at once
    const debouncedCalculateRidersStatus = _.debounce(
        async () => setActiveRiders(await calculateRidersStatus()),
        1000
    );

    async function getActiveRiders() {
        if (!dataStoreReadyStatus) return;
        setActiveRiders(await calculateRidersStatus());
        tasksObserver.current.unsubscribe();
        tasksObserver.current = DataStore.observe(models.Task).subscribe(
            async (observeResult) => {
                const task = observeResult.element;
                if (task.status === tasksStatus.completed) {
                    debouncedCalculateRidersStatus();
                }
            }
        );
        animate.current = true;
        assignmentsObserver.current.unsubscribe();
        assignmentsObserver.current = DataStore.observe(
            models.TaskAssignee
        ).subscribe(async (observeResult) => {
            const taskAssigneeData = observeResult.element;
            if (observeResult.opType === "INSERT") {
                const task = await DataStore.query(
                    models.Task,
                    taskAssigneeData.taskId
                );
                const user = await DataStore.query(
                    models.User,
                    taskAssigneeData.assigneeId
                );
                if (
                    task &&
                    taskAssigneeData.role === userRoles.rider &&
                    ![
                        tasksStatus.droppedOff,
                        tasksStatus.cancelled,
                        tasksStatus.rejected,
                    ].includes(task.status)
                ) {
                    if (user) {
                        setActiveRiders((prevState) => ({
                            ...prevState,
                            [user.id]: user,
                        }));
                    }
                }
            }
        });
    }

    useEffect(() => {
        getActiveRiders();
    }, [dataStoreReadyStatus]);

    async function updateRiderHome(userId) {
        console.log("updating rider home", userId);
        const allRiderAssignedTasks = (
            await DataStore.query(models.TaskAssignee, (a) =>
                a.role("eq", userRoles.rider)
            )
        ).filter((a) => a.assignee && a.assignee.id === userId);
        const tasksToUpdate = allRiderAssignedTasks
            .map((a) => a.task)
            .filter((t) => t.status === tasksStatus.droppedOff);
        // for every task in the list, update the task status to completed
        for (const task of tasksToUpdate) {
            await DataStore.save(
                models.Task.copyOf(task, (updated) => {
                    updated.status = tasksStatus.completed;
                    updated.timeRiderHome = timeSet.current.toISOString();
                })
            );
        }
    }

    return (
        <React.Fragment>
            <ConfirmationDialog
                onClose={() => setUpdatingRider(null)}
                onSelect={(result) => {
                    if (result && timeSet.current)
                        updateRiderHome(updatingRider);
                }}
                open={!!updatingRider}
            >
                {updatingRider && (
                    <RiderConfirmationHomeContents
                        onChangeTimeHome={(time) => (timeSet.current = time)}
                        userId={updatingRider}
                    />
                )}
            </ConfirmationDialog>
            <Stack sx={{ padding: 1 }} direction={"row"} spacing={2}>
                <TransitionGroup>
                    {Object.values(activeRiders).map((rider) => {
                        if (rider.profilePictureThumbnailURL) {
                            return (
                                <Slide
                                    key={rider.id}
                                    direction="right"
                                    timeout={animate.current ? 100 : 0}
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <Chip
                                        sx={{ marginRight: 1 }}
                                        onClick={() => {
                                            setUpdatingRider(rider.id);
                                            timeSet.current = new Date();
                                        }}
                                        avatar={
                                            <Avatar
                                                alt={rider.displayName}
                                                src={
                                                    rider.profilePictureThumbnailURL
                                                }
                                            />
                                        }
                                        label={rider.displayName}
                                    />
                                </Slide>
                            );
                        } else {
                            return (
                                <Slide
                                    key={rider.id}
                                    timeout={animate.current ? 100 : 0}
                                    direction="right"
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <Chip
                                        sx={{ marginRight: 1 }}
                                        onClick={() => {
                                            setUpdatingRider(rider.id);
                                            timeSet.current = new Date();
                                        }}
                                        key={rider.id}
                                        label={rider.name}
                                    />
                                </Slide>
                            );
                        }
                    })}
                </TransitionGroup>
            </Stack>
        </React.Fragment>
    );
}

export default ActiveRidersChips;
