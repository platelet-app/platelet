import React from "react";
import moment from "moment";
import Menu from "@material-ui/core/Menu";
import { makeStyles } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import {
    addTaskRelayRequest,
    deleteTaskRequest,
    updateTaskDropoffTimeRequest,
    updateTaskPickupTimeRequest,
    updateTaskRejectedTimeRequest,
    updateTaskCancelledTimeRequest,
} from "../../redux/tasks/TasksActions";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import { createPostingSelector } from "../../redux/LoadingSelectors";
import { deleteButtonStyles } from "./contextMenuCSS";
import PropTypes from "prop-types";
import { findExistingTask } from "../../redux/tasks/task_redux_utilities";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../redux/notifications/NotificationsActions";
import { getTasksSelector, getWhoami } from "../../redux/Selectors";

const initialState = {
    mouseX: null,
    mouseY: null,
};

function TaskContextMenu(props) {
    const dispatch = useDispatch();
    const [state, setState] = React.useState(initialState);
    const roleView = useSelector((state) => state.roleView);
    const whoami = useSelector(getWhoami);
    const deleteButtonClasses = deleteButtonStyles();
    const useStyles = makeStyles({
        button: {
            color: props.iconColor || "primary",
        },
    });
    const classes = useStyles();
    const tasks = useSelector(getTasksSelector);
    const postingSelector = createPostingSelector([
        "DELETE_TASK",
        "ADD_TASK_RELAY",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME",
    ]);
    const isPosting = useSelector((state) => postingSelector(state));

    function copyTaskDataToClipboard(e) {
        handleClose(e);
        const taskData = findExistingTask(tasks, props.taskUUID);
        if (taskData) {
            const data = {
                FROM: taskData.pickup_location
                    ? `${taskData.pickup_location.address.ward || ""} - ${
                          taskData.pickup_location.address.line1 || ""
                      }`
                    : undefined,
                TO: taskData.dropoff_location
                    ? `${taskData.dropoff_location.address.ward || ""} - ${
                          taskData.dropoff_location.address.line1 || ""
                      }`
                    : undefined,
                PRIORITY: taskData.priority || undefined,
                TOC: taskData.time_of_call
                    ? moment(taskData.time_of_call).format("HH:mm")
                    : undefined,
            };

            let result = "";
            let first = true;
            for (const [key, value] of Object.entries(data)) {
                if (value) result += `${first ? "" : " "}${key}: ${value}`;
                first = false;
            }

            navigator.clipboard.writeText(result).then(
                function () {
                    dispatch(displayInfoNotification("Copied to clipboard."));
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
    }

    const addRelay = (e) => {
        handleClose(e);
        dispatch(addTaskRelayRequest(props.taskUUID, roleView, whoami.id));
    };

    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function onSelectPickedUp(e) {
        handleClose(e);
        const payload = { time_picked_up: new Date().toISOString() };
        dispatch(updateTaskPickupTimeRequest(props.taskUUID, payload));
    }

    function onSelectDroppedOff(e) {
        handleClose(e);
        const payload = { time_dropped_off: new Date().toISOString() };
        dispatch(updateTaskDropoffTimeRequest(props.taskUUID, payload));
    }
    function onSelectCancelled(e) {
        handleClose(e);
        const payload = { time_cancelled: new Date().toISOString() };
        dispatch(updateTaskCancelledTimeRequest(props.taskUUID, payload));
    }

    function onSelectRejected(e) {
        handleClose(e);
        const payload = { time_rejected: new Date().toISOString() };
        dispatch(updateTaskRejectedTimeRequest(props.taskUUID, payload));
    }

    function onDelete(e) {
        handleClose(e);
        dispatch(deleteTaskRequest(props.taskUUID));
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
            >
                <MoreVertIcon className={classes.button} />
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
                        !!props.timePickedUp ||
                        props.assignedRiders === null ||
                        !props.assignedRiders.length ||
                        !!props.timeRejected ||
                        !!props.timeCancelled
                    }
                    onClick={onSelectPickedUp}
                >
                    Mark picked up
                </MenuItem>
                <MenuItem
                    disabled={
                        !!props.timeDroppedOff ||
                        !!!props.timePickedUp ||
                        !!props.timeRejected ||
                        !!props.timeCancelled
                    }
                    onClick={onSelectDroppedOff}
                >
                    Mark delivered
                </MenuItem>
                <MenuItem
                    disabled={!!props.timeRejected || !!props.timeCancelled}
                    onClick={onSelectRejected}
                >
                    Mark rejected
                </MenuItem>
                <MenuItem
                    disabled={!!props.timeCancelled || !!props.timeRejected}
                    onClick={onSelectCancelled}
                >
                    Mark cancelled
                </MenuItem>
                <MenuItem
                    disabled={
                        props.disableRelay ||
                        !!props.timeCancelled ||
                        !!props.timeRejected
                    }
                    onClick={addRelay}
                >
                    Add relay
                </MenuItem>
                <MenuItem onClick={copyTaskDataToClipboard}>
                    Save to clipboard
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
        </>
    );
}

TaskContextMenu.propTypes = {
    iconColor: PropTypes.string,
    timePickedUp: PropTypes.string,
    timeDroppedOff: PropTypes.string,
    timeRejected: PropTypes.string,
    timeCancelled: PropTypes.string,
    taskUUID: PropTypes.string,
    disableDeleted: PropTypes.bool,
    disableRelay: PropTypes.bool,
    assignedRiders: PropTypes.arrayOf(PropTypes.object),
};

export default TaskContextMenu;
