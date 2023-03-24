import { Task } from "../../../API";
import TaskHistoryTimeline from "./TaskHistoryTimeline";
import TaskHistoryTaskDialogSummary from "./TaskHistoryTaskDialogSummary";
import TaskHistoryTaskDialogRequesterContact from "./TaskHistoryTaskDialogRequesterContact";
import { Stack } from "@mui/material";
import TaskHistoryTaskDialogLocation from "./TaskHistoryTaskDialogLocation";

type TaskHistoryTaskDialogContentProps = {
    task: Task;
};

const TaskHistoryTaskDialogContent: React.FC<
    TaskHistoryTaskDialogContentProps
> = ({ task }) => {
    const { requesterContact } = task;
    return (
        <Stack spacing={2}>
            <TaskHistoryTaskDialogSummary task={task} />
            {requesterContact && (
                <TaskHistoryTaskDialogRequesterContact
                    requesterContact={requesterContact}
                    establishment={task.establishmentLocation}
                />
            )}
            <TaskHistoryTimeline task={task} />
            {task.pickUpLocation && (
                <TaskHistoryTaskDialogLocation
                    location={task.pickUpLocation}
                    title="Collect from"
                />
            )}
            {task.dropOffLocation && (
                <TaskHistoryTaskDialogLocation
                    location={task.dropOffLocation}
                    title="Deliver to"
                />
            )}
        </Stack>
    );
};

export default TaskHistoryTaskDialogContent;
