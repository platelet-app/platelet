import React, { useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import Linkify from "react-linkify";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { deleteButtonStyles } from "./contextMenuCSS";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { displayInfoNotification } from "../../redux/notifications/NotificationsActions";
import ConfirmationDialog from "../ConfirmationDialog";
import Comment from "../../scenes/Comments/components/Comment";
import CommentCard from "../../scenes/Comments/components/CommentCard";
import { Typography } from "@mui/material";

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function CommentContextMenu(props) {
    const classes = deleteButtonStyles();
    const [state, setState] = React.useState(initialState);
    const [comment, setComment] = useState(props.comment);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
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
        if (existingComment) await DataStore.delete(existingComment);
    }

    async function handleDelete() {
        try {
            const comment = await DataStore.query(
                models.Comment,
                props.commentUUID
            );
            if (!comment) throw new Error("Comment not found");
            setComment(comment);
            setDeleteConfirmation(true);
        } catch (error) {
            dispatch(displayInfoNotification("Sorry, something went wrong."));
            console.log(error);
        }
    }

    async function onDelete() {
        try {
            deleteComment();
            dispatch(displayInfoNotification("Comment deleted"));
            props.onDelete(props.commentUUID);
            handleClose();
        } catch (error) {
            dispatch(displayInfoNotification("Sorry, something went wrong."));
            console.log(error);
            handleClose();
        }
    }

    function onEdit() {
        handleClose();
        props.onSetEditMode();
    }

    const handleClose = () => {
        setDeleteConfirmation(false);
        setState(initialState);
    };

    return (
        <div className={props.className}>
            <ConfirmationDialog
                dialogTitle="Are you sure you want to delete this comment?"
                open={deleteConfirmation}
                onConfirmation={onDelete}
                onCancel={handleClose}
                onClose={handleClose}
            >
                {comment && (
                    <Comment
                        showContextMenu={false}
                        showAuthor={false}
                        comment={comment}
                        onDelete={props.onDelete}
                        onRestore={props.onRestore}
                    />
                )}
            </ConfirmationDialog>
            <IconButton
                aria-label="comment-menu"
                data-testid="comment-menu"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
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
                <MenuItem onClick={onEdit}>Edit</MenuItem>
                <MenuItem
                    className={classes.deleteButton}
                    onClick={handleDelete}
                >
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}
