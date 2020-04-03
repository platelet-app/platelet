import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment/min/moment-with-locales';
import {
    deleteTask,
    restoreTask,
    updateTaskCancelledTime,
    updateTaskDropoffTime,
    updateTaskPickupTime, updateTaskRejectedTime
} from "../redux/tasks/Actions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import { withSnackbar } from 'notistack';
import {createPostingSelector} from "../redux/selectors";


const initialState = {
    mouseX: null,
    mouseY: null,
};

function TaskContextMenu(props) {
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector([
        "DELETE_TASK",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME"]);
    const isPosting = useSelector(state => postingSelector(state));

    const dispatch = useDispatch();

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function onSelectPickedUp() {
        handleClose();
        const payload = {pickup_time: moment.utc().toISOString()};
        dispatch(updateTaskPickupTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoPickup(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        props.enqueueSnackbar('Task marked picked up.',  { variant: "info", action, autoHideDuration: 8000 });
    }

    function onSelectDroppedOff() {
        handleClose();
        const payload = {dropoff_time: moment.utc().toISOString()};
        dispatch(updateTaskDropoffTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoDropoff(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        props.enqueueSnackbar('Task marked delivered.',  { variant: "info", action, autoHideDuration: 8000 });
    }
    function onSelectCancelled() {
        handleClose();
        const payload = {cancelled_time: moment.utc().toISOString()};
        dispatch(updateTaskCancelledTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoCancelled(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        props.enqueueSnackbar('Task marked cancelled.',  { variant: "info", action, autoHideDuration: 8000 });
    }

    function onSelectRejected() {
        handleClose();
        const payload = {rejected_time: moment.utc().toISOString()};
        dispatch(updateTaskRejectedTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoRejected(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        props.enqueueSnackbar('Task marked rejected.',  { variant: "info", action, autoHideDuration: 8000 });
    }

    function undoDelete(key) {
        props.closeSnackbar(key);
        dispatch(restoreTask(props.taskUUID));
    }
    function undoPickup(key) {
        const payload = {pickup_time: null};
        dispatch(updateTaskPickupTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }
    function undoDropoff(key) {
        const payload = {dropoff_time: null};
        dispatch(updateTaskDropoffTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }
    function undoRejected(key) {
        const payload = {rejected_time: null};
        dispatch(updateTaskRejectedTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }
    function undoCancelled(key) {
        const payload = {cancelled_time: null};
        dispatch(updateTaskCancelledTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }

    function onDelete(result) {
        handleClose();
        if (result)
            dispatch(deleteTask(props.taskUUID));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoDelete(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        props.enqueueSnackbar('Task deleted.',  { variant: "info", action, autoHideDuration: 8000 });
    }

    const handleClose = () => {
        setState(initialState);
    };

    const deleteOption = props.deleteDisabled ? <></> : <MenuItem style={{color: "rgb(235, 86, 75)"}} onClick={onDelete}>Delete</MenuItem>;

    return (
        <>
        <div style={{ cursor: 'context-menu', position: "relative" }}>
            {props.children}
            <div style={{ cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex:1000}}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                disabled={isPosting}
            >
                <MoreVertIcon />
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
                <MenuItem disabled={ (props.pickupTime || !props.assignedRider || props.rejectedTime || props.cancelledTime)} onClick={onSelectPickedUp}>Mark picked up</MenuItem>
                <MenuItem disabled={ (props.dropoffTime || !props.pickupTime || props.rejectedTime || props.cancelledTime) } onClick={onSelectDroppedOff}>Mark delivered</MenuItem>
                <MenuItem disabled={ props.rejectedTime || props.cancelledTime } onClick={onSelectRejected}>Mark rejected</MenuItem>
                <MenuItem disabled={ props.cancelledTime || props.rejectedTime } onClick={onSelectCancelled}>Mark cancelled</MenuItem>
                {deleteOption}
            </Menu>
        </div>
        </div>
            </>
    );
}

export default withSnackbar(TaskContextMenu)