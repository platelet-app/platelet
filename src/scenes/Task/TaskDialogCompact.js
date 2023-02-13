import React, { useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import Dialog from "@mui/material/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { decodeUUID } from "../../utilities";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from 'tss-react/mui';
import useMediaQuery from "@mui/material/useMediaQuery";
import NotFound from "../../ErrorComponents/NotFound";
import GetError from "../../ErrorComponents/GetError";
import Typography from "@mui/material/Typography";
import TaskOverview from "./components/TaskOverview";
import CommentsSideBar from "./components/CommentsSideBar";
import { Button, Hidden } from "@mui/material";
import * as models from "../../models/index";
import { DataStore } from "aws-amplify";
import { dataStoreModelSyncedStatusSelector } from "../../redux/Selectors";
import { useHistory, useLocation, useParams } from "react-router";
import { setSelectionActionsPending } from "../../redux/selectionMode/selectionModeActions";

const drawerWidth = 420;
const drawerWidthMd = 420;

const useStyles = makeStyles()((theme) => ({
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
        [theme.breakpoints.down("lg")]: {
            marginRight: drawerWidthMd,
        },
        [theme.breakpoints.down("md")]: {
            marginRight: 0,
        },
    },
}));

const DialogWrapper = (props) => {
    const { handleClose } = props;
    const { classes } = useStyles();
    return (
        <Dialog
            onKeyUp={(e) => {
                // could enable this to close the dialog on escape
                return;
                // if (e.key === "Escape") handleClose(e);
            }}
            className={classes.root}
            disableEscapeKeyDown
            fullScreen
            maxWidth={"md"}
            fullWidth
            open
            onClose={handleClose}
            PaperProps={{
                className: classes.paper,
            }}
            aria-label="task-dialog"
        >
            {props.children}
        </Dialog>
    );
};

function TaskDialogCompact(props) {
    const [notFound, setNotFound] = useState(false);
    const { classes } = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("lg"));
    const taskObserver = useRef({ unsubscribe: () => {} });
    const [isFetching, setIsFetching] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const tasksSynced = useSelector(dataStoreModelSyncedStatusSelector).Task;
    let { task_uuid_b62 } = useParams();
    const taskId = decodeUUID(task_uuid_b62);

    const getTask = React.useCallback(async (taskId) => {
        setIsFetching(true);
        try {
            const taskData = await DataStore.query(models.Task, taskId);
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                taskId
            ).subscribe(async (observeResult) => {
                if (observeResult.opType === "DELETE") {
                    setNotFound(true);
                }
            });
            if (taskData) {
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setIsFetching(false);
        } catch (error) {
            setIsFetching(false);
            setErrorState(error);
            console.error("Request failed", error);
        }
    }, []);
    useEffect(() => getTask(taskId), [taskId, tasksSynced, getTask]);

    const history = useHistory();
    const location = useLocation();

    function onClose(e) {
        e.stopPropagation();
        if (location.state) history.goBack();
        else history.push("/");
    }

    const statusBar = notFound ? (
        <Button onClick={onClose}>Close</Button>
    ) : (
        <StatusBar handleClose={onClose} taskId={taskId} />
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectionActionsPending(true));
        return () => dispatch(setSelectionActionsPending(false));
    }, [dispatch]);

    if (notFound) {
        return (
            <DialogWrapper handleClose={onClose}>
                {statusBar}
                <NotFound>
                    <Typography>Task with UUID {taskId} not found.</Typography>
                </NotFound>
            </DialogWrapper>
        );
    } else if (errorState) {
        return (
            <DialogWrapper handleClose={onClose}>
                {statusBar}
                <GetError>
                    <Typography>
                        {errorState && errorState.message
                            ? errorState.message
                            : "Unknown"}
                    </Typography>
                </GetError>
            </DialogWrapper>
        );
    } else {
        return (
            <DialogWrapper handleClose={onClose}>
                <div className={classes.overview}>
                    {statusBar}
                    <TaskOverview isFetching={isFetching} taskId={taskId} />
                    <Hidden mdDown>
                        <CommentsSideBar
                            taskId={taskId}
                            width={isMd ? drawerWidthMd : drawerWidth}
                            parentUUID={taskId}
                        />
                    </Hidden>
                </div>
            </DialogWrapper>
        );
    }
}

export default TaskDialogCompact;
