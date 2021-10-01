import React, { useRef, useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
    deleteCommentRequest,
    deleteSidebarCommentRequest,
} from "../../redux/comments/CommentsActions";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import { createPostingSelector } from "../../redux/LoadingSelectors";
import { deleteButtonStyles } from "./contextMenuCSS";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { displayInfoNotification } from "../../redux/notifications/NotificationsActions";

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function CommentContextMenu(props) {
    const classes = deleteButtonStyles();
    const [state, setState] = React.useState(initialState);
    const [isPosting, setIsPosting] = useState(false);
    const deleteTimer = useRef();
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    async function deleteComment() {
        const existingComment = await DataStore.query(
            models.Comment,
            props.commentUUID
        );
        await DataStore.delete(existingComment);
    }

    async function onDelete() {
        handleClose();
        dispatch(displayInfoNotification("Comment deleted"));
        deleteTimer.current = setTimeout(() => deleteComment(), 4000);
        props.onDelete(props.commentUUID);
    }

    function onEdit() {
        handleClose();
        props.onSetEditMode();
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
                <MenuItem onClick={onEdit}>Edit</MenuItem>
                <MenuItem className={classes.deleteButton} onClick={onDelete}>
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}
