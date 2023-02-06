import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
    Divider,
    Box,
    Chip,
    Grid,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { tasksStatus, userRoles } from "../../../apiConsts";
import RiderPicker from "../../../components/RiderPicker";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserRoleSelect from "../../../components/UserRoleSelect";
import TaskAssignees from "./TaskAssignees";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { convertListDataToObject, sortByCreatedTime } from "../../../utilities";
import determineTaskStatus from "../../../utilities/determineTaskStatus";
import { useDispatch, useSelector } from "react-redux";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import _ from "lodash";
import {
    taskAssigneesReadyStatusSelector,
    taskAssigneesSelector,
    tenantIdSelector,
} from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import UserChip from "../../../components/UserChip";
import RecentlyAssignedUsers from "../../../components/RecentlyAssignedUsers";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";

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
    const [collapsed, setCollapsed] = useState(null);
    const [role, setRole] = useState(userRoles.rider);
    const [isPosting, setIsPosting] = useState(false);
    const [isPostingVehicle, setIsPostingVehicle] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const taskAssignees = useSelector(taskAssigneesSelector).items;
    const taskAssigneesReady = useSelector(taskAssigneesReadyStatusSelector);
    const tenantId = useSelector(tenantIdSelector);
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(false);
    const [state, setState] = useState({});
    const [usingOwnVehicle, setUsingOwnVehicle] = useState(false);
    const taskObserver = React.useRef({ unsubscribe: () => {} });

    const currentUserRole = useAssignmentRole(props.taskId);
    const hasFullPermissions = currentUserRole === userRoles.coordinator;

    const dispatch = useDispatch();
    const errorMessage = "Sorry, something went wrong";

    function onSelect(value) {
        if (value) addAssignee(value, role);
    }

    const getTask = React.useCallback(async () => {
        taskObserver.current.unsubscribe();
        const result = await DataStore.query(models.Task, props.taskId);
        if (result) setUsingOwnVehicle(!!result.isRiderUsingOwnVehicle);
        taskObserver.current = DataStore.observe(
            models.Task,
            props.taskId
        ).subscribe(({ element }) => {
            setUsingOwnVehicle(!!element.isRiderUsingOwnVehicle);
        });
    }, [props.taskId]);
    useEffect(() => {
        getTask();
        return () => {
            taskObserver.current.unsubscribe();
        };
    }, [getTask]);

    const getAssignees = React.useCallback(
        (taskId, taskAssignees) => {
            setIsFetching(true);
            if (!taskAssigneesReady) return;
            try {
                const result = taskAssignees.filter(
                    (assignee) => assignee.task && assignee.task.id === taskId
                );
                setState(convertListDataToObject(result));
                setIsFetching(false);
            } catch (e) {
                console.error(e);
                setErrorState(true);
                setIsFetching(false);
            }
        },
        [taskAssigneesReady]
    );
    useEffect(() => {
        getAssignees(props.taskId, taskAssignees);
    }, [props.taskId, taskAssigneesReady, taskAssignees, getAssignees]);

    async function handleChangeRiderUsingOwnVehicle() {
        const current = usingOwnVehicle;
        try {
            setIsPostingVehicle(true);
            setUsingOwnVehicle(!usingOwnVehicle);
            const existing = await DataStore.query(models.Task, props.taskId);
            await DataStore.save(
                models.Task.copyOf(existing, (updated) => {
                    updated.isRiderUsingOwnVehicle = usingOwnVehicle ? 0 : 1;
                })
            );
            setIsPostingVehicle(false);
        } catch (e) {
            console.error(e);
            dispatch(displayErrorNotification(errorMessage));
            setIsPostingVehicle(false);
            setUsingOwnVehicle(current);
        }
    }

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
            if (existingAssignment) await DataStore.delete(existingAssignment);
            const status = await determineTaskStatus(
                existingTask,
                Object.values(_.omit(state, assignmentId)).filter(
                    (a) => a.role === userRoles.rider
                )
            );
            let riderResponsibility = existingTask.riderResponsibility;
            let isRiderUsingOwnVehicle = existingTask.isRiderUsingOwnVehicle;
            if (
                existingAssignment &&
                existingAssignment.role === userRoles.rider
            ) {
                const riders = Object.values(state)
                    .filter(
                        (a) =>
                            a.role === userRoles.rider && a.id !== assignmentId
                    )
                    .map((a) => a.assignee);
                if (riders.length > 0) {
                    const rider = riders[riders.length - 1];
                    if (rider && rider.riderResponsibility) {
                        riderResponsibility = rider.riderResponsibility;
                    }
                } else {
                    riderResponsibility = null;
                    isRiderUsingOwnVehicle = 0;
                }
            }
            await DataStore.save(
                models.Task.copyOf(existingTask, (updated) => {
                    updated.status = status;
                    updated.riderResponsibility = riderResponsibility;
                    updated.isRiderUsingOwnVehicle = isRiderUsingOwnVehicle;
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

    function setCollapsedOnFirstMount() {
        if (_.isEmpty(state)) {
            if (!isFetching) setCollapsed(false);
            return;
        }
        if (!taskAssigneesReady || collapsed !== null) return;
        if (
            Object.values(state).filter((a) => a.role === userRoles.rider)
                .length === 0 ||
            Object.values(state).filter((a) => a.role === userRoles.coordinator)
                .length === 0
        ) {
            setCollapsed(false);
        } else {
            setCollapsed(true);
        }
    }

    useEffect(setCollapsedOnFirstMount, [
        state,
        taskAssigneesReady,
        taskAssignees,
        collapsed,
        isFetching,
    ]);

    if (errorState) {
        return <GetError />;
    } else if (isFetching) {
        return <Skeleton variant={"rectangular"} width={"100%"} height={40} />;
    } else {
        return (
            <Paper sx={{ borderRadius: "1em", padding: 2 }}>
                <Stack divider={<Divider />} direction="column" spacing={2}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant={"h6"}>Assignees</Typography>
                        {hasFullPermissions && (
                            <Tooltip title={"Edit Assignees"}>
                                <IconButton
                                    aria-label={"Edit Assignees"}
                                    data-cy="edit-task-assignees"
                                    size={"small"}
                                    disabled={props.disabled}
                                    onClick={() =>
                                        setCollapsed((prevState) => !prevState)
                                    }
                                >
                                    <EditIcon
                                        color={
                                            !collapsed ? "secondary" : "inherit"
                                        }
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                    {collapsed && (
                        <>
                            <Grid container spacing={1} direction={"row"}>
                                {sortByCreatedTime(
                                    Object.values(state),
                                    "oldest"
                                )
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
                                                        user={
                                                            assignment.assignee
                                                        }
                                                    />
                                                </Grid>
                                            )
                                        );
                                    })}
                            </Grid>
                            {Object.values(state).some(
                                (a) => a.role === userRoles.rider
                            ) && (
                                <>
                                    <Divider />
                                    <Box sx={{ paddingLeft: 1 }}>
                                        <Chip
                                            label={
                                                usingOwnVehicle
                                                    ? "Using own vehicle"
                                                    : "Using charity vehicle"
                                            }
                                        />
                                    </Box>
                                </>
                            )}
                        </>
                    )}
                    {!collapsed && !isFetching && (
                        <>
                            <TaskAssignees
                                disabled={isDeleting}
                                onRemove={(v) => {
                                    deleteAssignment(v);
                                }}
                                assignees={Object.values(state)}
                                onChangeRiderUsingOwnVehicle={
                                    handleChangeRiderUsingOwnVehicle
                                }
                                usingOwnVehicle={usingOwnVehicle}
                                disableUsingOwnVehicleSwitch={isPostingVehicle}
                            />
                            <Typography>Assign a user</Typography>
                            <UserRoleSelect
                                value={[role]}
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
