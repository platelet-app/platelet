import { Task } from "../../../API";
import {
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import TaskStatusChip from "./TaskStatusChip";
import UserChip from "../../../components/UserChip";
import TaskHistoryCardLocationDetail from "./TaskHistoryCardLocationDetail";
import CommentsBadge from "../../../components/CommentsBadge";
import DeliverableChip from "./DeliverableChip";
import TaskHistoryTimestamp from "./TaskHistoryTimestamp";

type TaskHistoryCardProps = {
    task: Task;
};

const TaskHistoryCard: React.FC<TaskHistoryCardProps> = ({ task }) => {
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const isLg = useMediaQuery(theme.breakpoints.up("lg"));

    let taskBadge = <div></div>;

    if (task?.comments?.items) {
        if (task.comments.items.length > 0) {
            taskBadge = <CommentsBadge count={task.comments.items.length} />;
        }
    }

    let chips = [];
    if (task.status) {
        chips.push(<TaskStatusChip status={task.status} />);
    }
    if (task.priority) {
        chips.push(<Chip size="small" label={task.priority} />);
    }
    if (task.riderResponsibility) {
        chips.push(<Chip size="small" label={task.riderResponsibility} />);
    }
    let assigneeChips: React.ReactElement[] = [];
    if (task.assignees?.items) {
        assigneeChips = task?.assignees?.items?.map((assignment) => {
            if (assignment?.assignee) {
                return <UserChip size="small" user={assignment?.assignee} />;
            } else {
                return <Chip size="small" label="" />;
            }
        });
    }
    let deliverableChips: React.ReactElement[] = [];
    if (task.deliverables?.items) {
        deliverableChips = task?.deliverables?.items?.map((deliverable) => {
            if (deliverable) {
                return <DeliverableChip deliverable={deliverable} />;
            } else {
                return <Chip size="small" label="" />;
            }
        });
    }

    chips = [...chips, ...assigneeChips, ...deliverableChips];

    let cutOff = 6;
    if (isSm) {
        cutOff = 4;
    } else if (isLg) {
        cutOff = 8;
    }

    if (chips.length > cutOff) {
        const moreChips = chips.length - cutOff;
        chips = chips.slice(0, cutOff);
        chips.push(
            <Tooltip title={`${moreChips} more`} placement="top">
                <Chip size="small" label="..." />
            </Tooltip>
        );
    }

    return (
        <Paper
            sx={{
                borderRadius: 4,
                maxWidth: 1200,
            }}
        >
            <Stack
                sx={{
                    padding: 2,
                    minHeight: 180,
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                }}
                justifyContent="space-between"
                direction="column"
            >
                <Grid direction="row" container spacing={1}>
                    {chips.map((chip) => (
                        <Grid item>{chip}</Grid>
                    ))}
                </Grid>
                <TaskHistoryCardLocationDetail location={task.pickUpLocation} />
                <Divider sx={{ width: isSm ? "100%" : "50%" }} />
                <TaskHistoryCardLocationDetail
                    location={task.dropOffLocation}
                />
                <Stack direction="row" spacing={2}>
                    {task?.createdAt && (
                        <TaskHistoryTimestamp timestamp={task.createdAt} />
                    )}
                    {taskBadge}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryCard;
