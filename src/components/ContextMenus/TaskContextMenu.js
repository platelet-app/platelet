import React, {useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment/min/moment-with-locales';
import {
    deleteTask,
    restoreTask,
    updateTaskCancelledTime,
    updateTaskDropoffTime,
    updateTaskPickupTime, updateTaskRejectedTime
} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import { withSnackbar } from 'notistack';
import {createPostingSelector} from "../../redux/selectors";


const initialState = {
    mouseX: null,
    mouseY: null,
};

const initialSnack = {snack: () => {}}

function TaskContextMenu(props) {
    const [state, setState] = React.useState(initialState);
    const [snack, setSnack] = React.useState(initialSnack)
    const postingSelector = createPostingSelector([
        "DELETE_TASK",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME"]);
    const isPosting = useSelector(state => postingSelector(state));

    function dispatchSnack() {
        if (!isPosting) {
            snack.snack();
            setSnack(initialSnack)
        }
    }
    useEffect(dispatchSnack, [isPosting])

    const dispatch = useDispatch();

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function onSelectPickedUp() {
        handleClose();
        const payload = {time_picked_up: moment.utc().toISOString()};
        dispatch(updateTaskPickupTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoPickup(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        const snack = () => {
            props.enqueueSnackbar('Task marked picked up.',  { variant: "info", action, autoHideDuration: 8000 })
        }
        setSnack({ snack })
    }

    function onSelectDroppedOff() {
        handleClose();
        const payload = {time_dropped_off: moment.utc().toISOString()};
        dispatch(updateTaskDropoffTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoDropoff(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        const snack = () => {
            props.enqueueSnackbar('Task marked delivered.',  { variant: "info", action, autoHideDuration: 8000 });
        }
        setSnack({ snack })
    }
    function onSelectCancelled() {
        handleClose();
        const payload = {time_cancelled: moment.utc().toISOString()};
        dispatch(updateTaskCancelledTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoCancelled(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        const snack = () => {
            props.enqueueSnackbar('Task marked cancelled.', {variant: "info", action, autoHideDuration: 8000});
        }
        setSnack({ snack })
    }

    function onSelectRejected() {
        handleClose();
        const payload = {time_rejected: moment.utc().toISOString()};
        dispatch(updateTaskRejectedTime({ taskUUID: props.taskUUID, payload }));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoRejected(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        const snack = () => {
            props.enqueueSnackbar('Task marked rejected.', {variant: "info", action, autoHideDuration: 8000});
        }
        setSnack({ snack })
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
        const snack = () => {
            props.enqueueSnackbar('Task deleted.', {variant: "info", action, autoHideDuration: 8000});
        }
        setSnack({ snack })
    }


    function undoDelete(key) {
        props.closeSnackbar(key);
        dispatch(restoreTask(props.taskUUID));
    }
    function undoPickup(key) {
        const payload = {time_picked_up: null};
        dispatch(updateTaskPickupTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }
    function undoDropoff(key) {
        const payload = {time_dropped_off: null};
        dispatch(updateTaskDropoffTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }
    function undoRejected(key) {
        const payload = {time_rejected: null};
        dispatch(updateTaskRejectedTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }
    function undoCancelled(key) {
        const payload = {time_cancelled: null};
        dispatch(updateTaskCancelledTime({ taskUUID: props.taskUUID, payload }));
        props.closeSnackbar(key);
    }

    const handleClose = () => {
        setState(initialState);
    };

    const deleteOption = props.deleteDisabled ? <></> : <MenuItem style={{color: "rgb(235, 86, 75)"}} onClick={onDelete}>Delete</MenuItem>;

    return (
        <>
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
                <MenuItem disabled={ (!!props.pickupTime || !props.assignedUsers.length || !!props.rejectedTime || !!props.cancelledTime)} onClick={onSelectPickedUp}>Mark picked up</MenuItem>
                <MenuItem disabled={ (!!props.dropoffTime || !!!props.pickupTime || !!props.rejectedTime || !!props.cancelledTime) } onClick={onSelectDroppedOff}>Mark delivered</MenuItem>
                <MenuItem disabled={ !!props.rejectedTime || !!props.cancelledTime } onClick={onSelectRejected}>Mark rejected</MenuItem>
                <MenuItem disabled={ !!props.cancelledTime || !!props.rejectedTime } onClick={onSelectCancelled}>Mark cancelled</MenuItem>
                {deleteOption}
            </Menu>
            </>
    );
}

export default withSnackbar(TaskContextMenu)