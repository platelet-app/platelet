import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteCommentRequest, deleteSidebarCommentRequest
} from "../../redux/comments/CommentsActions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {createPostingSelector} from "../../redux/LoadingSelectors";
import {deleteButtonStyles} from "./contextMenuCSS";


const initialState = {
    mouseX: null,
    mouseY: null,
};


export default function CommentContextMenu(props) {
    const classes = deleteButtonStyles();
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector( ["DELETE_COMMENT", "RESTORE_COMMENT", "EDIT_COMMENT"]);
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
        dispatch(deleteCommentRequest(props.commentUUID));
    }

    const handleClose = () => {
        setState(initialState);
    };

    return (
        <div className={props.className}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                disabled={isPosting}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? {top: state.mouseY, left: state.mouseX}
                        : undefined
                }
            >
                <MenuItem onClick={props.onSetEditMode}>
                    Edit
                </MenuItem>
                <MenuItem
                    className={classes.deleteButton}
                    onClick={onDelete}>
                    Delete
                </MenuItem>
        </Menu>
        </div>
    );
}
