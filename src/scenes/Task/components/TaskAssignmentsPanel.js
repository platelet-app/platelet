import React, { useEffect, useRef, useState } from "react";
import {
    Divider,
    Paper,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import AvatarGroup from "@mui/material/AvatarGroup";
import makeStyles from "@mui/styles/makeStyles";
import { tasksStatus, userRoles } from "../../../apiConsts";
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
import { useDispatch, useSelector } from "react-redux";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import _ from "lodash";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

// function to sort by user role
const sortByUserRole = (a, b) => {
    if (a.role === b.userRole) {
        return 0;
    }
    if (a.role === userRoles.rider) {
        return -1;
    }
    if (b.role === userRoles.rider) {
        return 1;
    }
    if (a.role === userRoles.coordinator) {
        return -1;
    }
    if (b.role === userRoles.coordinator) {
        return 1;
    }
    return 0;
};

function TaskAssignmentsPanel(props) {
    const [collapsed, setCollapsed] = useState(true);
    const [assigneesDisplayString, setAssigneesDisplayString] = useState("");
    const [role, setRole] = useState(userRoles.rider);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const deleting = useRef(false);
    const [state, setState] = useState({});
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
        setIsFetching(true);
        if (!dataStoreReadyStatus) return;
        try {
            const result = (await DataStore.query(models.TaskAssignee)).filter(
                (assignee) => assignee.task && assignee.task.id === props.taskId
            );
            setState(convertListDataToObject(result));
            setIsFetching(false);
        } catch (e) {
            console.error(e);
            setErrorState(true);
            setIsFetching(false);
        }
    }
    useEffect(() => {
        getAssignees();
    }, [props.taskId, dataStoreReadyStatus]);

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
                const status = determineTaskStatus({
                    ...task,
                    assignees: [result],
                });
                await DataStore.save(
                    models.Task.copyOf(task, (updated) => {
                        updated.status = status;
                        if (riderResponsibility)
                            updated.riderResponsibility = riderResponsibility;
                    })
                );
                if (
                    task.status === tasksStatus.new &&
                    status === tasksStatus.active
                ) {
                    dispatch(displayInfoNotification("Task moved to ACTIVE"));
                }
            }
            setState({ ...state, [result.id]: result });
        } catch (error) {
            console.log(error);
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
                const riders = Object.values(state)
                    .filter(
                        (a) =>
                            a.role === userRoles.rider && a.id !== assignmentId
                    )
                    .map((a) => a.assignee);
                if (riders.length > 0) {
                    const rider = riders[riders.length - 1];
                    if (rider && rider.userRiderResponsibilityId) {
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
            setAssigneesDisplayString("");
        } else {
            const assigneesDisplayString = Object.values(state)
                .sort(sortByUserRole)
                .map((a) => (a.assignee ? a.assignee.displayName : ""))
                .join(", ");
            setAssigneesDisplayString(assigneesDisplayString);
        }
    }, [state]);

    const assigneeSelector =
        !collapsed && !isFetching ? (
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
                            .filter(
                                (a) =>
                                    a &&
                                    a.assignee &&
                                    a.role === userRoles.rider
                            )
                            .map((a) => a.assignee.id)}
                    />
                ) : (
                    <CoordinatorPicker
                        onSelect={onSelect}
                        exclude={Object.values(state)
                            .filter(
                                (a) =>
                                    a &&
                                    a.assignee &&
                                    a.role === userRoles.coordinator
                            )
                            .map((a) => a.assignee.id)}
                    />
                )}
            </>
        ) : (
            <></>
        );

    if (errorState) {
        return <GetError />;
    } else {
        return (
            <Paper sx={{ padding: 1 }}>
                <Stack direction="column" spacing={2}>
                    <Typography variant={"h6"}>
                        People assigned to this task
                    </Typography>
                    <Divider />
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent={"space-between"}
                    >
                        <Tooltip title={assigneesDisplayString}>
                            {isFetching ? (
                                <Skeleton
                                    variant={"rectangular"}
                                    width={"100%"}
                                    height={40}
                                />
                            ) : (
                                <AvatarGroup>
                                    {Object.values(state)
                                        .sort(sortByUserRole)
                                        .map((assignment) => {
                                            if (
                                                assignment &&
                                                assignment.assignee
                                            ) {
                                                const user =
                                                    assignment.assignee;
                                                return (
                                                    <UserAvatar
                                                        key={user.id}
                                                        size={4}
                                                        userUUID={user.id}
                                                        displayName={
                                                            user.displayName
                                                        }
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
                            )}
                        </Tooltip>
                    </Stack>
                    {assigneeSelector}
                    <Divider />
                    {isFetching ? (
                        <></>
                    ) : (
                        <CollapsibleToggle
                            onClick={() =>
                                setCollapsed((prevState) => !prevState)
                            }
                            value={collapsed}
                        />
                    )}
                </Stack>
            </Paper>
        );
    }
}

TaskAssignmentsPanel.propTypes = {
    taskId: PropTypes.string.isRequired,
};

export default TaskAssignmentsPanel;
