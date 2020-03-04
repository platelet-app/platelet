import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment/min/moment-with-locales';
import {deleteTask, updateTask} from "../redux/Actions";
import {useDispatch} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';


const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function TaskContextMenu(props) {
    const [state, setState] = React.useState(initialState);

    const dispatch = useDispatch();

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function sendData(payload, updateData) {
        const updateDataCombined = {...payload, ...updateData};
        dispatch(updateTask({payload: payload, taskUUID: props.taskUUID, updateData: updateDataCombined ? updateDataCombined : {}}));
    }

    function onSelectPickedUp() {
        sendData({pickup_time: moment.utc().toISOString()});
        handleClose();
    }

    function onSelectDroppedOff() {
        sendData({dropoff_time: moment.utc().toISOString()});
        handleClose();
    }
    function onSelectDelete() {
        dispatch(deleteTask(props.taskUUID));
        handleClose();
    }

    const handleClose = () => {
        setState(initialState);
    };

    return (
        <div style={{ cursor: 'context-menu', position: "relative" }}>
            {props.children}
            <div style={{ cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex:1000}}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
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
                <MenuItem disabled={props.pickupTime || !props.assignedRider} onClick={onSelectPickedUp}>Mark picked up</MenuItem>
                <MenuItem disabled={(props.dropoffTime || !props.pickupTime)} onClick={onSelectDroppedOff}>Mark delivered</MenuItem>
                <MenuItem style={{color: "rgb(235, 86, 75)"}} onClick={onSelectDelete}>Delete</MenuItem>
            </Menu>
        </div>
        </div>
    );
}
