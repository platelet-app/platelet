import React, { useEffect, useRef, useState } from "react";
import { Paper, Stack, Tooltip, Typography } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import makeStyles from "@mui/styles/makeStyles";
import { userRoles } from "../../../apiConsts";
import RiderPicker from "../../../components/RiderPicker";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserRoleSelect from "../../../components/UserRoleSelect";
import TaskAssignees from "./TaskAssignees";
import UserAvatar from "../../../components/UserAvatar";
import CollapsibleToggle from "../../../components/CollapsibleToggle";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import {
    convertListDataToObject,
    determineTaskStatus,
} from "../../../utilities";
import { useDispatch } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import _ from "lodash";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

function TaskAssignmentsPanel(props) {
    const [collapsed, setCollapsed] = useState(true);
    const [assigneesDisplayString, setAssigneesDisplayString] = useState(null);
    const [role, setRole] = useState(userRoles.rider);
    const deleting = useRef(false);
    const [state, setState] = useState([]);
    const dispatch = useDispatch();
    const errorMessage = "Sorry, an error occurred";

    function onSelect(value) {
        if (value) addAssignee(value, role);
        clearEditMode();
    }

    function clearEditMode() {
        setCollapsed(true);
        setRole(userRoles.rider);
    }

    async function getAssignees() {
        try {
            const result = (await DataStore.query(models.TaskAssignee)).filter(
                (assignee) => assignee.task && assignee.task.id === props.taskId
            );
            setState(convertListDataToObject(result));
        } catch (e) {
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    useEffect(() => {
        getAssignees();
    }, [props.taskId]);

    async function addAssignee(user, role) {
        try {
            const assignee = await DataStore.query(models.User, user.id);
            const task = await DataStore.query(models.Task, props.taskId);
            if (!assignee || !task)
                throw new Error(
                    `Can't find assignee or task: ${props.taskId}, userId: ${user.id}`
                );
            const result = await DataStore.save(
                new models.TaskAssignee({
                    assignee,
                    task,
                    role,
                })
            );
            let riderResponsibility;
            if (role === userRoles.rider) {
                if (user.riderResponsibility) {
                    riderResponsibility = await DataStore.query(
                        models.RiderResponsibility,
                        user.riderResponsibility.id
                    );
                }
                const taskResult = await DataStore.query(
                    models.Task,
                    props.taskId
                );
                if (!taskResult) throw new Error("Task doesn't exist");
                const status = determineTaskStatus({
                    ...taskResult,
                    assignees: [result],
                });
                await DataStore.save(
                    models.Task.copyOf(taskResult, (updated) => {
                        updated.status = status;
                        if (riderResponsibility)
                            updated.riderResponsibility = riderResponsibility;
                    })
                );
            }
            setState({ ...state, [result.id]: result });
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function deleteAssignment(assignmentId) {
        try {
            if (!assignmentId) throw new Error("Assignment ID not provided");
            const existingTask = await DataStore.query(
                models.Task,
                props.taskId
            );
            if (!existingTask) throw new Error("Task doesn't exist");
            const existingAssignment = await DataStore.query(
                models.TaskAssignee,
                assignmentId
            );
            if (
                existingAssignment &&
                existingAssignment.role === userRoles.rider
            ) {
                let riderResponsibility = null;
                const riders = Object.values(state).filter(
                    (a) => a.role === userRoles.rider && a.id !== assignmentId
                );
                if (riders.length > 0) {
                    const rider = riders[riders.length - 1];
                    if (rider.userRiderResponsibilityId) {
                        riderResponsibility = await DataStore.query(
                            models.RiderResponsibility,
                            rider.userRiderResponsibilityId
                        );
                    }
                }
                await DataStore.save(
                    models.Task.copyOf(existingTask, (updated) => {
                        updated.riderResponsibility = riderResponsibility;
                    })
                );
            }
            if (existingAssignment) await DataStore.delete(existingAssignment);
            const status = determineTaskStatus({
                ...existingTask,
                assignees: _.omit(state, assignmentId),
            });
            await DataStore.save(
                models.Task.copyOf(existingTask, (updated) => {
                    updated.status = status;
                })
            );
            setState((prevState) => _.omit(prevState, assignmentId));
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    useEffect(() => {
        if (deleting.current) {
            deleting.current = false;
            return;
        }
        if (
            Object.values(state).filter((a) => a.role === userRoles.rider)
                .length === 0
        )
            setCollapsed(false);
        else setCollapsed(true);
    }, [state]);

    useEffect(() => {
        if (Object.values(state).length === 0) {
            setAssigneesDisplayString(null);
        } else {
            const assigneesDisplayString = Object.values(state)
                .sort((a, b) => {
                    return a.role < b.role;
                })
                .map((a) => (a.assignee ? a.assignee.displayName : ""))
                .join(", ");
            setAssigneesDisplayString(assigneesDisplayString);
        }
    }, [state]);

    const assigneeSelector = !collapsed ? (
        <>
            <TaskAssignees
                onRemove={(v) => {
                    deleting.current = true;
                    deleteAssignment(v);
                }}
                assignees={state}
            />
            <Typography>Assign a user:</Typography>
            <UserRoleSelect
                value={role}
                onSelect={(value) => setRole(value)}
                exclude={Object.values(userRoles).filter(
                    (value) =>
                        ![userRoles.rider, userRoles.coordinator].includes(
                            value
                        )
                )}
            />
            {role === userRoles.rider ? (
                <RiderPicker
                    onSelect={onSelect}
                    exclude={Object.values(state)
                        .filter((a) => a && a.role === userRoles.rider)
                        .map((a) => a.assignee.id)}
                />
            ) : (
                <CoordinatorPicker
                    onSelect={onSelect}
                    exclude={Object.values(state)
                        .filter((a) => a && a.role === userRoles.coordinator)
                        .map((a) => a.assignee.id)}
                />
            )}
        </>
    ) : (
        <></>
    );

    return (
        <Paper sx={{ padding: 1 }}>
            <Stack direction="column" spacing={2}>
                <Typography>People assigned to this task:</Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent={"space-between"}
                >
                    <Tooltip title={assigneesDisplayString}>
                        <AvatarGroup>
                            {Object.values(state).map((u) => {
                                const user = u.assignee || null;
                                if (user) {
                                    return (
                                        <UserAvatar
                                            key={user.id}
                                            size={4}
                                            userUUID={user.id}
                                            displayName={user.displayName}
                                            avatarURL={
                                                user.profilePictureThumbnailURL
                                            }
                                        />
                                    );
                                } else {
                                    return <></>;
                                }
                            })}
                        </AvatarGroup>
                    </Tooltip>
                </Stack>
                {assigneeSelector}
                <CollapsibleToggle
                    onClick={() => setCollapsed((prevState) => !prevState)}
                    value={collapsed}
                />
            </Stack>
        </Paper>
    );
}

export default TaskAssignmentsPanel;
