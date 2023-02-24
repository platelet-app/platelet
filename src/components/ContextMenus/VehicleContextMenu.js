import React, { useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deleteVehicleRequest } from "../../redux/vehicles/VehiclesActions";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { createPostingSelector } from "../../redux/LoadingSelectors";
import { deleteButtonStyles } from "./contextMenuCSS";
import { getWhoami } from "../../redux/Selectors";

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function VehicleContextMenu(props) {
    const { classes } = deleteButtonStyles();
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector([
        "DELETE_VEHICLE",
        "RESTORE_VEHICLE",
    ]);
    const isPosting = useSelector((state) => postingSelector(state));
    const whoami = useSelector(getWhoami);

    const dispatch = useDispatch();

    const handleClick = (event) => {
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
                size="large"
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
                <MenuItem
                    className={
                        whoami.roles.includes("ADMIN")
                            ? classes.deleteButton
                            : classes.deleteButtonDisabled
                    }
                    onClick={onDelete}
                >
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
}
