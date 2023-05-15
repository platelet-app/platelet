import { Button, Stack, Typography } from "@mui/material";
import * as models from "../../../models";
import useModelSubscription from "../../../hooks/useModelSubscription";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";

type PendingTaskAcceptRejectProps = {
    taskId: string;
};

const PendingTaskAcceptReject: React.FC<PendingTaskAcceptRejectProps> = ({
    taskId,
}) => {
    const { state } = useModelSubscription<models.Task>(models.Task, taskId);
    const tenantId = useSelector(tenantIdSelector);
    const whoami = useSelector(getWhoami);

    const handleReject = async () => {
        const existing = await DataStore.query(models.Task, taskId);
        const assignee = await DataStore.query(models.User, whoami.id);
        const timeRejected = new Date().toISOString();
        if (existing && assignee) {
            await DataStore.save(
                new models.TaskAssignee({
                    assignee,
                    tenantId,
                    task: existing,
                    role: models.Role.COORDINATOR,
                })
            );
            await DataStore.save(
                models.Task.copyOf(existing, (updated) => {
                    updated.status = models.TaskStatus.REJECTED;
                    updated.timeRejected = timeRejected;
                })
            );
        }
    };
    const handleAccept = async () => {
        const existing = await DataStore.query(models.Task, taskId);
        const assignee = await DataStore.query(models.User, whoami.id);
        if (existing && assignee) {
            await DataStore.save(
                new models.TaskAssignee({
                    assignee,
                    tenantId,
                    task: existing,
                    role: models.Role.COORDINATOR,
                })
            );
            await DataStore.save(
                models.Task.copyOf(existing, (updated) => {
                    updated.status = models.TaskStatus.NEW;
                })
            );
        }
    };

    if (state?.status === models.TaskStatus.PENDING) {
        return (
            <Stack sx={{ padding: 1 }} direction="row" spacing={1}>
                <Typography variant="h5">This task is pending</Typography>
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
