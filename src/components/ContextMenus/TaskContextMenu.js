import React from "react";
import moment from "moment";
import Menu from "@mui/material/Menu";
import makeStyles from '@mui/styles/makeStyles';
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

const initialState = {
    mouseX: null,
    mouseY: null,
};

function TaskContextMenu(props) {
    const dispatch = useDispatch();
    const { task } = props;
    const [state, setState] = React.useState(initialState);
    const deleteButtonClasses = deleteButtonStyles();
    const useStyles = makeStyles({
        button: {
            color: props.iconColor || "primary",
        },
    });
    const classes = useStyles();
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

    async function copyTaskDataToClipboard(e) {
        handleClose(e);
        if (!props.task || !props.task.id) {
            dispatch(displayErrorNotification("Copy failed."));
            return;
        }
        const taskResult = await DataStore.query(models.Task, props.task.id);
        if (taskResult) {
            const { pickUpLocation, priority, dropOffLocation, timeOfCall } =
                taskResult;
            const data = {
                FROM: pickUpLocation
                    ? `${pickUpLocation.ward || ""} - ${
                          pickUpLocation.line1 || ""
                      }`
                    : undefined,
                TO: dropOffLocation
                    ? `${dropOffLocation.ward || ""} - ${
                          dropOffLocation.line1 || ""
                      }`
                    : undefined,
                PRIORITY: priority || undefined,
                TOC: timeOfCall
                    ? moment(timeOfCall).format("HH:mm")
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
        const payload = new Date().toISOString();
        props.onSetTimePickedUp(payload);
        dispatch(
            displayInfoNotification("Task marked picked up", () => {
                props.onSetTimePickedUp(null);
            })
        );
    }

    function onSelectDroppedOff(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        props.onSetTimeDroppedOff(payload);
        dispatch(
            displayInfoNotification("Task marked delivered", () => {
                props.onSetTimeDroppedOff(null);
            })
        );
    }
    function onSelectCancelled(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        props.onSetTimeCancelled(payload);
        dispatch(
            displayInfoNotification("Task marked cancelled", () => {
                props.onSetTimeCancelled(null);
            })
        );
    }

    function onSelectRejected(e) {
        handleClose(e);
        const payload = new Date().toISOString();
        props.onSetTimeRejected(payload);
        dispatch(
            displayInfoNotification("Task marked rejected", () => {
                props.onSetTimeRejected(null);
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

    return <>
        <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            disabled={isPosting}
            size="large">
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
                    task === null ||
                    !!task.timePickedUp ||
                    !props.assignedRiders.length > 0 ||
                    !!task.timeRejected ||
                    !!task.timeCancelled
                }
                onClick={onSelectPickedUp}
            >
                Mark picked up
            </MenuItem>
            <MenuItem
                disabled={
                    task === null ||
                    !!task.timeDroppedOff ||
                    !!!task.timePickedUp ||
                    !!task.timeRejected ||
                    !!task.timeCancelled
                }
                onClick={onSelectDroppedOff}
            >
                Mark delivered
            </MenuItem>
            <MenuItem
                disabled={
                    task === null ||
                    !!task.timeRejected ||
                    !!task.timeCancelled
                }
                onClick={onSelectRejected}
            >
                Mark rejected
            </MenuItem>
            <MenuItem
                disabled={
                    task === null ||
                    !!task.timeCancelled ||
                    !!task.timeRejected
                }
                onClick={onSelectCancelled}
            >
                Mark cancelled
            </MenuItem>
            <MenuItem
                disabled={
                    props.disableRelay ||
                    task === null ||
                    !!task.timeCancelled ||
                    !!task.timeRejected
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
    </>;
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
