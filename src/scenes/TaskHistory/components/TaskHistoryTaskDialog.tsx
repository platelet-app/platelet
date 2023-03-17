import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Skeleton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import TaskHistoryTimeline from "./TaskHistoryTimeline";
import ExploreIcon from "@mui/icons-material/Explore";
import CloseIcon from "@mui/icons-material/Close";
import useTaskGraphQL from "../../../hooks/useTaskGraphQL";
import { useHistory } from "react-router";
import TaskHistoryTaskDialogContent from "./TaskHistoryTaskDialogContent";
import { encodeUUID } from "../../../utilities";

type DialogWrapperProps = {
    children: React.ReactNode;
    taskId: string;
};

type TaskHistoryTaskDialogProps = {
    taskId: string;
};

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

const DialogWrapper: React.FC<DialogWrapperProps> = ({ children, taskId }) => {
    const history = useHistory();
    function onClose(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        history.push("/history");
    }

    const dashboardNavigate = () => {
        history.push(`/task/${encodeUUID(taskId)}`);
    };

    return (
        <RoundedDialog open>
            <DialogActions style={{ justifyContent: "space-between" }}>
                <Tooltip title="Close">
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View on dashboard">
                    <IconButton onClick={dashboardNavigate}>
                        <ExploreIcon />
                    </IconButton>
                </Tooltip>
            </DialogActions>
            <DialogContent>{children}</DialogContent>
        </RoundedDialog>
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
                    width={400}
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
