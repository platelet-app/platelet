import React, { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
    Divider,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import { tasksStatus, userRoles } from "../../../apiConsts";
import RiderPicker from "../../../components/RiderPicker";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserRoleSelect from "../../../components/UserRoleSelect";
import TaskAssignees from "./TaskAssignees";
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
import {
    dataStoreReadyStatusSelector,
    tenantIdSelector,
} from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import UserChip from "../../../components/UserChip";
import RecentlyAssignedUsers from "../../../components/RecentlyAssignedUsers";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

const sortByUserRole = (a, b) => {
    // coordinators first and riders second
    if (a.role === userRoles.coordinator) {
        return -1;
    } else if (b.role === userRoles.coordinator) {
        return 1;
    } else if (a.role === userRoles.rider) {
        return -1;
    } else if (b.role === userRoles.rider) {
        return 1;
    } else {
        return 0;
    }
};

function TaskAssignmentsPanel(props) {
    const [collapsed, setCollapsed] = useState(true);
    const [role, setRole] = useState(userRoles.rider);
    const [isPosting, setIsPosting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const tenantId = useSelector(tenantIdSelector);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const updating = useRef(false);
    const [state, setState] = useState({});
    const dispatch = useDispatch();
    const errorMessage = "Sorry, something went wrong";

    function onSelect(value) {
        updating.current = true;
        if (value) addAssignee(value, role);
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
        setIsPosting(true);
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
                    tenantId,
                })
            );
            if (role === userRoles.rider) {
                const status = await determineTaskStatus(
                    {
                        ...task,
                    },
                    [result]
                );
                await DataStore.save(
                    models.Task.copyOf(task, (updated) => {
                        updated.status = status;
                        if (assignee.riderResponsibility)
                            updated.riderResponsibility =
                                assignee.riderResponsibility;
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
            setIsPosting(false);
        } catch (error) {
            console.log(error);
            setIsPosting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function deleteAssignment(assignmentId) {
        setIsDeleting(true);
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
            const status = await determineTaskStatus(
                {
                    ...existingTask,
                },
                Object.values(_.omit(state, assignmentId)).filter(
                    (a) => a.role === userRoles.rider
                )
            );
            await DataStore.save(
                models.Task.copyOf(existingTask, (updated) => {
                    updated.status = status;
                })
            );
            setState((prevState) => _.omit(prevState, assignmentId));
            setIsDeleting(false);
        } catch (error) {
            console.log(error);
            setIsDeleting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    useEffect(() => {
        if (updating.current) {
            updating.current = false;
            return;
        }
        if (
            Object.values(state).filter((a) => a.role === userRoles.rider)
                .length === 0
        )
            setCollapsed(false);
        else setCollapsed(true);
    }, [state]);

    if (errorState) {
        return <GetError />;
    } else if (isFetching) {
        return <Skeleton variant={"rectangular"} width={"100%"} height={40} />;
    } else {
        return (
            <Paper sx={{ padding: 2 }}>
                <Stack divider={<Divider />} direction="column" spacing={2}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant={"h6"}>
                            People assigned to this task
                        </Typography>
                        <Tooltip title={"Edit Assignees"}>
                            <IconButton
                                aria-label={"Edit Assignees"}
                                size={"small"}
                                disabled={props.disabled}
                                onClick={() =>
                                    setCollapsed((prevState) => !prevState)
                                }
                            >
                                <EditIcon
                                    color={!collapsed ? "secondary" : "inherit"}
                                />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    {collapsed && (
                        <Grid container spacing={1} direction={"row"}>
                            {Object.values(state)
                                .sort(sortByUserRole)
                                .map((assignment) => {
                                    return (
                                        assignment &&
                                        assignment.assignee && (
                                            <Grid
                                                key={assignment.assignee.id}
                                                item
                                            >
                                                <UserChip
                                                    key={assignment.assignee.id}
                                                    user={assignment.assignee}
                                                />
                                            </Grid>
                                        )
                                    );
                                })}
                        </Grid>
                    )}
                    {!collapsed && !isFetching && (
                        <>
                            <TaskAssignees
                                disabled={isDeleting}
                                onRemove={(v) => {
                                    updating.current = true;
                                    deleteAssignment(v);
                                }}
                                assignees={state}
                            />
                            <Typography>Assign a user</Typography>
                            <UserRoleSelect
                                value={role}
                                onSelect={(value) => setRole(value)}
                                exclude={Object.values(userRoles).filter(
                                    (value) =>
                                        ![
                                            userRoles.rider,
                                            userRoles.coordinator,
                                        ].includes(value)
                                )}
                            />
                            <RecentlyAssignedUsers
                                onChange={onSelect}
                                disabled={isPosting}
                                role={role}
                                limit={5}
                                exclude={Object.values(state)
                                    .filter(
                                        (a) =>
                                            a && a.assignee && a.role === role
                                    )
                                    .map((a) => a.assignee.id)}
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
