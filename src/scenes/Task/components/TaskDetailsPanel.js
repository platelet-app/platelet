import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import PrioritySelect from "./PrioritySelect";
import PropTypes from "prop-types";
import makeStyles from "@mui/styles/makeStyles";
import ClickableTextField from "../../../components/ClickableTextField";
import TimePicker from "./TimePicker";
import { Paper, Skeleton, Stack } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { determineTaskStatus } from "../../../utilities";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";

const useStyles = makeStyles({
    requesterContact: {
        paddingLeft: "20px",
    },
    priority: {
        paddingLeft: "20px",
    },
});

function extractTaskData(task) {
    let {
        reference,
        timeOfCall,
        riderResponsibility,
        id,
        requesterContact,
        priority,
        timeRejected,
        timeCancelled,
        timePickedUp,
        timeDroppedOff,
    } = task;
    if (requesterContact === null) {
        requesterContact = {
            name: null,
            telephoneNumber: null,
        };
    }
    return {
        reference,
        timeOfCall,
        riderResponsibility,
        id,
        requesterContact,
        priority,
        timeRejected,
        timeCancelled,
        timePickedUp,
        timeDroppedOff,
    };
}

function TaskDetailsPanel(props) {
    const cardClasses = dialogCardStyles();
    const [state, setState] = useState({
        reference: null,
        timeOfCall: null,
        timePickedUp: null,
        timeDroppedOff: null,
        priority: null,
        riderResponsibility: null,
        id: null,
        requesterContact: {
            name: null,
            telephoneNumber: null,
        },
    });
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(null);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const dispatch = useDispatch();
    const classes = useStyles();

    const errorMessage = "Sorry, something went wrong";

    async function getTask() {
        if (!dataStoreReadyStatus) {
            return;
        }
        try {
            const task = await DataStore.query(models.Task, props.taskId);
            if (!task) throw new Error("Task not found");
            setState(extractTaskData(task));
            setIsFetching(false);
        } catch (error) {
            console.log(error);
            setErrorState(error);
            setIsFetching(false);
        }
    }
    useEffect(() => getTask(), [props.taskId]);

    async function setTimeWithKey(key, value) {
        try {
            const existingTask = await DataStore.query(
                models.Task,
                props.taskId
            );
            if (!existingTask) throw new Error("Task doesn't exist");
            const assignees = (
                await DataStore.query(models.TaskAssignee)
            ).filter((a) => a.task && a.task.id === props.taskId);
            const status = determineTaskStatus({
                ...existingTask,
                [key]: value.toISOString(),
                assignees,
            });
            if (existingTask.status === status) {
                await DataStore.save(
                    models.Task.copyOf(existingTask, (updated) => {
                        updated[key] = value.toISOString();
                        updated.status = status;
                    })
                );
            } else {
                await DataStore.save(
                    models.Task.copyOf(existingTask, (updated) => {
                        updated[key] = value.toISOString();
                        updated.status = status;
                    })
                );
            }
            setState((prevState) => ({
                ...prevState,
                [key]: value.toISOString(),
            }));
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    function onChangeTimeOfCall(value) {
        //check value is a Date object
        if (value && value instanceof Date) {
            setTimeWithKey("timeOfCall", value);
        }
    }
    function onChangeTimeDroppedOff(value) {
        if (value && value instanceof Date) {
            setTimeWithKey("timeDroppedOff", value);
        }
    }
    function onChangeTimePickedUp(value) {
        if (value && value instanceof Date) {
            setTimeWithKey("timePickedUp", value);
        }
    }

    function onSelectPriority(priority) {
        props.onSelectPriority(priority);
    }

    function onChangeRequesterContact(value) {
        props.onChangeRequesterContact(value);
    }
    if (errorState) {
        return <GetError />;
    } else if (isFetching) {
        return (
            <Paper className={cardClasses.root}>
                <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
        );
    } else {
        return (
            <Paper className={cardClasses.root}>
                <Stack direction={"column"} spacing={1}>
                    <LabelItemPair label={"Reference"}>
                        <Typography>{state.reference}</Typography>
                    </LabelItemPair>
                    <LabelItemPair label={"Time of call"}>
                        <TimePicker
                            onChange={onChangeTimeOfCall}
                            disableClear={true}
                            time={state.timeOfCall}
                        />
                    </LabelItemPair>
                    <Typography>Requester contact:</Typography>
                    <div className={classes.requesterContact}>
                        <LabelItemPair label={"Name"}>
                            <ClickableTextField
                                onFinished={(value) =>
                                    onChangeRequesterContact({
                                        name: value,
                                    })
                                }
                                value={
                                    state.requesterContact
                                        ? state.requesterContact.name
                                        : null
                                }
                            />
                        </LabelItemPair>
                        <LabelItemPair label={"Tel"}>
                            <ClickableTextField
                                tel
                                onFinished={(value) =>
                                    onChangeRequesterContact({
                                        telephoneNumber: value,
                                    })
                                }
                                value={
                                    state.requesterContact
                                        ? state.requesterContact.telephoneNumber
                                        : null
                                }
                            />
                        </LabelItemPair>
                    </div>
                    <Typography>Priority:</Typography>
                    <div className={classes.priority}>
                        <PrioritySelect
                            onSelect={onSelectPriority}
                            priority={state.priority}
                        />
                    </div>
                    <LabelItemPair label={"Responsibility"}>
                        <Typography>
                            {state.riderResponsibility
                                ? state.riderResponsibility.label
                                : ""}
                        </Typography>
                    </LabelItemPair>
                    <LabelItemPair label={"Time picked up"}>
                        <TimePicker
                            onChange={onChangeTimePickedUp}
                            disableClear
                            time={state.timePickedUp}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"Time delivered"}>
                        <TimePicker
                            disableClear
                            onChange={onChangeTimeDroppedOff}
                            time={state.timeDroppedOff}
                        />
                    </LabelItemPair>
                </Stack>
            </Paper>
        );
    }
}

TaskDetailsPanel.propTypes = {
    taskId: PropTypes.string.isRequired,
};

export default TaskDetailsPanel;
