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
import CommentsSideBar from "./components/CommentsSideBar";
import { Button, Hidden } from "@material-ui/core";
import CommentsSection from "../Comments/CommentsSection";
import * as queries from "../../graphql/queries";
import API from "@aws-amplify/api";

const drawerWidth = 500;
const drawerWidthMd = 400;

const useStyles = makeStyles((theme) => ({
    paper: {
        boxShadow: "none",
        background: theme.palette.background.default,
        padding: 0,
        minHeight: 300,
    },
    root: {
        flexGrow: 1,
        alignItems: "center",
        justify: "center",
    },
    overview: {
        marginRight: drawerWidth,
        [theme.breakpoints.down("md")]: {
            marginRight: drawerWidthMd,
        },
        [theme.breakpoints.down("sm")]: {
            marginRight: 0,
        },
    },
}));

const DialogWrapper = (props) => {
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("xs"));
    const { handleClose } = props;
    const classes = useStyles();
    return (
        <Dialog
            onKeyUp={(e) => {
                if (e.key === "Escape") handleClose(e);
            }}
            className={classes.root}
            disableEscapeKeyDown
            fullScreen={true}
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

const initialLocationState = {
    address: null,
    contact: { name: null, telephone_number: null },
    protected: false,
    listed: false,
};
const initialState = {
    task: {
        id: null,
        reference: "",
        etag: "",
        author: null,
        author_uuid: null,
        pickupLocation: initialLocationState,
        dropoffLocation: initialLocationState,
        patch: null,
        requesterContact: {
            name: null,
            telephoneNumber: null,
        },
        priority: null,
        timeOfCall: null,
        deliverables: null,
        comments: null,
        links: null,
        timePickedUp: null,
        timeDroppedOff: null,
        rider: null,
        assignedRiders: [],
        assignedCoordinators: [],
        timeCancelled: null,
        timeRejected: null,
        createdAt: null,
        updatedAt: null,
        orderInRelay: 0,
        assignedRidersDisplayString: "",
        assignedCoordinatorsDisplayString: "",
    },
    error: null,
};

function TaskDialogCompact(props) {
    const dispatch = useDispatch();
    //const task = useSelector((state) => state.task.task);
    const [taskStatus, setTaskStatus] = useState("No status");
    const notFoundSelector = createNotFoundSelector([getTaskPrefix]);
    const notFound = useSelector((state) => notFoundSelector(state));
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const [isFetching, setIsFetching] = useState(false);
    const [task, setTask] = useState(initialState);

    let taskUUID = null;

    if (props.match) {
        taskUUID = decodeUUID(props.match.params.task_uuid_b62);
    } else {
        taskUUID = task.id;
    }
    async function getTasks() {
        setIsFetching(true);
        try {
            const taskData = await API.graphql({
                query: queries.getTask,
                variables: { id: taskUUID },
            });
            setIsFetching(false);
            const task = taskData.data.getTask;
            setTask(task);
        } catch (error) {
            setIsFetching(false);
            console.log("Request failed", error);
        }
    }
    useEffect(() => getTasks(), []);

    function componentDidMount() {
        //dispatch(getTaskRequest(taskUUID));
    }

    useEffect(componentDidMount, [props.location.key]);

    const handleClose = (e) => {
        e.stopPropagation();
        if (props.location.state) history.goBack();
        else history.push("/dashboard");
    };

    const statusBar =
        !task || notFound ? (
            <Button onClick={handleClose}>Close</Button>
        ) : (
            <StatusBar
                handleClose={handleClose}
                status={task.statusHumanReadable}
                taskUUID={taskUUID}
            />
        );

    if (!task) {
        return (
            <Dialog open={true}>
                <FormSkeleton />
            </Dialog>
        );
    } else if (false) {
        return (
            <DialogWrapper handleClose={handleClose}>
                {statusBar}
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
                <div className={classes.overview}>
                    {statusBar}
                    <TaskOverview task={task} taskUUID={taskUUID} />
                </div>
                <Hidden smDown>
                    <CommentsSideBar
                        width={isMd ? drawerWidthMd : drawerWidth}
                        parentUUID={taskUUID}
                    />
                </Hidden>
                <Hidden mdUp>
                    <CommentsSection parentUUID={taskUUID} />
                </Hidden>
            </DialogWrapper>
        );
    }
}

export default TaskDialogCompact;
