import React, {useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteVehicle,
    restoreVehicle
} from "../../redux/vehicles/VehiclesActions";
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

function VehicleContextMenu(props) {
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector(["DELETE_VEHICLE", "RESTORE_VEHICLE"]);
    const [snack, setSnack] = React.useState(initialSnack)
    const isPosting = useSelector(state => postingSelector(state));
    const whoami = useSelector(state => state.whoami.user);

    const dispatch = useDispatch();

    function dispatchSnack() {
        if (!isPosting) {
            snack.snack();
            setSnack(initialSnack)
        }
    }
    useEffect(dispatchSnack, [isPosting])

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };


    function undoDelete(key) {
        props.closeSnackbar(key);
        dispatch(restoreVehicle(props.vehicleUUID));
    }

    function onDelete() {
        handleClose();
        dispatch(deleteVehicle(props.vehicleUUID));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoDelete(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        const snack = () => {
            props.enqueueSnackbar('VehicleDetail deleted.', {variant: "info", action, autoHideDuration: 8000});
        }
        setSnack({ snack })
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

export default withSnackbar(VehicleContextMenu)