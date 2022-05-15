import React from "react";
import moment from "moment";
import Menu from "@mui/material/Menu";
import makeStyles from "@mui/styles/makeStyles";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { createPostingSelector } from "../../redux/LoadingSelectors";
import { deleteButtonStyles } from "./contextMenuCSS";
import PropTypes from "prop-types";
import * as models from "../../models/index";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import {
    convertListDataToObject,
    copyTaskDataToClipboard,
    determineTaskStatus,
} from "../../utilities";
import { tasksStatus, userRoles } from "../../apiConsts";
import { taskAssigneesSelector } from "../../redux/Selectors";

const initialState = {
    mouseX: null,
    mouseY: null,
};

function TaskContextMenu(props) {
    const dispatch = useDispatch();
    const { task } = props;
    const [state, setState] = React.useState(initialState);
    const [isPosting, setIsPosting] = React.useState(false);
    const deleteButtonClasses = deleteButtonStyles();
    const taskAssignees = useSelector(taskAssigneesSelector).items;
    const useStyles = makeStyles({
        taskContextButton: {
            color: props.iconColor || "primary",
        },
    });
    const classes = useStyles();

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
            if (taskResult) {
                const deliverables = (
                    await DataStore.query(models.Deliverable)
                ).filter((d) => d.task && d.task.id === taskResult.id);
                const result = { ...taskResult, deliverables };
                copyTaskDataToClipboard(result).then(
                    function () {
                        dispatch(
                            displayInfoNotification("Copied to clipboard.")
                        );
                        /* clipboard successfully set */
                    },
                    function () {
                        dispatch(displayErrorNotification("Copy failed."));
                        /* clipboard write failed */
                    }
                );
            } else {
                dispatch(displayErrorNotification("Copy failed."));
            }
        } catch (e) {
            dispatch(displayErrorNotification("Copy failed."));
        }
    }

    const addRelay = (e) => {
        handleClose(e);
    };

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
            dispatch(displayErrorNotification("Sorry, an error occurred."));
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

    const handleClose = (e) => {
        e.preventDefault();
        setState(initialState);
    };

    return (
        <>
            <IconButton
                aria-label="more"
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
                <MenuItem onClick={copyToClipboard}>Copy to clipboard</MenuItem>
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
