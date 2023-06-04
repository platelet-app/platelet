import { Button, Stack } from "@mui/material";
import * as models from "../../../models";
import useModelSubscription from "../../../hooks/useModelSubscription";
import { DataStore } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";

type PendingTaskAcceptRejectProps = {
    taskId: string;
};

const PendingTaskAcceptReject: React.FC<PendingTaskAcceptRejectProps> = ({
    taskId,
}) => {
    const { state } = useModelSubscription<models.Task>(models.Task, taskId);
    const tenantId = useSelector(tenantIdSelector);
    const whoami = useSelector(getWhoami);

    const dispatch = useDispatch();

    async function undoUpdatePending(
        task: models.Task,
        assignment: models.TaskAssignee
    ) {
        try {
            const existingTask = await DataStore.query(models.Task, task.id);
            if (existingTask) {
                await DataStore.save(
                    models.Task.copyOf(existingTask, (t) => {
                        t.status = models.TaskStatus.PENDING;
                        t.timeRejected = null;
                    })
                );
            }
            const existingAssignment = await DataStore.query(
                models.TaskAssignee,
                assignment.id
            );
            if (existingAssignment) {
                await DataStore.delete(existingAssignment);
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }

    const handleReject = async () => {
        try {
            const existing = await DataStore.query(models.Task, taskId);
            const assignee = await DataStore.query(models.User, whoami.id);
            const timeRejected = new Date().toISOString();
            if (existing && assignee) {
                const assignment = await DataStore.save(
                    new models.TaskAssignee({
                        assignee,
                        tenantId,
                        task: existing,
                        role: models.Role.COORDINATOR,
                    })
                );
                const task = await DataStore.save(
                    models.Task.copyOf(existing, (updated) => {
                        updated.status = models.TaskStatus.REJECTED;
                        updated.timeRejected = timeRejected;
                    })
                );
                dispatch(
                    displayInfoNotification(
                        "Task rejected",
                        () => {
                            undoUpdatePending(task, assignment);
                        },
                        undefined
                    )
                );
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };
    const handleAccept = async () => {
        try {
            const existing = await DataStore.query(models.Task, taskId);
            const assignee = await DataStore.query(models.User, whoami.id);
            if (existing && assignee) {
                const assignment = await DataStore.save(
                    new models.TaskAssignee({
                        assignee,
                        tenantId,
                        task: existing,
                        role: models.Role.COORDINATOR,
                    })
                );
                const task = await DataStore.save(
                    models.Task.copyOf(existing, (updated) => {
                        updated.status = models.TaskStatus.NEW;
                    })
                );
                dispatch(
                    displayInfoNotification(
                        "Task accepted",
                        () => {
                            undoUpdatePending(task, assignment);
                        },
                        undefined
                    )
                );
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };

    if (state?.status === models.TaskStatus.PENDING) {
        return (
            <Stack sx={{ padding: 1 }} direction="row" spacing={1}>
                <Button
                    onClick={handleAccept}
                    variant="contained"
                    color="primary"
                >
                    Accept
                </Button>
                <Button
                    onClick={handleReject}
                    variant="contained"
                    color="error"
                >
                    Reject
                </Button>
            </Stack>
        );
    } else {
        return null;
    }
};

export default PendingTaskAcceptReject;
