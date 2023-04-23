import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { deleteButtonStyles } from "./contextMenuCSS";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../redux/notifications/NotificationsActions";
import ConfirmationDialog from "../ConfirmationDialog";
import Comment from "../../scenes/Comments/components/Comment";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations";

const getComment = /* GraphQL */ `
    query GetComment($id: ID!) {
        getComment(id: $id) {
            id
            _version
        }
    }
`;

const deleteCommentMutation = /* GraphQL */ `
    mutation DeleteComment(
        $input: DeleteCommentInput!
        $condition: ModelCommentConditionInput
    ) {
        deleteComment(input: $input, condition: $condition) {
            id
            _version
        }
    }
`;
const updateComment = /* GraphQL */ `
    mutation UpdateComment(
        $input: UpdateCommentInput!
        $condition: ModelCommentConditionInput
    ) {
        updateComment(input: $input, condition: $condition) {
            id
        }
    }
`;

const initialState = {
    mouseX: null,
    mouseY: null,
};

export default function CommentContextMenu(props) {
    const { classes } = deleteButtonStyles();
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
        try {
            // this uses graphql because DataStore refuses to delete something that's just been changed
            // it also uses DataStore to delete it anyway, because for some reason
            // it doesn't sync with the graphql delete
            // (DataStore is driving me insane please help)
            if (process.env.REACT_APP_OFFLINE_ONLY !== "true") {
                const existing = await API.graphql({
                    query: getComment,
                    variables: { id: props.commentUUID },
                });
                const result = await API.graphql({
                    query: deleteCommentMutation,
                    variables: {
                        input: {
                            id: props.commentUUID,
                            _version: existing.data.getComment._version,
                        },
                    },
                });
                await API.graphql({
                    query: updateComment,
                    variables: {
                        input: {
                            id: props.commentUUID,
                            body: "",
                            _version: result.data.deleteComment._version,
                        },
                    },
                });
            }
            const existingComment = await DataStore.query(
                models.Comment,
                props.commentUUID
            );
            await DataStore.delete(existingComment);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
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
