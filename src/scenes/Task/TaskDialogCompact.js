import React, { useEffect, useState } from "react";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { decodeUUID } from "../../utilities";

import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import { getTaskRequest } from "../../redux/activeTask/ActiveTaskActions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createNotFoundSelector } from "../../redux/LoadingSelectors";
import { getTaskPrefix } from "../../redux/activeTask/ActiveTaskActions";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@material-ui/core/Typography";
import { determineTaskType } from "../../redux/tasks/task_redux_utilities";
import TaskOverview from "./components/TaskOverview";

const DialogWrapper = (props) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("xs"));
    const { handleClose } = props;
    const useStyles = makeStyles({
        paper: {
            boxShadow: "none",
            background: theme.palette.background.default,
            padding: 0,
            minHeight: 300,
        },
        root: {
            flexGrow: 1,
        },
    });
    const classes = useStyles();
    return (
        <Dialog
            className={classes.root}
            disableEscapeKeyDown
            fullScreen={isSm}
            maxWidth={"md"}
            fullWidth={true}
            open={true}
            onClose={handleClose}
            PaperProps={{
                className: classes.paper,
            }}
            aria-labelledby="task-dialog"
        >
            {props.children}
        </Dialog>
    );
};

function TaskDialogCompact(props) {
    const dispatch = useDispatch();
    const task = useSelector((state) => state.task.task);
    const [taskStatus, setTaskStatus] = useState("No status");
    const notFoundSelector = createNotFoundSelector([getTaskPrefix]);
    const notFound = useSelector((state) => notFoundSelector(state));
    const history = useHistory();

    let taskUUID = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62);
    } else {
        taskUUID = task.uuid;
    }

    function componentDidMount() {
        dispatch(getTaskRequest(taskUUID));
    }

    useEffect(componentDidMount, [props.location.key]);

    function setStatus() {
        const result = Object.keys(determineTaskType({ task }));
        if (result) {
            if (result.includes("tasksNew")) {
                setTaskStatus("New");
            } else if (result.includes("tasksActive")) {
                setTaskStatus("Active");
            } else if (result.includes("tasksPickedUp")) {
                setTaskStatus("Picked up");
            } else if (result.includes("tasksDelivered")) {
                setTaskStatus("Delivered");
            }
        }
    }

    useEffect(setStatus, [task]);

    const handleClose = (e) => {
        e.stopPropagation();
        if (props.location.state) history.goBack();
        else history.push("/dashboard");
    };

    const statusBar = !task ? (
        <></>
    ) : (
        <StatusBar
            handleClose={handleClose}
            status={taskStatus}
            taskUUID={taskUUID}
        />
    );

    if (!task) {
        return (
            <Dialog open={true}>
                <FormSkeleton />
            </Dialog>
        );
    } else if (notFound) {
        return (
            <DialogWrapper handleClose={handleClose}>
                <NotFound>
                    <Typography>
                        Task with UUID {taskUUID} not found.
                    </Typography>
                </NotFound>
            </DialogWrapper>
        );
    } else {
        return (
            <DialogWrapper handleClose={handleClose}>
                {statusBar}
                <TaskOverview task={task} taskUUID={taskUUID} />
            </DialogWrapper>
        );
    }
}

export default TaskDialogCompact;
