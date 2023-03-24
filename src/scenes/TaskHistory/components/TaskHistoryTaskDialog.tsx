import Dialog from "@mui/material/Dialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
    Button,
    IconButton,
    Skeleton,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import CloseIcon from "@mui/icons-material/Close";
import useTaskGraphQL from "../../../hooks/useTaskGraphQL";
import { useHistory } from "react-router";
import TaskHistoryTaskDialogContent from "./TaskHistoryTaskDialogContent";
import { encodeUUID } from "../../../utilities";
import { useTheme } from "@mui/material/styles";

type DialogWrapperProps = {
    children: React.ReactNode;
    taskId: string;
};

type TaskHistoryTaskDialogProps = {
    taskId: string;
};

const DialogWrapper: React.FC<DialogWrapperProps> = ({ children, taskId }) => {
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
                {taskId && (
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
                <Skeleton
                    data-testid="task-history-dialog-fetching"
                    variant="rectangular"
                    height={400}
                    width={300}
                />
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
            <DialogWrapper taskId={taskId}>
                <TaskHistoryTaskDialogContent task={state} />
            </DialogWrapper>
        );
    } else {
        return null;
    }
};

export default TaskHistoryTaskDialog;
