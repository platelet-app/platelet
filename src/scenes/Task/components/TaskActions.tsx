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
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import GetError from "../../../ErrorComponents/GetError";
import { useDispatch, useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    taskAssigneesSelector,
} from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import TaskActionConfirmationDialogContents from "./TaskActionConfirmationDialogContents";
import TimePicker from "./TimePicker";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { saveTaskTimeWithKey } from "../utilities";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";
import determineTaskStatus from "../../../utilities/determineTaskStatus";
import TimeAndNamePicker from "./TimeAndNamePicker";
import useTask from "../../../hooks/useTask";
import useTaskAssignees from "../../../hooks/useTaskAssignees";

const fields = {
    timePickedUp: "Picked up",
    timeDroppedOff: "Delivered",
    timeCancelled: "Cancelled",
    timeRejected: "Rejected",
    timeRiderHome: "Rider home",
};

type FieldsKeys = keyof typeof fields;

type NameKeys = "timePickedUpSenderName" | "timeDroppedOffRecipientName";

type SaveValues = {
    [key in FieldsKeys & NameKeys]: string;
};

function lowerCaseFirstLetter(string: string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

const getHumanReadableTimeLabel = (key: FieldsKeys) => {
    return `Time ${lowerCaseFirstLetter(fields[key])}`;
};

type TaskActionsProps = {
    taskId: string;
};

const TaskActions: React.FC<TaskActionsProps> = ({ taskId }) => {
    const [state, setState] = useState<FieldsKeys[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [confirmationKey, setConfirmationKey] = useState<null | FieldsKeys>(
        null
    );
    const [editKey, setEditKey] = useState<FieldsKeys | null>(null);
    const dispatch = useDispatch();
    const cardClasses = dialogCardStyles();
    const currentUserRole = useAssignmentRole(taskId);
    const hasFullPermissions = [
        models.Role.RIDER,
        models.Role.ADMIN,
        models.Role.COORDINATOR,
    ].includes(currentUserRole);
    const errorMessage = "Sorry, something went wrong";

    const taskState = useTask(taskId);

    const taskAssigneesState = useTaskAssignees(taskId);
    const taskAssignees = taskAssigneesState.state;

    const { isFetching, error, notFound } = taskState;
    const task = taskState.state;
    //const setTask = taskState.setState;

    function onClickToggle(key: FieldsKeys) {
        setConfirmationKey(key);
    }

    function onClickEdit(key: FieldsKeys) {
        setEditKey(key);
    }

    function onCancelEdit() {
        setEditKey(null);
    }

    async function setTimeWithKey(key: FieldsKeys, value: Date) {
        setIsPosting(true);
        try {
            const updatedTask = await saveTaskTimeWithKey(
                key,
                value,
                taskId,
                taskAssignees
            );
            //setTask(updatedTask);
            setIsPosting(false);
            setEditKey(null);
        } catch (error) {
            console.log(error);
            setIsPosting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function saveValues(values: SaveValues) {
        setIsPosting(true);
        try {
            const existingTask = await DataStore.query(models.Task, taskId);
            if (!existingTask) {
                throw new Error("Task not found");
            }
            const riderAssignees = taskAssignees.filter(
                (assignee) => assignee.role === models.Role.RIDER
            );
            const status = await determineTaskStatus(
                { ...existingTask, ...values },
                riderAssignees
            );
            const updatedTask = await DataStore.save(
                models.Task.copyOf(existingTask, (upd) => {
                    upd.status = status;
                    for (const key in values) {
                        (upd as any)[key] = (values as any)[key];
                    }
                })
            );
            setConfirmationKey(null);
            setEditKey(null);
            //setTask(updatedTask);
            setIsPosting(false);
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
            setIsPosting(false);
        }
    }

    function calculateState() {
        if (!task) return;
        const result = Object.keys(fields).filter((key) => {
            return !!(task as any)[key];
        });
        setState(result as FieldsKeys[]);
    }

    useEffect(calculateState, [task]);

    function checkDisabled(key: FieldsKeys) {
        if (!hasFullPermissions || notFound) return true;
        const stopped =
            state.includes("timeCancelled") || state.includes("timeRejected");
        if (key === "timeDroppedOff")
            return (
                state.includes("timeRiderHome") ||
                !state.includes("timePickedUp") ||
                stopped
            );
        else if (key === "timePickedUp") {
            const assigneeCheck = taskAssignees.filter(
                (ta) => ta.role === models.Role.RIDER
            );
            return (
                assigneeCheck.length === 0 ||
                state.includes("timeDroppedOff") ||
                stopped
            );
        } else if (key === "timeRiderHome") {
            if (task && task.status === models.TaskStatus.NEW) return true;
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
    if (error) {
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
                                            onClick={() =>
                                                onClickToggle(key as FieldsKeys)
                                            }
                                        >
                                            {state.includes(
                                                key as FieldsKeys
                                            ) ? (
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
                                    const textfieldNameLabel =
                                        key === "timePickedUp"
                                            ? "Sender name"
                                            : "Recipient name";
                                    const disabled =
                                        isPosting ||
                                        isFetching ||
                                        checkDisabled(key);
                                    const tooltipKey =
                                        key === "timePickedUp"
                                            ? "timePickedUpSenderName"
                                            : "timeDroppedOffRecipientName";
                                    const label =
                                        getHumanReadableTimeLabel(key);
                                    let picker = (
                                        <TimePicker
                                            key={editKey}
                                            onChange={(newValue) =>
                                                setTimeWithKey(
                                                    key as FieldsKeys,
                                                    newValue
                                                )
                                            }
                                            onCancelEdit={onCancelEdit}
                                            label={label}
                                            editMode={editKey === key}
                                            onClickEdit={() =>
                                                onClickEdit(key as FieldsKeys)
                                            }
                                            disableClear
                                            disableUnsetMessage
                                            time={task && (task as any)[key]}
                                            hideEditIcon={!hasFullPermissions}
                                        />
                                    );
                                    if (
                                        [
                                            "timePickedUp",
                                            "timeDroppedOff",
                                        ].includes(key)
                                    ) {
                                        picker = (
                                            <TimeAndNamePicker
                                                onChange={(newValue) => {
                                                    const { name, time } =
                                                        newValue;
                                                    const isoString = time
                                                        ? time.toISOString()
                                                        : null;
                                                    const nameKey =
                                                        key === "timePickedUp"
                                                            ? "timePickedUpSenderName"
                                                            : "timeDroppedOffRecipientName";
                                                    saveValues({
                                                        [key]: isoString,
                                                        [nameKey]: name,
                                                    });
                                                }}
                                                onCancelEdit={onCancelEdit}
                                                name={task && task[tooltipKey]}
                                                editMode={editKey === key}
                                                onClickEdit={() =>
                                                    onClickEdit(
                                                        key as FieldsKeys
                                                    )
                                                }
                                                label={label}
                                                nameLabel={textfieldNameLabel}
                                                disableClear
                                                disabled={isPosting}
                                                disableUnsetMessage
                                                time={
                                                    task && (task as any)[key]
                                                }
                                                hideEditIcon={
                                                    !hasFullPermissions
                                                }
                                            />
                                        );
                                    }
                                    return (
                                        <Stack
                                            key={key}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <Typography
                                                onClick={() => {
                                                    if (disabled) return;
                                                    onClickToggle(
                                                        key as FieldsKeys
                                                    );
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
                                            {task && picker}
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
                <TaskActionConfirmationDialogContents
                    onConfirmation={saveValues}
                    key={confirmationKey}
                    nullify={
                        confirmationKey === null
                            ? false
                            : state.includes(confirmationKey)
                    }
                    timeKey={confirmationKey}
                    onClose={() => setConfirmationKey(null)}
                />
            </>
        );
    }
};
export default TaskActions;
