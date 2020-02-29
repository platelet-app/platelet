import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment/min/moment-with-locales';
import {deleteTask, updateTask} from "../redux/Actions";
import {useDispatch} from "react-redux";

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function TaskContextMenu(props) {
    const [state, setState] = React.useState(initialState);

    const dispatch = useDispatch();

    const handleClick = event => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    function sendData(payload, updateData) {
        const updateDataCombined = {...payload, ...updateData};
        dispatch(updateTask({payload: payload, taskId: props.task.uuid, updateData: updateDataCombined ? updateDataCombined : {}}));
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
        dispatch(deleteTask(props.task.uuid));
        handleClose();
    }

    const handleClose = () => {
        setState(initialState);
    };

    return (
        <div onContextMenu={handleClick} style={{ cursor: 'context-menu' }}>
            {props.children}
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
                <MenuItem disabled={props.task.pickup_time} onClick={onSelectPickedUp}>Mark picked up</MenuItem>
                <MenuItem disabled={(props.task.dropoff_time || !props.task.pickup_time)} onClick={onSelectDroppedOff}>Mark delivered</MenuItem>
                <MenuItem style={{color: "rgb(235, 86, 75)"}} onClick={onSelectDelete}>Delete</MenuItem>
            </Menu>
        </div>
    );
}
