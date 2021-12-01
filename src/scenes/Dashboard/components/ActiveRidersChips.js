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
                    //change to completed
                    if (taskData.status === tasksStatus.droppedOff) {
                        const assignees = (
                            await DataStore.query(models.TaskAssignee, (a) =>
                                a.role("eq", userRoles.rider)
                            )
                        )
                            .filter((a) => a.task && a.task.id === taskData.id)
                            .map((a) => a.assignee);
                        if (assignees.length === 0) return;
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
                                        tasksStatus.droppedOff,
                                        tasksStatus.cancelled,
                                        tasksStatus.rejected,
                                        tasksStatus.new,
                                    ].includes(t.status)
                            );
                            console.log(activeTasks);
                            if (activeTasks.length === 0) {
                                setActiveRiders((prevState) =>
                                    _.omit(prevState, rider.id)
                                );
                            } else {
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
            console.log(observeResult);
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
    useEffect(() => console.log(activeRiders), [activeRiders]);
    return (
        <Stack sx={{ padding: 1 }} direction={"row"} spacing={2}>
            {Object.values(activeRiders).map((rider) => {
                if (rider.profilePictureThumbnailURL) {
                    return (
                        <Chip
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
                    return <Chip key={rider.id} label={rider.name} />;
                }
            })}
        </Stack>
    );
}

export default ActiveRidersChips;
