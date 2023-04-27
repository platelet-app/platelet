import * as models from "../../../models";
import {
    AvatarGroup,
    Box,
    Divider,
    Paper,
    Stack,
    Tooltip,
} from "@mui/material";
import TaskCardLocationDetail from "../../../components/TaskCardLocationDetail";
import CommentsBadge from "../../../components/CommentsBadge";
import TaskCardTimestamp from "../../../components/TaskCardTimestamp";
import TaskCardChips from "../../../components/TaskCardChips";
import useTaskAssigneesRedux from "../../../hooks/useTaskAssigneesRedux";
import { makeStyles } from "tss-react/mui";
import useTaskDeliverablesRedux from "../../../hooks/useTaskDeliverablesRedux";
import useCommentsRedux from "../../../hooks/useCommentsRedux";
import UserAvatar from "../../../components/UserAvatar";

const colourBarPercent = "90%";

const generateClass = (theme: any, status: string) => {
    if (!theme || !status) {
        return {};
    }
    const backgroundColor =
        theme.palette.mode === "dark" ? "rgba(60, 60, 60, 1)" : "rgba(0,0,0,0)";

    return {
        background: `linear-gradient(0deg,
        ${backgroundColor},
        ${colourBarPercent},
        ${backgroundColor},
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]} 100%)`,
    };
};

const useStyles = makeStyles()((theme) => {
    return {
        cardContent: {
            paddingTop: 5,
            userSelect: "none",
        },
        NEW: generateClass(theme, "NEW"),
        ACTIVE: generateClass(theme, "ACTIVE"),
        PICKED_UP: generateClass(theme, "PICKED_UP"),
        DROPPED_OFF: generateClass(theme, "DROPPED_OFF"),
        COMPLETED: generateClass(theme, "COMPLETED"),
        CANCELLED: generateClass(theme, "CANCELLED"),
        REJECTED: generateClass(theme, "REJECTED"),
        ABANDONED: generateClass(theme, "ABANDONED"),
        divider: { width: "0%", margin: 4 },
        typography: { fontSize: "14px" },
        badgeCircle: {
            "&::after": {
                content: "''",
                width: 10,
            },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 35,
            height: 35,
            borderRadius: "50%",
            backgroundColor:
                theme.palette.mode === "dark"
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(255,255,255,0.5)",
        },
    };
});

type TaskCardProps = {
    task: models.Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const assignees = useTaskAssigneesRedux(task.id, true);
    const deliverables = useTaskDeliverablesRedux(task.id);
    const comments = useCommentsRedux(task.id);

    const { classes } = useStyles();

    let taskBadge = <div></div>;

    if (comments) {
        if (comments.length > 0) {
            taskBadge = <CommentsBadge count={comments.length} />;
        }
    }

    const cutOff = 4;

    const className = classes[task.status as keyof typeof classes];
    const assigneesDisplayString = assignees
        .map((a: models.TaskAssignee) => a?.assignee?.displayName)
        .join(", ");

    return (
        <Paper
            className={className}
            sx={{
                borderRadius: "0.8em",
                userSelect: "none",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
            }}
        >
            <Box sx={{ right: 8, top: -8, position: "absolute" }}>
                <Tooltip
                    data-testid="assignee-names-tooltip"
                    title={assigneesDisplayString}
                >
                    <AvatarGroup>
                        {assignees.map((a: models.TaskAssignee) => (
                            <UserAvatar
                                key={a.id}
                                size={3}
                                userUUID={a.assignee?.id}
                                displayName={a.assignee?.displayName}
                                thumbnailKey={
                                    a.assignee?.profilePicture
                                        ? a.assignee?.profilePicture.key
                                        : null
                                }
                            />
                        ))}
                    </AvatarGroup>
                </Tooltip>
            </Box>
            <Stack
                sx={{
                    paddingTop: 3,
                    paddingBottom: 1,
                    paddingLeft: 1,
                    paddingRight: 1,
                }}
                spacing={0.5}
                justifyContent="space-between"
                direction="column"
            >
                <TaskCardChips
                    limit={cutOff}
                    deliverables={deliverables}
                    priority={task.priority}
                    riderResponsibility={task.riderResponsibility}
                />
                <TaskCardLocationDetail
                    nullLocationText="No pick up address"
                    location={task.pickUpLocation}
                />
                <Divider sx={{ width: "70%" }} />
                <TaskCardLocationDetail
                    nullLocationText="No delivery address"
                    location={task.dropOffLocation}
                />
                <Stack direction="row" spacing={2}>
                    {(task?.createdAt || task?.timeOfCall) && (
                        <TaskCardTimestamp
                            timestamp={task.createdAt || task.timeOfCall || ""}
                        />
                    )}
                    {taskBadge}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default TaskCard;
