import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import TaskHistoryTimeline from "./TaskHistoryTimeline";
import CloseIcon from "@mui/icons-material/Close";
import useTaskGraphQL from "../../../hooks/useTaskGraphQL";

type TaskHistoryTaskDialogProps = {
    taskId: string;
    onClose: () => void;
};

type DialogWrapperType = {
    onClose: () => void;
    children: React.ReactNode;
};

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

const DialogWrapper: React.FC<DialogWrapperType> = ({ children, onClose }) => {
    return (
        <RoundedDialog open={true}>
            <DialogActions style={{ justifyContent: "space-between" }}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogActions>
            <DialogContent>{children}</DialogContent>
        </RoundedDialog>
    );
};

const TaskHistoryTaskDialog: React.FC<TaskHistoryTaskDialogProps> = ({
    taskId,
    onClose,
}) => {
    const { state, isFetching, error, notFound } = useTaskGraphQL(taskId);
    if (isFetching) {
        return (
            <DialogWrapper onClose={onClose}>
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
            <DialogWrapper onClose={onClose}>
                <Typography>Sorry, something went wrong.</Typography>
            </DialogWrapper>
        );
    } else if (notFound) {
        return (
            <DialogWrapper onClose={onClose}>
                <Typography>Task not found.</Typography>
            </DialogWrapper>
        );
    } else {
        return (
            <DialogWrapper onClose={onClose}>
                <TaskHistoryTimeline task={state} />
            </DialogWrapper>
        );
    }
};

export default TaskHistoryTaskDialog;
