import {
    Divider,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import GetError from "../../../ErrorComponents/GetError";
import { useDispatch, useSelector } from "react-redux";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import TaskActionConfirmationDialogContents from "./TaskActionConfirmationDialogContents";
import TimePicker from "./TimePicker";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { saveTaskTimeWithKey } from "../utilities";
import { tasksStatus } from "../../../apiConsts";

const fields = {
    timePickedUp: "Picked up",
    timeDroppedOff: "Delivered",
    timeCancelled: "Cancelled",
    timeRejected: "Rejected",
    timeRiderHome: "Rider home",
};

function humanReadableConfirmation(field, nullify) {
    switch (field) {
        case "timePickedUp":
            return nullify
                ? "Clear the picked up time?"
                : "Set the picked up time?";
        case "timeDroppedOff":
            return nullify
                ? "Clear the delivered time?"
                : "Set the delivered time?";
        case "timeCancelled":
            return nullify
                ? "Clear the cancelled time?"
                : "Set the cancelled time?";
        case "timeRejected":
            return nullify
                ? "Clear the rejected time?"
                : "Set the rejected time?";
        case "timeRiderHome":
            return nullify
                ? "Clear the rider home time?"
                : "Set the rider home time?";
        default:
            return "";
    }
}

function TaskActions(props) {
    const [state, setState] = useState([]);
    const [task, setTask] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const confirmationKey = useRef(null);
    const taskObserver = useRef({ unsubscribe: () => {} });
    const timeSet = useRef(new Date());
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const dispatch = useDispatch();
    const cardClasses = dialogCardStyles();

    const errorMessage = "Sorry, something went wrong";

    function onClickToggle(key) {
        confirmationKey.current = key;
        timeSet.current = new Date();
        setConfirmDialogOpen(true);
    }

    function onAdjustTimeSet(time) {
        timeSet.current = time;
    }

    function onChange(key) {
        const value = state.includes(key) ? null : timeSet.current;
        setTimeWithKey(key, value);
    }

    async function setTimeWithKey(key, value) {
        setIsPosting(true);
        try {
            await saveTaskTimeWithKey(key, value, props.taskId);
            setIsPosting(false);
        } catch (error) {
            console.log(error);
            setIsPosting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    function calculateState() {
        if (!task) return;
        const result = Object.keys(fields).filter((key) => {
            return !!task[key];
        });
        setState(result);
    }

    useEffect(calculateState, [task]);

    async function getTaskAndUpdateState() {
        if (!dataStoreReadyStatus) return;
        try {
            const task = await DataStore.query(models.Task, props.taskId);
            if (!task) throw new Error("Task not found");
            setTask(task);
            setIsFetching(false);
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                props.taskId
            ).subscribe(async (observeResult) => {
                const taskData = observeResult.element;
                if (observeResult.opType === "INSERT") {
                    setTask(taskData);
                } else if (observeResult.opType === "UPDATE") {
                    setTask((prevState) => ({ ...prevState, ...taskData }));
                } else if (observeResult.opType === "DELETE") {
                    // just disable the buttons if the task is deleted
                    setIsFetching(true);
                }
            });
        } catch (e) {
            setIsFetching(false);
            console.log(e);
            setErrorState(e);
        }
    }

    useEffect(
        () => getTaskAndUpdateState(),
        [props.taskId, dataStoreReadyStatus]
    );

    useEffect(() => () => taskObserver.current.unsubscribe(), []);

    function checkDisabled(key) {
        const stopped =
            state.includes("timeCancelled") || state.includes("timeRejected");
        if (key === "timeDroppedOff")
            return (
                state.includes("timeRiderHome") ||
                !state.includes("timePickedUp") ||
                stopped
            );
        else if (key === "timePickedUp")
            return state.includes("timeDroppedOff") || stopped;
        else if (key === "timeRiderHome") {
            if (task && task.status === tasksStatus.new) return true;
            return !state.includes("timeDroppedOff");
        } else if (key === "timeRejected") {
            if (state.includes("timeRejected")) return false;
            return (
                (state.includes("timePickedUp") &&
                    state.includes("timeDroppedOff")) ||
                stopped
            );
        } else if (key === "timeCancelled") {
            if (state.includes("timeCancelled")) return false;
            return (
                (state.includes("timePickedUp") &&
                    state.includes("timeDroppedOff")) ||
                stopped
            );
        } else return false;
    }

    if (errorState) {
        return <GetError />;
    } else {
        return (
            <>
                <Paper className={cardClasses.root}>
                    <Stack direction={"column"} spacing={2}>
                        <Typography variant={"h6"}>Actions</Typography>
                        <Divider />
                        <Stack
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                            direction="row"
                        >
                            <ToggleButtonGroup
                                value={state}
                                orientation="vertical"
                                aria-label="task actions"
                            >
                                {Object.entries(fields).map(([key, value]) => {
                                    return (
                                        <ToggleButton
                                            data-cy={`task-${key}-button`}
                                            sx={{
                                                paddingTop: 1.5,
                                                paddingBottom: 1.5,
                                            }}
                                            key={key}
                                            disabled={
                                                isPosting ||
                                                isFetching ||
                                                checkDisabled(key)
                                            }
                                            aria-disabled={
                                                isPosting ||
                                                isFetching ||
                                                checkDisabled(key)
                                            }
                                            aria-label={value}
                                            value={key}
                                            onClick={() => onClickToggle(key)}
                                        >
                                            {state.includes(key) ? (
                                                <CheckBoxIcon />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )}
                                        </ToggleButton>
                                    );
                                })}
                            </ToggleButtonGroup>
                            <Stack sx={{ width: "100%" }} direction="column">
                                {Object.entries(fields).map(([key, value]) => {
                                    const disabled =
                                        isPosting ||
                                        isFetching ||
                                        checkDisabled(key);
                                    return (
                                        <Stack
                                            justifyContent="space-between"
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <Typography
                                                onClick={() => {
                                                    if (disabled) return;
                                                    onClickToggle(key);
                                                }}
                                                sx={{
                                                    paddingTop: 1.5,
                                                    paddingBottom: 1.5,
                                                    cursor: disabled
                                                        ? "default"
                                                        : "pointer",
                                                    color: disabled
                                                        ? "gray"
                                                        : "text.primary",
                                                }}
                                            >
                                                {value.toUpperCase()}
                                            </Typography>
                                            <TimePicker
                                                onChange={(newValue) =>
                                                    setTimeWithKey(
                                                        key,
                                                        newValue
                                                    )
                                                }
                                                disableClear
                                                disableUnsetMessage
                                                time={task && task[key]}
                                            />
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
                <ConfirmationDialog
                    open={confirmDialogOpen}
                    dialogTitle={humanReadableConfirmation(
                        confirmationKey.current,
                        state.includes(confirmationKey.current)
                    )}
                    onConfirmation={() => {
                        setConfirmDialogOpen(false);
                        onChange(confirmationKey.current);
                    }}
                    onClose={() => {
                        if (state.includes(confirmationKey.current))
                            setConfirmDialogOpen(false);
                    }}
                    onCancel={() => setConfirmDialogOpen(false)}
                >
                    <TaskActionConfirmationDialogContents
                        onChange={(v) => onAdjustTimeSet(v)}
                        nullify={state.includes(confirmationKey.current)}
                        field={confirmationKey.current}
                    />
                </ConfirmationDialog>
            </>
        );
    }
}

TaskActions.propTypes = {
    taskId: PropTypes.string.isRequired,
};

export default TaskActions;
