import React, { useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import Dialog from "@mui/material/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { decodeUUID, determineTaskStatus } from "../../utilities";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NotFound from "../../ErrorComponents/NotFound";
import GetError from "../../ErrorComponents/GetError";
import Typography from "@mui/material/Typography";
import TaskOverview from "./components/TaskOverview";
import CommentsSideBar from "./components/CommentsSideBar";
import { Button, Divider, Hidden, Stack } from "@mui/material";
import CommentsSection from "../Comments/CommentsSection";
import * as models from "../../models/index";
import { DataStore } from "aws-amplify";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import _ from "lodash";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { useHistory, useLocation, useParams } from "react-router";
import TaskAssignmentsPanel from "./components/TaskAssignmentsPanel";
import PropTypes from "prop-types";

const drawerWidth = 420;
const drawerWidthMd = 420;

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
        [theme.breakpoints.down("lg")]: {
            marginRight: drawerWidthMd,
        },
        [theme.breakpoints.down("md")]: {
            marginRight: 0,
        },
    },
}));

const errorMessage = "Sorry, an error occurred";

const DialogWrapper = (props) => {
    const { handleClose } = props;
    const classes = useStyles();
    return (
        <Dialog
            onKeyUp={(e) => {
                // could enable this to close the dialog on escape
                return;
                if (e.key === "Escape") handleClose(e);
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

const initialState = {
    id: null,
    reference: "",
    etag: "",
    author: null,
    author_uuid: null,
    pickUpLocation: null,
    dropOffLocation: null,
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
};

function TaskDialogCompact(props) {
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("lg"));
    const [isFetching, setIsFetching] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const [state, setState] = useState(initialState);
    const taskRef = useRef();
    taskRef.current = state;
    const taskObserver = useRef({ unsubscribe: () => {} });
    const dispatch = useDispatch();
    let { task_uuid_b62 } = useParams();
    const taskUUID = decodeUUID(task_uuid_b62);

    async function getTask() {
        setIsFetching(true);
        if (!dataStoreReadyStatus) {
            return;
        } else {
            try {
                const taskData = await DataStore.query(models.Task, taskUUID);
                if (taskData) {
                    setState({
                        ...taskData,
                    });
                    taskObserver.current.unsubscribe();
                    taskObserver.current = DataStore.observe(
                        models.Task,
                        taskUUID
                    ).subscribe(async (observeResult) => {
                        const taskData = observeResult.element;
                        if (observeResult.opType === "INSERT") {
                            setState(taskData);
                        } else if (observeResult.opType === "UPDATE") {
                            if (
                                taskData.taskRiderResponsibilityId ||
                                taskData.taskRiderResponsibilityId === null
                            ) {
                                let riderResponsibility = null;
                                if (taskData.taskRiderResponsibilityId)
                                    riderResponsibility = await DataStore.query(
                                        models.RiderResponsibility,
                                        taskData.taskRiderResponsibilityId
                                    );
                                setState((prevState) => ({
                                    ...prevState,
                                    ...taskData,
                                    riderResponsibility,
                                }));
                            } else {
                                setState((prevState) => ({
                                    ...prevState,
                                    ...taskData,
                                }));
                            }
                        } else if (observeResult.opType === "DELETE") {
                            console.log("DELETE", observeResult);
                            setNotFound(true);
                            setState(initialState);
                        }
                        const task = observeResult.element;
                        setState((prevState) => ({ ...prevState, ...task }));
                    });
                } else {
                    setNotFound(true);
                }
                setIsFetching(false);
            } catch (error) {
                setIsFetching(false);
                setErrorState(error);
                console.error("Request failed", error);
            }
        }
    }
    useEffect(() => getTask(), [dataStoreReadyStatus, props.taskId]);

    useEffect(() => () => taskObserver.current.unsubscribe(), []);

    async function setTimeOfCall(value) {
        try {
            const result = await DataStore.query(models.Task, taskUUID);
            if (!result) throw new Error("Task doesn't exist");
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeOfCall = value;
                })
            );
            taskRef.current = { ...taskRef.current, timeOfCall: value };
            setState((prevState) => ({
                ...prevState,
                timeOfCall: value,
            }));
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function setTimeWithKey(value, key) {
        try {
            let result;
            if (value && typeof value === "object" && !!value.toISOString) {
                result = value.toISOString();
            } else {
                result = value;
            }
            const existingTask = await DataStore.query(models.Task, taskUUID);
            if (!existingTask) throw new Error("Task doesn't exist");
            const status = await determineTaskStatus({
                ...existingTask,
                [key]: result,
            });
            await DataStore.save(
                models.Task.copyOf(existingTask, (updated) => {
                    updated[key] = result;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, [key]: value };
            setState((prevState) => ({
                ...prevState,
                status,
                [key]: value,
            }));
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function selectPriority(priority) {
        try {
            const result = await DataStore.query(models.Task, taskUUID);
            if (!result) throw new Error("Task doesn't exist");
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.priority = priority;
                })
            );
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function updateRequesterContact(requesterValue) {
        try {
            const result = await DataStore.query(models.Task, taskUUID);
            if (!result) throw new Error("Task doesn't exist");
            if (!result.requesterContact) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated.requesterContact = requesterValue;
                    })
                );
            } else {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        for (const [key, value] of Object.entries(
                            requesterValue
                        )) {
                            updated.requesterContact[key] = value;
                        }
                    })
                );
            }
            taskRef.current = {
                ...taskRef.current,
                requesterContact: {
                    ...taskRef.current.requesterContact,
                    ...requesterValue,
                },
            };
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    const history = useHistory();
    const location = useLocation();

    function onClose(e) {
        e.stopPropagation();
        if (location.state) history.goBack();
        else history.push("/");
    }

    const statusBar =
        !state || notFound ? (
            <Button onClick={onClose}>Close</Button>
        ) : (
            <StatusBar
                handleClose={onClose}
                status={state.status}
                taskId={taskUUID}
            />
        );

    if (notFound) {
        return (
            <DialogWrapper handleClose={onClose}>
                {statusBar}
                <NotFound>
                    <Typography>
                        Task with UUID {taskUUID} not found.
                    </Typography>
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
                    <TaskOverview
                        isFetching={isFetching}
                        task={state}
                        taskUUID={taskUUID}
                        onSelectPriority={selectPriority}
                        onChangeTimePickedUp={(value) =>
                            setTimeWithKey(value, "timePickedUp")
                        }
                        onChangeTimeDroppedOff={(value) =>
                            setTimeWithKey(value, "timeDroppedOff")
                        }
                        onChangeTimeCancelled={(value) =>
                            setTimeWithKey(value, "timeCancelled")
                        }
                        onChangeTimeRejected={(value) =>
                            setTimeWithKey(value, "timeRejected")
                        }
                        onChangeTimeOfCall={setTimeOfCall}
                        onChangeRequesterContact={updateRequesterContact}
                    />
                    <Hidden mdDown>
                        <CommentsSideBar
                            taskId={taskUUID}
                            width={isMd ? drawerWidthMd : drawerWidth}
                            parentUUID={taskUUID}
                        />
                    </Hidden>
                </div>
            </DialogWrapper>
        );
    }
}

TaskDialogCompact.propTypes = {
    taskId: PropTypes.string.isRequired,
};

export default TaskDialogCompact;
