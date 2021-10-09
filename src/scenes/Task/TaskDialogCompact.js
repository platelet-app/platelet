import React, { useEffect, useRef, useState } from "react";
import StatusBar from "./components/StatusBar";
import Dialog from "@material-ui/core/Dialog";
import { useSelector } from "react-redux";
import {
    convertListDataToObject,
    decodeUUID,
    determineTaskStatus,
} from "../../utilities";

import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@material-ui/core/Typography";
import TaskOverview from "./components/TaskOverview";
import CommentsSideBar from "./components/CommentsSideBar";
import { Button, Hidden } from "@material-ui/core";
import CommentsSection from "../Comments/CommentsSection";
import * as models from "../../models/index";
import { DataStore } from "aws-amplify";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import _ from "lodash";
import { tasksStatus } from "../../apiConsts";

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
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("md"));
    const [isFetching, setIsFetching] = useState(false);
    const [task, setTask] = useState(initialState);
    // taskDeliverablesRef exists to keep track of which deliverables
    // have been added or removed without resending data to DeliverableGridSelect props by updating state
    const taskDeliverablesRef = useRef({});
    taskDeliverablesRef.current = task.deliverables;
    const taskRef = useRef();
    taskRef.current = task;

    const taskUUID = props.taskId;

    async function getTask() {
        debugger;
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const taskData = await DataStore.query(models.Task, taskUUID);
                const deliverables = await DataStore.query(
                    models.Deliverable,
                    (t) => t.taskDeliverablesId("eq", taskUUID)
                );
                if (taskData)
                    setTask({
                        ...taskData,
                        deliverables:
                            convertListDataToObject(deliverables) || {},
                    });
                else setNotFound(true);
                setIsFetching(false);
            } catch (error) {
                setIsFetching(false);
                console.log("Request failed", error);
            }
        }
    }
    useEffect(() => getTask(), [dataStoreReadyStatus, props.taskId]);

    async function setTimeCancelled(value) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            let status;
            if (value) {
                status = tasksStatus.cancelled;
            } else {
                status = determineTaskStatus({
                    ...result,
                    timeCancelled: value,
                });
            }
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeCancelled = value;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, timeCancelled: value };
            setTask((prevState) => ({
                ...prevState,
                status,
                timeCancelled: value,
            }));
        }
    }

    async function setTimeRejected(value) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            let status;
            if (value) {
                status = tasksStatus.rejected;
            } else {
                status = determineTaskStatus({
                    ...result,
                    timeRejected: value,
                });
            }
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeRejected = value;
                    updated.status = status;
                })
            );
            taskRef.current = { ...taskRef.current, timeRejected: value };
            setTask((prevState) => ({
                ...prevState,
                status,
                timeRejected: value,
            }));
        }
    }

    async function selectPriority(priority) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result) {
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.priority = priority;
                })
            );
        }
    }

    async function updateRequesterContact(requesterValue) {
        const result = await DataStore.query(models.Task, taskUUID);
        if (result && result.requesterContact) {
            await DataStore.save(
                models.AddressAndContactDetails.copyOf(
                    result.requesterContact,
                    (updated) => {
                        for (const [key, value] of Object.entries(
                            requesterValue
                        )) {
                            updated[key] = value;
                        }
                    }
                )
            );
        }
        taskRef.current = {
            ...taskRef.current,
            requesterContact: {
                ...taskRef.current.requesterContact,
                ...requesterValue,
            },
        };
    }

    async function deleteDeliverable(deliverableTypeId) {
        // receive DeliverableTypeId only from selector component
        // check if one of this DeliverableType has already been saved so we can delete it
        const existing = Object.values(taskDeliverablesRef.current).find(
            (d) => d.deliverableTypeDeliverableTypeId === deliverableTypeId
        );
        if (existing) {
            const existingDeliverable = await DataStore.query(
                models.Deliverable,
                existing.id
            );
            if (existingDeliverable)
                await DataStore.delete(existingDeliverable);
            // remove it from the tracking reference
            taskDeliverablesRef.current = _.omit(
                taskDeliverablesRef.current,
                existing.id
            );
        }
    }

    async function updateDeliverables(value) {
        // receive DeliverableType from selector component
        // check if one of this DeliverableType has already been saved
        const existing = Object.values(taskDeliverablesRef.current).find(
            (d) => d.deliverableTypeDeliverableTypeId === value.id
        );
        if (existing) {
            const existingDeliverable = await DataStore.query(
                models.Deliverable,
                existing.id
            );
            if (existingDeliverable) {
                await DataStore.save(
                    models.Deliverable.copyOf(
                        existingDeliverable,
                        (updated) => {
                            for (const [key, v] of Object.entries(value)) {
                                updated[key] = v;
                            }
                        }
                    )
                );
            }
        } else {
            const { id, ...rest } = value;
            const newDeliverable = await DataStore.save(
                new models.Deliverable({
                    taskDeliverablesId: taskUUID,
                    deliverableTypeDeliverableTypeId: id,
                    ...rest,
                })
            );
            // add it to the tracking reference
            taskDeliverablesRef.current[newDeliverable.id] = newDeliverable;
        }
    }

    const statusBar =
        !task || notFound ? (
            <Button onClick={props.onClose}>Close</Button>
        ) : (
            <StatusBar
                handleClose={props.onClose}
                status={task.status}
                taskUUID={taskUUID}
            />
        );

    if (isFetching) {
        return (
            <DialogWrapper handleClose={props.onClose}>
                <FormSkeleton />
            </DialogWrapper>
        );
    } else if (notFound) {
        return (
            <DialogWrapper handleClose={props.onClose}>
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
            <DialogWrapper handleClose={props.onClose}>
                <div className={classes.overview}>
                    {statusBar}
                    <TaskOverview
                        task={task}
                        taskUUID={taskUUID}
                        onSelectPriority={selectPriority}
                        onChangeTimeCancelled={setTimeCancelled}
                        onChangeTimeRejected={setTimeRejected}
                        onChangeRequesterContact={updateRequesterContact}
                        onUpdateDeliverable={updateDeliverables}
                        onDeleteDeliverable={deleteDeliverable}
                    />
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
