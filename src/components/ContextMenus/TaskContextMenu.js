import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteTaskRequest,
    updateTaskCancelledTimeRequest,
    updateTaskDropoffTimeRequest,
    updateTaskPickupTimeRequest, updateTaskRejectedTimeRequest
} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {createPostingSelector} from "../../redux/selectors";


const initialState = {
    mouseX: null,
    mouseY: null,
};


export default function TaskContextMenu(props) {
    const dispatch = useDispatch();
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

    const deleteOption = <MenuItem style={{display: props.deleteDisabled ? "none" : "inherit", color: "rgb(235, 86, 75)"}} onClick={onDelete}>Delete</MenuItem>;

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
                <MenuItem disabled={ (!!props.pickupTime || !props.assignedRiders.length || !!props.rejectedTime || !!props.cancelledTime)} onClick={onSelectPickedUp}>Mark picked up</MenuItem>
                <MenuItem disabled={ (!!props.dropoffTime || !!!props.pickupTime || !!props.rejectedTime || !!props.cancelledTime) } onClick={onSelectDroppedOff}>Mark delivered</MenuItem>
                <MenuItem disabled={ !!props.rejectedTime || !!props.cancelledTime } onClick={onSelectRejected}>Mark rejected</MenuItem>
                <MenuItem disabled={ !!props.cancelledTime || !!props.rejectedTime } onClick={onSelectCancelled}>Mark cancelled</MenuItem>
                {deleteOption}
            </Menu>
            </>
    );
}

