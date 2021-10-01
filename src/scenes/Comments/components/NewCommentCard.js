import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import IconButton from "@material-ui/core/IconButton";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import CommentAuthor from "./CommentAuthor";
import { commentStyles, CommentCardStyled } from "../styles/CommentCards";
import clsx from "clsx";
import PropTypes from "prop-types";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import { commentVisibility } from "../../../apiConsts";

const initialCommentState = {
    body: "",
    visibility: commentVisibility.everyone,
};

function NewCommentCard(props) {
    const [state, setState] = useState(initialCommentState);
    const [isPosting, setIsPosting] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    const classes = commentStyles();

    async function addComment() {
        setIsPosting(true);
        const newComment = await DataStore.save(
            new models.Comment({
                ...state,
                parentId: props.parentUUID,
                commentAuthorId: props.author.id,
            })
        );
        setState((prevState) => ({ ...prevState, body: "" }));
        setIsPosting(false);
        props.onNewComment(newComment);
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
                <Grid item>
                    <Grid
                        container
                        direction={"row"}
                        alignItems={"center"}
                        justify={"space-between"}
                    >
                        <Grid item>
                            <CommentAuthor
                                uuid={props.author.id}
                                displayName={props.author.displayName}
                                avatarURL={
                                    props.author.profilePictureThumbnailURL
                                }
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={
                                    state.visibility ===
                                    commentVisibility.everyone
                                        ? "Visible to everyone"
                                        : "Only visible to you"
                                }
                            >
                                <IconButton
                                    disabled={isPosting}
                                    onClick={() => {
                                        setState((prevState) => ({
                                            ...prevState,
                                            visibility:
                                                prevState.visibility ===
                                                commentVisibility.me
                                                    ? commentVisibility.everyone
                                                    : commentVisibility.me,
                                        }));
                                    }}
                                >
                                    {state.visibility ===
                                    commentVisibility.everyone ? (
                                        <LockOpenIcon
                                            className={classes.icon}
                                        />
                                    ) : (
                                        <LockIcon
                                            className={clsx(
                                                classes.icon,
                                                classes.lockIcon
                                            )}
                                        />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item className={classes.newCommentTextField}>
                    <TextFieldUncontrolled
                        className={classes.newCommentTextField}
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
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Button
                                disabled={
                                    state.body.length === 0 ||
                                    isPosting ||
                                    !dataStoreReadyStatus
                                }
                                onClick={addComment}
                            >
                                Post
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled={state.body.length === 0 || isPosting}
                                onClick={() =>
                                    setState((prevState) => ({
                                        ...prevState,
                                        body: "",
                                    }))
                                }
                            >
                                Discard
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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
        profilePictureThumbnailURL: "",
    },
    parentUUID: "",
};
export default NewCommentCard;
