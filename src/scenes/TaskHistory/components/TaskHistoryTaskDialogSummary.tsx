import { Task } from "../../../API";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import TaskHistoryLabelItemPair from "./TaskHistoryLabelItemPair";
import Moment from "react-moment";

type TaskHistoryTaskDialogSummaryProps = {
    task: Task;
};

const TaskHistoryTaskDialogSummary: React.FC<
    TaskHistoryTaskDialogSummaryProps
> = ({ task }) => {
    return (
        <Paper>
            <Stack direction="column" spacing={1}>
                <TaskHistoryLabelItemPair label="Priority">
                    <Chip label={task.priority} />
                </TaskHistoryLabelItemPair>
                <TaskHistoryLabelItemPair label="Rider role">
                    <Chip label={task.riderResponsibility} />
                </TaskHistoryLabelItemPair>
                <TaskHistoryLabelItemPair label="Time of call">
                    <Typography>
                        <Moment format="DD/MM/yyyy, HH:mm">
                            {task.timeOfCall || ""}
                        </Moment>
                    </Typography>
                </TaskHistoryLabelItemPair>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryTaskDialogSummary;
