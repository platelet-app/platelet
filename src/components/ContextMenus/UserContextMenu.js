import React, {useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {createPostingSelector} from "../../redux/selectors";
import {deleteUserRequest, restoreUserRequest} from "../../redux/users/UsersActions";
import {deleteButtonStyles} from "./contextMenuCSS";


const initialState = {
    mouseX: null,
    mouseY: null,
};


export default function UserContextMenu(props) {
    const classes = deleteButtonStyles();
    const whoami = useSelector(state => state.whoami.user);
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector(["DELETE_USER", "RESTORE_USER"]);
    const isPosting = useSelector(state => postingSelector(state));

    const dispatch = useDispatch();

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };


    function onDelete() {
        handleClose();
        dispatch(deleteUserRequest(props.user.uuid));
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
                <MenuItem className={whoami.roles.includes("admin") ? classes.deleteButton : classes.deleteButtonDisabled} onClick={onDelete}>Delete</MenuItem>
            </Menu>
            </>
    );
}

