import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteSession,
    restoreSession
} from "../redux/sessions/Actions";
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

function SessionContextMenu(props) {
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector(["UPDATE_SESSION"]);
    const isPosting = useSelector(state => postingSelector(state));

    const dispatch = useDispatch();

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };


    function undoDelete(key) {
        props.closeSnackbar(key);
        dispatch(restoreSession(props.sessionUUID));
    }

    function onDelete() {
        handleClose();
        dispatch(deleteSession(props.sessionUUID));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoDelete(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        props.enqueueSnackbar('Session deleted.',  { variant: "info", action, autoHideDuration: 8000 });
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
                {deleteOption}
            </Menu>
        </div>
        </div>
            </>
    );
}

export default withSnackbar(SessionContextMenu)