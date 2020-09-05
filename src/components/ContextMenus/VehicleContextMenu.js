import React, {useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteVehicleRequest,
} from "../../redux/vehicles/VehiclesActions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {createPostingSelector} from "../../redux/selectors";


const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function VehicleContextMenu(props) {
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector(["DELETE_VEHICLE", "RESTORE_VEHICLE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const whoami = useSelector(state => state.whoami.user);

    const dispatch = useDispatch();


    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };


    function onDelete() {
        handleClose();
        dispatch(deleteVehicleRequest(props.vehicleUUID));
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
                <MenuItem disabled={!whoami.roles.includes("admin")} style={{color: "rgb(235, 86, 75)"}} onClick={onDelete}>Delete</MenuItem>
            </Menu>
            </>
    );
}

