import React, {useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteComment, deleteSidebarComment,
    restoreComment, restoreSidebarComment
} from "../../redux/comments/CommentsActions";
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


function CommentContextMenu(props) {
    const whoami = useSelector(state => state.whoami.user);
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector(props.sidebar ?  ["DELETE_SIDEBAR_COMMENT", "RESTORE_SIDEBAR_COMMENT"] : ["DELETE_COMMENT", "RESTORE_COMMENT"]);
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
        if (props.sidebar)
            dispatch(restoreSidebarComment(props.comment.uuid));
        else
            dispatch(restoreComment(props.comment.uuid));
    }

    function onDelete() {
        handleClose();
        if (props.sidebar)
            dispatch(deleteSidebarComment(props.comment.uuid));
        else
            dispatch(deleteComment(props.comment.uuid));
        const action = key => (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={() => {undoDelete(key)}}>
                    UNDO
                </Button>
            </React.Fragment>
        );
        const snack = () => {
            props.enqueueSnackbar('Comment deleted.', {variant: "info", action, autoHideDuration: 8000});
        }
        props.setSnack({ snack })
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
                <MenuItem
                    disabled={!whoami.uuid === props.comment.author_uuid}
                    style={{color: "rgb(235, 86, 75)"}}
                    onClick={onDelete}>Delete</MenuItem>
            </Menu>
        </>
    );
}

export default withSnackbar(CommentContextMenu)
