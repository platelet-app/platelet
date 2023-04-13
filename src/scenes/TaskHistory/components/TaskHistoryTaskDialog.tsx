import Dialog from "@mui/material/Dialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
    Button,
    IconButton,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useTaskGraphQL from "../../../hooks/useTaskGraphQL";
import { useHistory } from "react-router";
import TaskHistoryTaskDialogContent from "./TaskHistoryTaskDialogContent";
import { encodeUUID } from "../../../utilities";
import { useTheme } from "@mui/material/styles";
import _ from "lodash";

type DialogWrapperProps = {
    children: React.ReactNode;
    taskId: string;
    showDashboardButton?: boolean;
};

type TaskHistoryTaskDialogProps = {
    taskId: string;
};

const DialogWrapper: React.FC<DialogWrapperProps> = ({
    children,
    taskId,
    showDashboardButton = false,
}) => {
    const history = useHistory();
    function onClose(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        history.push("/history");
    }

    const dashboardNavigate = () => {
        history.push(`/task/${encodeUUID(taskId)}`);
    };

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog
            PaperProps={{
                sx: {
                    background: theme.palette.background.default,
                    padding: 0,
                    borderRadius: isSm ? 0 : "1em",
                    minHeight: 300,
                },
            }}
            fullScreen={isSm}
            onClose={onClose}
            open
        >
            <DialogActions style={{ justifyContent: "space-between" }}>
                <Tooltip title="Close">
                    <IconButton onClick={onClose}>
                        {isSm ? <ArrowBackIcon /> : <CloseIcon />}
                    </IconButton>
                </Tooltip>
                {taskId && showDashboardButton && (
                    <Button
                        sx={{
                            width: "50%",
                        }}
                        variant="contained"
                        onClick={dashboardNavigate}
                    >
                        View on dashboard
                    </Button>
                )}
            </DialogActions>
            <DialogContent
                sx={{ padding: isSm ? 1 : 3, minWidth: isSm ? 0 : 500 }}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
};

const TaskHistoryTaskDialog: React.FC<TaskHistoryTaskDialogProps> = ({
    taskId,
}) => {
    const { state, isFetching, error, notFound } = useTaskGraphQL(taskId);

    if (isFetching) {
        return (
            <DialogWrapper taskId={taskId}>
                <Stack alignItems="center" spacing={2}>
                    {_.range(0, 2).map(() => (
                        <Skeleton
                            variant="rectangular"
                            height={100}
                            width={"100%"}
                            sx={{ borderRadius: "1em" }}
                        />
                    ))}
                    <Skeleton
                        data-testid="task-history-dialog-fetching"
                        variant="rectangular"
                        height={600}
                        width={"100%"}
                        sx={{ borderRadius: "1em" }}
                    />
                    {_.range(0, 2).map(() => (
                        <Skeleton
                            sx={{ borderRadius: "1em" }}
                            variant="rectangular"
                            height={150}
                            width={"100%"}
                        />
                    ))}
                </Stack>
            </DialogWrapper>
        );
    } else if (error) {
        return (
            <DialogWrapper taskId={taskId}>
                <Typography>Sorry, something went wrong.</Typography>
            </DialogWrapper>
        );
    } else if (notFound) {
        return (
            <DialogWrapper taskId={taskId}>
                <Typography>Task not found.</Typography>
            </DialogWrapper>
        );
    } else if (state) {
        return (
            <DialogWrapper
                taskId={taskId}
                showDashboardButton={state.archived === 0}
            >
                <TaskHistoryTaskDialogContent task={state} />
            </DialogWrapper>
        );
    } else {
        return null;
    }
};

export default TaskHistoryTaskDialog;
