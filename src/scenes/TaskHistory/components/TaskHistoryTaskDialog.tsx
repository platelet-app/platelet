import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { useCordovaBackButton } from "../../../hooks/useCordovaBackButton";
import TaskHistoryTimeline from "./TaskHistoryTimeline";
import useTaskGraphQL from "../../../hooks/useTaskGraphQL";

type TaskHistoryTaskDialogProps = {
    taskId: string;
};

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

const TaskHistoryTaskDialog: React.FC<TaskHistoryTaskDialogProps> = ({
    taskId,
}) => {
    const { state, isFetching, error, notFound } = useTaskGraphQL(taskId);
    if (isFetching) {
        return (
            <Skeleton
                data-testid="task-history-dialog-fetching"
                variant="rectangular"
                height={400}
            />
        );
    } else if (error) {
        return <Typography>Sorry, something went wrong.</Typography>;
    } else if (notFound) {
        return <Typography>Task not found.</Typography>;
    } else {
        return (
            <RoundedDialog open={true}>
                <DialogContent>
                    <TaskHistoryTimeline task={state} />
                </DialogContent>
            </RoundedDialog>
        );
    }
};

export default TaskHistoryTaskDialog;
