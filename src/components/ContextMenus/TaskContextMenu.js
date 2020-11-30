import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    addTaskRelayRequest,
    deleteTaskRequest,
    updateTaskCancelledTimeRequest, updateTaskDropoffAddressRequest,
    updateTaskDropoffTimeRequest,
    updateTaskPickupTimeRequest, updateTaskRejectedTimeRequest
} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {createPostingSelector} from "../../redux/selectors";
import {deleteButtonStyles} from "./contextMenuCSS";


const initialState = {
    mouseX: null,
    mouseY: null,
};



export default function TaskContextMenu(props) {
    const dispatch = useDispatch();
    const [state, setState] = React.useState(initialState);
    const classes = deleteButtonStyles();
    const postingSelector = createPostingSelector([
        "DELETE_TASK",
        "ADD_TASK_RELAY",
        "RESTORE_TASK",
        "UPDATE_TASK",
        "UPDATE_TASK_PICKUP_TIME",
        "UPDATE_TASK_DROPOFF_TIME",
        "UPDATE_TASK_CANCELLED_TIME",
        "UPDATE_TASK_REJECTED_TIME"]);
    const isPosting = useSelector(state => postingSelector(state));

    const {
        relayNext,
    } = props

    const addRelay = React.useCallback(() => {
        handleClose();
        dispatch(addTaskRelayRequest(props.taskUUID));

    }, [])

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function onSelectPickedUp() {
        handleClose();
        const payload = {time_picked_up: new Date().toISOString()};
        dispatch(updateTaskPickupTimeRequest({ taskUUID: props.taskUUID, payload }));
    }

    function onSelectDroppedOff() {
        handleClose();
        const payload = {time_dropped_off: new Date().toISOString()};
        dispatch(updateTaskDropoffTimeRequest({ taskUUID: props.taskUUID, payload }));
    }
    function onSelectCancelled() {
        handleClose();
        const payload = {time_cancelled: new Date().toISOString()};
        dispatch(updateTaskCancelledTimeRequest({ taskUUID: props.taskUUID, payload }));
    }

    function onSelectRejected() {
        handleClose();
        const payload = {time_rejected: new Date().toISOString()};
        dispatch(updateTaskRejectedTimeRequest({ taskUUID: props.taskUUID, payload }));
    }

    function onDelete(result) {
        handleClose();
        if (result)
            dispatch(deleteTaskRequest(props.taskUUID));
    }


    const handleClose = () => {
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
                <MenuItem disabled={ (!!props.timePickedUp || !props.assignedRiders.length || !!props.timeRejected || !!props.timeCancelled)} onClick={onSelectPickedUp}>Mark picked up</MenuItem>
                <MenuItem disabled={ (!!props.timeDroppedOff || !!!props.timePickedUp || !!props.timeRejected || !!props.timeCancelled) } onClick={onSelectDroppedOff}>Mark delivered</MenuItem>
                <MenuItem disabled={ !!props.timeRejected || !!props.timeCancelled } onClick={onSelectRejected}>Mark rejected</MenuItem>
                <MenuItem disabled={ !!props.timeCancelled || !!props.timeRejected } onClick={onSelectCancelled}>Mark cancelled</MenuItem>
                <MenuItem
                    disabled={!!relayNext}
                    onClick={() => {
                        addRelay({
                        })
                    }}>
                    Add relay
                </MenuItem>
                <MenuItem className={props.deleteDisabled ? classes.deleteButtonDisabled : classes.deleteButton} onClick={onDelete}>Delete</MenuItem>
            </Menu>
        </>
    );
}

