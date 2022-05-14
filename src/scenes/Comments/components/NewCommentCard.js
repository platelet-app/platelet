import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import CommentAuthor from "./CommentAuthor";
import { commentStyles, CommentCardStyled } from "../styles/CommentCards";
import PropTypes from "prop-types";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { tenantIdSelector } from "../../../redux/Selectors";
import { commentVisibility } from "../../../apiConsts";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import CommentVisibilitySelector from "../../../components/CommentVisibilitySelector";
import { TextField, Typography } from "@mui/material";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const initialCommentState = {
    body: "",
    visibility: commentVisibility.everyone,
};

function NewCommentCard(props) {
    const [state, setState] = useState(initialCommentState);
    const [isPosting, setIsPosting] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const tenantId = useSelector(tenantIdSelector);
    const dispatch = useDispatch();

    const classes = commentStyles();

    async function addComment() {
        setIsPosting(true);
        const commentAuthor =
            props.author && props.author.id
                ? await DataStore.query(models.User, props.author.id)
                : null;
        try {
            const newComment = await DataStore.save(
                new models.Comment({
                    ...state,
                    parentId: props.parentUUID,
                    author: commentAuthor,
                    tenantId,
                })
            );
            setState((prevState) => ({ ...prevState, body: "" }));
            setIsPosting(false);
            props.onNewComment(newComment);
        } catch (error) {
            dispatch(displayErrorNotification("Sorry, an error occurred."));
            console.log(error);
            setIsPosting(false);
        }
    }

    function clearCommentOnPost() {
        if (!isPosting) {
            setState({ ...state, body: "" });
        }
    }

    useEffect(clearCommentOnPost, [isPosting]);

    return (
        <CommentCardStyled>
            <Grid
                className={classes.newComment}
                container
                direction={"column"}
                alignItems={"flex-start"}
                spacing={1}
            >
                <Grid style={{ width: "100%" }} item>
                    <Grid
                        spacing={1}
                        container
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Grid item>
                            <CommentAuthor
                                uuid={props.author.id}
                                displayName={props.author.displayName}
                                thumbnailKey={
                                    props.author &&
                                    props.author.profilePictureThumbnail
                                        ? props.author.profilePictureThumbnail
                                              .key
                                        : null
                                }
                            />
                        </Grid>
                        <Grid sx={{ marginLeft: "auto" }} item>
                            <CommentVisibilitySelector
                                value={state.visibility}
                                onChange={(value) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        visibility: value,
                                    }));
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.newCommentTextField}>
                    <TextField
                        className={classes.newCommentTextField}
                        placeholder={
                            state.visibility === commentVisibility.me
                                ? "Write a private note..."
                                : "Write a comment..."
                        }
                        id={"new-comment-field"}
                        multiline
                        disabled={isPosting}
                        value={state.body}
                        onChange={(e) => {
                            setState({
                                ...state,
                                body: e.target.value.slice(0, 10000),
                            });
                        }}
                    />
                </Grid>
                <Grid item className={classes.gridItem}>
                    <Grid
                        container
                        direction={"row-reverse"}
                        justifyContent={"space-between"}
                    >
                        <Grid item>
                            <Button
                                disabled={state.body.length === 0 || isPosting}
                                onClick={addComment}
                            >
                                Post
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={state.body.length === 0 || isPosting}
                                onClick={() => setConfirmationDialogOpen(true)}
                            >
                                Discard
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <ConfirmationDialog
                open={confirmationDialogOpen}
                onConfirmation={() => {
                    setState((prevState) => ({
                        ...prevState,
                        body: "",
                    }));
                    setConfirmationDialogOpen(false);
                }}
                onClose={() => setConfirmationDialogOpen(false)}
                onCancel={() => setConfirmationDialogOpen(false)}
                dialogTitle={"Discard comment?"}
            >
                <Typography>{state.body}</Typography>
            </ConfirmationDialog>
        </CommentCardStyled>
    );
}

NewCommentCard.propTypes = {
    author: PropTypes.object,
    parentUUID: PropTypes.string,
    onNewComment: PropTypes.func,
};

NewCommentCard.defaultProps = {
    author: {
        displayName: "",
        id: "",
        profilePictureThumbnail: { bucket: "", key: "", region: "" },
    },
    parentUUID: "",
};
export default NewCommentCard;
