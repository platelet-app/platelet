import React, { useEffect, useState } from "react";
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
import makeStyles from "@mui/styles/makeStyles";
import RiderPicker from "../../../components/RiderPicker";
import CoordinatorPicker from "../../../components/CoordinatorPicker";
import UserRoleSelect from "../../../components/UserRoleSelect";
import TaskAssignees from "./TaskAssignees";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { sortByCreatedTime } from "../../../utilities";
import determineTaskStatus from "../../../utilities/determineTaskStatus";
import { useDispatch, useSelector } from "react-redux";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import _ from "lodash";
import { tenantIdSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import UserChip from "../../../components/UserChip";
import RecentlyAssignedUsers from "../../../components/RecentlyAssignedUsers";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";
import useTaskAssignees from "../../../hooks/useTaskAssignees";

export const useStyles = makeStyles(() => ({
    italic: {
        fontStyle: "italic",
    },
}));

const sortByUserRole = (a: models.TaskAssignee, b: models.TaskAssignee) => {
    // coordinators first and riders second
    if (a.role === models.Role.COORDINATOR) {
        return -1;
    } else if (b.role === models.Role.COORDINATOR) {
        return 1;
    } else if (a.role === models.Role.RIDER) {
        return -1;
    } else if (b.role === models.Role.RIDER) {
        return 1;
    } else {
        return 0;
    }
};

type TaskAssignmentsPanelProps = {
    taskId: string;
    disabled: boolean;
};

const TaskAssignmentsPanel: React.FC<TaskAssignmentsPanelProps> = ({
    taskId,
    disabled = false,
}) => {
    const [collapsed, setCollapsed] = useState<boolean | null>(null);
    const [role, setRole] = useState(models.Role.RIDER);
    const [isPosting, setIsPosting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const tenantId = useSelector(tenantIdSelector);
    const currentUserRole = useAssignmentRole(taskId);
    const hasFullPermissions = currentUserRole === models.Role.COORDINATOR;
    const dispatch = useDispatch();
    const errorMessage = "Sorry, something went wrong";

    const { state, isFetching, error } = useTaskAssignees(taskId);

    function onSelect(value: models.User) {
        if (value) addAssignee(value, role);
    }

    async function addAssignee(user: models.User, role: models.Role) {
        setIsPosting(true);
        try {
            const assignee = await DataStore.query(models.User, user.id);
            const task = await DataStore.query(models.Task, taskId);
            if (!assignee || !task)
                throw new Error(
                    `Can't find assignee or task: ${taskId}, userId: ${user.id}`
                );
            const result = await DataStore.save(
                new models.TaskAssignee({
                    assignee,
                    task,
                    role,
                    tenantId,
                })
            );
            if (role === models.Role.RIDER) {
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
                    task.status === models.TaskStatus.NEW &&
                    status === models.TaskStatus.ACTIVE
                ) {
                    dispatch(displayInfoNotification("Task moved to ACTIVE"));
                }
            }
            //setState({ ...state, [result.id]: result });
            setIsPosting(false);
        } catch (error) {
            console.log(error);
            setIsPosting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function deleteAssignment(assignmentId: string) {
        setIsDeleting(true);
        try {
            if (!assignmentId) throw new Error("Assignment ID not provided");
            const existingTask = await DataStore.query(models.Task, taskId);
            if (!existingTask) throw new Error("Task doesn't exist");
            const existingAssignment = await DataStore.query(
                models.TaskAssignee,
                assignmentId
            );
            const status = await determineTaskStatus(
                existingTask,
                Object.values(_.omit(state, assignmentId)).filter(
                    (a) => a.role === models.Role.RIDER
                )
            );
            let riderResponsibility = existingTask.riderResponsibility;
            if (
                existingAssignment &&
                existingAssignment.role === models.Role.RIDER
            ) {
                const riders = await Promise.all(
                    Object.values(state)
                        .filter(
                            (a) =>
                                a.role === models.Role.RIDER &&
                                a.id !== assignmentId
                        )
                        .map((a) => a.assignee)
                );
                if (riders.length > 0) {
                    const rider = riders[riders.length - 1];
                    if (rider && rider.riderResponsibility) {
                        riderResponsibility = rider.riderResponsibility;
                    } else {
                        riderResponsibility = null;
                    }
                } else {
                    riderResponsibility = null;
                }
            }
            if (existingAssignment) await DataStore.delete(existingAssignment);
            await DataStore.save(
                models.Task.copyOf(existingTask, (updated) => {
                    updated.status = status;
                    updated.riderResponsibility = riderResponsibility;
                })
            );
            //setState((prevState) => _.omit(prevState, assignmentId));
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
        if (collapsed !== null) return;
        if (
            Object.values(state).filter((a) => a.role === models.Role.RIDER)
                .length === 0 ||
            Object.values(state).filter(
                (a) => a.role === models.Role.COORDINATOR
            ).length === 0
        ) {
            setCollapsed(false);
        } else {
            setCollapsed(true);
        }
    }
    useEffect(setCollapsedOnFirstMount, [state, collapsed, isFetching]);

    if (error) {
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
                                    disabled={disabled}
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
                        <Grid container spacing={1} direction={"row"}>
                            {sortByCreatedTime(Object.values(state), "oldest")
                                .sort(sortByUserRole)
                                .map((assignment: models.TaskAssignee) => {
                                    return (
                                        assignment &&
                                        assignment.assignee && (
                                            <Grid
                                                key={assignment.assignee.id}
                                                item
                                            >
                                                <UserChip
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
                                    deleteAssignment(v);
                                }}
                                assignees={Object.values(state)}
                            />
                            <Typography>Assign a user</Typography>
                            <UserRoleSelect
                                value={[role]}
                                onSelect={(value) => setRole(value)}
                                exclude={Object.values(models.Role).filter(
                                    (value) =>
                                        ![
                                            models.Role.RIDER,
                                            models.Role.COORDINATOR,
                                        ].includes(value)
                                )}
                            />
                            <RecentlyAssignedUsers
                                onChange={onSelect}
                                disabled={isPosting}
                                role={role}
                                limit={5}
                                exclude={Object.values(state)
                                    .filter((a) => a && a.role === role)
                                    .map((a) => a.assignee.id)}
                            />
                            {role === models.Role.RIDER ? (
                                <RiderPicker
                                    onSelect={onSelect}
                                    exclude={Object.values(state)
                                        .filter(
                                            (a) =>
                                                a &&
                                                a.role === models.Role.RIDER
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
                                                a.role ===
                                                    models.Role.COORDINATOR
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
};
export default TaskAssignmentsPanel;
