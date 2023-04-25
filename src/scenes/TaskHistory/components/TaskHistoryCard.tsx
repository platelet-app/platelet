import { Task } from "../../../API";
import { Divider, Paper, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TaskCardLocationDetail from "../../../components/TaskCardLocationDetail";
import CommentsBadge from "../../../components/CommentsBadge";
import TaskCardTimestamp from "../../../components/TaskCardTimestamp";
import TaskCardChips from "../../../components/TaskCardChips";

type TaskHistoryCardProps = {
    task: Task;
};

const TaskHistoryCard: React.FC<TaskHistoryCardProps> = ({ task }) => {
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));

    let taskBadge = <div></div>;

    if (task?.comments?.items) {
        const filterDeleted = task.comments.items.filter(
            (comment) => comment && !comment._deleted
        );
        if (filterDeleted?.length > 0) {
            taskBadge = <CommentsBadge count={filterDeleted.length} />;
        }
    }

    const assignees = task?.assignees?.items.filter((a) => a && !a._deleted);
    const deliverables = task?.deliverables?.items.filter(
        (d) => d && !d._deleted
    );

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
                    showDeliverableIcons
                    limit={cutOff}
                    assignees={assignees}
                    deliverables={deliverables}
                    status={task.status}
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

export default TaskHistoryCard;
