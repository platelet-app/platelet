import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import IconButton from "@material-ui/core/IconButton";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { addCommentRequest } from "../../../redux/comments/CommentsActions";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import CommentAuthor from "./CommentAuthor";
import { commentStyles } from "../styles/CommentCards";
import clsx from "clsx";

export default function CommentCard(props) {
    const dispatch = useDispatch();
    const [publicComment, setPublicComment] = useState(true);
    const [commentContents, setCommentContents] = useState("");
    const postingSelector = createPostingSelector(["ADD_COMMENT"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const classes = commentStyles();

    function clearCommentOnPost() {
        if (!isPosting) {
            setCommentContents("");
        }
    }

    useEffect(clearCommentOnPost, [isPosting]);

    return (
        <Grid
            className={clsx(classes.speechBubble, classes.newComment)}
            container
            direction={"column"}
            alignItems={"flex-start"}
            spacing={1}
        >
            <Grid item>
                <Grid container direction={"row"} justify={"space-between"}>
                    <Grid item>
                        <CommentAuthor
                            uuid={props.author.uuid}
                            displayName={props.author.display_name}
                            avatarURL={
                                props.author.profile_picture_thumbnail_url
                            }
                        />
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={
                                publicComment
                                    ? "Visible to everyone"
                                    : "Only visible to you"
                            }
                        >
                            <IconButton
                                disabled={isPosting}
                                onClick={() => {
                                    setPublicComment(!publicComment);
                                }}
                            >
                                {publicComment ? (
                                    <LockOpenIcon className={classes.icon} />
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
            <Grid item>
                <TextFieldUncontrolled
                    id={"new-comment-field"}
                    multiline
                    disabled={isPosting}
                    value={commentContents}
                    onChange={(e) => {
                        setCommentContents(e.target.value.slice(0, 10000));
                    }}
                />
            </Grid>
            <Grid item>
                <Grid container direction={"row"} justify={"space-between"}>
                    <Grid item>
                        <Button
                            disabled={commentContents.length === 0 || isPosting}
                            onClick={() => {
                                dispatch(
                                    addCommentRequest(props.parentUUID, {
                                        author: props.author,
                                        publicly_visible: publicComment,
                                        body: commentContents,
                                    })
                                );
                            }}
                        >
                            Post
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={commentContents.length === 0}
                            onClick={() => setCommentContents("")}
                        >
                            Discard
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
