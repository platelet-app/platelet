import React from "react";
import Menu from "@mui/material/Menu";
import makeStyles from "@mui/styles/makeStyles";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { deleteButtonStyles } from "./contextMenuCSS";
import PropTypes from "prop-types";
import * as assigneeActions from "../../redux/taskAssignees/taskAssigneesActions";
import * as models from "../../models/index";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import { tasksStatus, userRoles } from "../../apiConsts";
import {
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import determineTaskStatus from "../../utilities/determineTaskStatus";
import duplicateTask from "../../utilities/duplicateTask";
import generateClipboardTextFromTask from "../../utilities/generateClipboardTextFromTask";
import { copyStringToClipboard } from "../../utilities/copyStringToClipboard";
import CopyFailedDialog from "../CopyFailedDialog";

const initialState = {
    mouseX: null,
    mouseY: null,
};

function TaskContextMenu(props) {
    const dispatch = useDispatch();
    const { task } = props;
    const [state, setState] = React.useState(initialState);
    const [copyText, setCopyText] = React.useState(null);
    const [isPosting, setIsPosting] = React.useState(false);
    const roleView = useSelector(getRoleView);
    const whoami = useSelector(getWhoami);
    const deleteButtonClasses = deleteButtonStyles();
    const taskAssignees = useSelector(taskAssigneesSelector).items;
    const tenantId = useSelector(tenantIdSelector);
    const useStyles = makeStyles({
        taskContextButton: {
            color: props.iconColor || "primary",
        },
    });
    const classes = useStyles();

    const actualRole = ["ALL", userRoles.coordinator].includes(roleView)
        ? userRoles.coordinator
        : userRoles.rider;

    async function copyToClipboard(e) {
        handleClose(e);
        if (!props.task || !props.task.id) {
            dispatch(displayErrorNotification("Copy failed."));
            return;
        }
        try {
            const taskResult = await DataStore.query(
                models.Task,
                props.task.id
            );
            if (!taskResult) throw new Error("Task not found.");
            const deliverables = (
                await DataStore.query(models.Deliverable)
            ).filter((d) => d.task && d.task.id === taskResult.id);
            const result = { ...taskResult, deliverables };
            const textToCopy = generateClipboardTextFromTask(result);
            try {
                copyStringToClipboard(textToCopy).then(
                    function () {
                        dispatch(
                            displayInfoNotification("Copied to clipboard")
                        );
                    },
                    function () {
                        setCopyText(textToCopy);
                    }
                );
            } catch (e) {
                setCopyText(textToCopy);
            }
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Copy failed!"));
        }
    }

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    async function setTimeValue(value, key) {
        try {
            setIsPosting(true);
            const result = await DataStore.query(models.Task, task.id);
            const status = await determineTaskStatus(
                {
                    ...result,
                    [key]: value,
                },
                taskAssignees.filter((ta) => ta.role === userRoles.rider)
            );
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated[key] = value;
                    updated.status = status;
                })
            );
            setIsPosting(false);
        } catch (e) {
            console.log(e);
            setIsPosting(false);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }

    function onSelectPickedUp(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timePickedUp");
        dispatch(
            displayInfoNotification("Task marked picked up", () => {
                setTimeValue(null, "timePickedUp");
            })
        );
    }

    function onSelectDroppedOff(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeDroppedOff");
        dispatch(
            displayInfoNotification("Task marked delivered", () => {
                setTimeValue(null, "timeDroppedOff");
            })
        );
    }
    function onSelectRiderHome(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeRiderHome");
        dispatch(
            displayInfoNotification("Task marked rider home", () => {
                setTimeValue(null, "timeRiderHome");
            })
        );
    }
    function onSelectCancelled(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeCancelled");
        dispatch(
            displayInfoNotification("Task marked cancelled", () => {
                setTimeValue(null, "timeCancelled");
            })
        );
    }

    function onSelectRejected(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeRejected");
        dispatch(
            displayInfoNotification("Task marked rejected", () => {
                setTimeValue(null, "timeRejected");
            })
        );
    }

    function onDelete(e) {
        handleClose(e);
    }

    async function onDuplicate(e) {
        try {
            const { assignment } = await duplicateTask(
                task,
                tenantId,
                whoami.id,
                whoami.id,
                actualRole
            );
            dispatch(assigneeActions.addTaskAssignee(assignment));
            dispatch(displayInfoNotification("Task duplicated to NEW"));
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
        handleClose(e);
    }

    const handleClose = (e) => {
        e.preventDefault();
        setState(initialState);
    };

    return (
        <>
            <IconButton
                aria-label="task options"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                disabled={isPosting}
                size="large"
            >
                <MoreVertIcon className={classes.taskContextButton} />
            </IconButton>
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                }
            >
                <MenuItem
                    disabled={
                        task === null || task.status !== tasksStatus.active
                    }
                    onClick={onSelectPickedUp}
                >
                    Mark picked up
                </MenuItem>
                <MenuItem
                    disabled={
                        task === null || task.status !== tasksStatus.pickedUp
                    }
                    onClick={onSelectDroppedOff}
                >
                    Mark delivered
                </MenuItem>
                <MenuItem
                    disabled={
                        task === null || task.status !== tasksStatus.droppedOff
                    }
                    onClick={onSelectRiderHome}
                >
                    Mark rider home
                </MenuItem>
                <MenuItem
                    disabled={
                        task === null ||
                        [
                            tasksStatus.cancelled,
                            tasksStatus.abandoned,
                            tasksStatus.rejected,
                            tasksStatus.droppedOff,
                            tasksStatus.completed,
                        ].includes(task.status)
                    }
                    onClick={onSelectRejected}
                >
                    Mark rejected
                </MenuItem>
                <MenuItem
                    disabled={
                        task === null ||
                        [
                            tasksStatus.cancelled,
                            tasksStatus.abandoned,
                            tasksStatus.rejected,
                            tasksStatus.droppedOff,
                            tasksStatus.completed,
                        ].includes(task.status)
                    }
                    onClick={onSelectCancelled}
                >
                    Mark cancelled
                </MenuItem>
                {actualRole === userRoles.coordinator && (
                    <MenuItem
                        disabled={
                            task === null ||
                            [
                                tasksStatus.cancelled,
                                tasksStatus.abandoned,
                                tasksStatus.rejected,
                                tasksStatus.completed,
                            ].includes(task.status)
                        }
                        onClick={onDuplicate}
                    >
                        Duplicate
                    </MenuItem>
                )}
                <MenuItem disabled={task === null} onClick={copyToClipboard}>
                    Copy to clipboard
                </MenuItem>
                <MenuItem
                    className={
                        props.disableDeleted
                            ? deleteButtonClasses.deleteButtonDisabled
                            : deleteButtonClasses.deleteButton
                    }
                    onClick={onDelete}
                >
                    Delete
                </MenuItem>
            </Menu>
            <CopyFailedDialog
                text={copyText}
                onClose={() => setCopyText(null)}
            />
        </>
    );
}

TaskContextMenu.propTypes = {
    task: PropTypes.object,
    iconColor: PropTypes.string,
    disableDeleted: PropTypes.bool,
    disableRelay: PropTypes.bool,
    assignedRiders: PropTypes.arrayOf(PropTypes.object),
};

TaskContextMenu.defaultProps = {
    assignedRiders: [],
    task: null,
};

export default TaskContextMenu;
