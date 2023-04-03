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
        <Paper
            sx={{
                padding: 1,
                borderRadius: "1em",
            }}
        >
            <Stack direction="column" spacing={1}>
                {task.priority && (
                    <TaskHistoryLabelItemPair label="Priority">
                        {task.priority}
                    </TaskHistoryLabelItemPair>
                )}
                {task.riderResponsibility && (
                    <TaskHistoryLabelItemPair label="Rider role">
                        {task.riderResponsibility}
                    </TaskHistoryLabelItemPair>
                )}
                {task.timeOfCall && (
                    <TaskHistoryLabelItemPair label="Time of call">
                        <Typography>
                            <Moment format="DD/MM/yyyy, HH:mm">
                                {task.timeOfCall || ""}
                            </Moment>
                        </Typography>
                    </TaskHistoryLabelItemPair>
                )}
            </Stack>
        </Paper>
    );
};

export default TaskHistoryTaskDialogSummary;
