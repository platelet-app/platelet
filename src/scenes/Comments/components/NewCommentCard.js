import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import CommentAuthor from "./CommentAuthor";
import { commentStyles, CommentCardStyled } from "../styles/CommentCards";
import PropTypes from "prop-types";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import { commentVisibility } from "../../../apiConsts";
import { FormControl, Select, MenuItem } from "@mui/material";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

const initialCommentState = {
    body: "",
    visibility: commentVisibility.everyone,
};

function VisibilityMenu(props) {
    return (
        <FormControl fullWidth>
            <Select
                id="visibility-menu"
                value={props.value}
                variant={"standard"}
                label="Visibility"
                onChange={props.onChange}
            >
                <MenuItem value={commentVisibility.everyone}>EVERYONE</MenuItem>
                <MenuItem value={commentVisibility.me}>ONLY ME</MenuItem>
            </Select>
        </FormControl>
    );
}

function NewCommentCard(props) {
    const [state, setState] = useState(initialCommentState);
    const [isPosting, setIsPosting] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
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
                        <Grid item>
                            <VisibilityMenu
                                value={state.visibility}
                                onChange={(e) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        visibility: e.target.value,
                                    }));
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item className={classes.newCommentTextField}>
                    <TextFieldUncontrolled
                        className={classes.newCommentTextField}
                        placeholder="Write a comment..."
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
