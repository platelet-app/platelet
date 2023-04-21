import * as models from "../../../models";
import { Divider, Paper, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TaskCardLocationDetail from "../../../components/TaskCardLocationDetail";
import CommentsBadge from "../../../components/CommentsBadge";
import TaskCardTimestamp from "../../../components/TaskCardTimestamp";
import TaskCardChips from "../../../components/TaskCardChips";
import useTaskAssigneesRedux from "../../../hooks/useTaskAssigneesRedux";

type TaskCardProps = {
    task: models.Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));
    const assignees = useTaskAssigneesRedux(task.id);

    let taskBadge = <div></div>;

    if (task?.comments) {
        if (task?.comments.length > 0) {
            taskBadge = <CommentsBadge count={task.comments.length} />;
        }
    }

    let cutOff = 6;
    if (isSm) {
        cutOff = 4;
    } else if (isLg) {
        cutOff = 8;
    }

    return (
        <Paper
            sx={{
                borderRadius: "1em",
            }}
        >
            <Stack
                sx={{
                    padding: 1,
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                }}
                spacing={0.5}
                justifyContent="space-between"
                direction="column"
            >
                <TaskCardChips
                    limit={cutOff}
                    assignees={assignees}
                    deliverables={[]}
                    priority={task.priority}
                    riderResponsibility={task.riderResponsibility}
                />
                <TaskCardLocationDetail location={task.pickUpLocation} />
                <Divider sx={{ width: isSm ? "100%" : "50%" }} />
                <TaskCardLocationDetail location={task.dropOffLocation} />
                <Stack direction="row" spacing={2}>
                    {task?.createdAt && (
                        <TaskCardTimestamp timestamp={task.createdAt} />
                    )}
                    {taskBadge}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default TaskCard;
