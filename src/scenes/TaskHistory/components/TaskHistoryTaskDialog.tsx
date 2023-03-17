import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import TaskHistoryTimeline from "./TaskHistoryTimeline";
import CloseIcon from "@mui/icons-material/Close";
import useTaskGraphQL from "../../../hooks/useTaskGraphQL";
import { useHistory } from "react-router";

type DialogWrapperProps = {
    children: React.ReactNode;
};

type TaskHistoryTaskDialogProps = {
    taskId: string;
};

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

const DialogWrapper: React.FC<DialogWrapperProps> = ({ children }) => {
    const history = useHistory();
    function onClose(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        history.push("/history");
    }
    return (
        <RoundedDialog open>
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
}) => {
    console.log(taskId);
    const { state, isFetching, error, notFound } = useTaskGraphQL(taskId);

    if (isFetching) {
        return (
            <DialogWrapper>
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
            <DialogWrapper>
                <Typography>Sorry, something went wrong.</Typography>
            </DialogWrapper>
        );
    } else if (notFound) {
        return (
            <DialogWrapper>
                <Typography>Task not found.</Typography>
            </DialogWrapper>
        );
    } else {
        return (
            <DialogWrapper>
                <TaskHistoryTimeline task={state} />
            </DialogWrapper>
        );
    }
};

export default TaskHistoryTaskDialog;
