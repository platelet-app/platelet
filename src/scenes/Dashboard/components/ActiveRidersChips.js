import React, { useRef, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { useSelector } from "react-redux";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import { tasksStatus, userRoles } from "../../../apiConsts";
import { convertListDataToObject } from "../../../utilities";
import { Avatar, Chip, Stack } from "@mui/material";
import _ from "lodash";

function ActiveRidersChips() {
    const [activeRiders, setActiveRiders] = useState({});
    const tasksObserver = useRef({ unsubscribe: () => {} });
    const assignmentsObserver = useRef({ unsubscribe: () => {} });
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    async function getActiveRiders() {
        if (!dataStoreReadyStatus) return;
        const assignments = await DataStore.query(models.TaskAssignee, (a) =>
            a.role("eq", userRoles.rider)
        );
        const activeRidersFiltered = assignments
            .filter(
                (assignment) =>
                    assignment.task &&
                    assignment.task.status !== tasksStatus.droppedOff
            )
            .map((a) => a.assignee);
        setActiveRiders(convertListDataToObject(activeRidersFiltered));
        tasksObserver.current.unsubscribe();
        tasksObserver.current = DataStore.observe(models.Task).subscribe(
            async (observeResult) => {
                const taskData = observeResult.element;
                if (observeResult.opType === "INSERT") {
                } else if (observeResult.opType === "UPDATE") {
                    // if the task status is completed then we should check and see if the rider is still active on other tasks
                    if (taskData.status === tasksStatus.completed) {
                        // get all the assignees on this task
                        const assignees = (
                            await DataStore.query(models.TaskAssignee, (a) =>
                                a.role("eq", userRoles.rider)
                            )
                        )
                            .filter((a) => a.task && a.task.id === taskData.id)
                            .map((a) => a.assignee);
                        // if there are none don't do anything
                        if (assignees.length === 0) return;
                        // for each assignee get all their tasks
                        for (const rider of assignees) {
                            const ridersTasks = (
                                await DataStore.query(
                                    models.TaskAssignee,
                                    (a) => a.role("eq", userRoles.rider)
                                )
                            )
                                .filter(
                                    (a) =>
                                        a.assignee && a.assignee.id === rider.id
                                )
                                .map((a) => a.task);
                            const activeTasks = ridersTasks.filter(
                                (t) =>
                                    ![
                                        tasksStatus.completed,
                                        tasksStatus.cancelled,
                                        tasksStatus.rejected,
                                        tasksStatus.new,
                                    ].includes(t.status)
                            );
                            // if there are no more tasks that aren't completed, remove the rider from the active riders list
                            if (activeTasks.length === 0) {
                                setActiveRiders((prevState) =>
                                    _.omit(prevState, rider.id)
                                );
                            } else {
                                // else make sure they're in the list
                                if (!activeRiders[rider.id]) {
                                    setActiveRiders((prevState) => ({
                                        ...prevState,
                                        [rider.id]: rider,
                                    }));
                                }
                            }
                        }
                    }
                } else if (observeResult.opType === "DELETE") {
                }
            }
        );
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
                })
            );
        }
    }

    return (
        <Stack sx={{ padding: 1 }} direction={"row"} spacing={2}>
            {Object.values(activeRiders).map((rider) => {
                if (rider.profilePictureThumbnailURL) {
                    return (
                        <Chip
                            key={rider.id}
                            onClick={() => updateRiderHome(rider.id)}
                            avatar={
                                <Avatar
                                    alt={rider.displayName}
                                    src={rider.profilePictureThumbnailURL}
                                />
                            }
                            label={rider.displayName}
                        />
                    );
                } else {
                    return (
                        <Chip
                            onClick={() => updateRiderHome(rider.id)}
                            key={rider.id}
                            label={rider.name}
                        />
                    );
                }
            })}
        </Stack>
    );
}

export default ActiveRidersChips;
