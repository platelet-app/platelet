import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";
import React, { useState } from "react";
import NewCommentCard from "./NewCommentCard";
import { useSelector } from "react-redux";
import CommentContextMenu from "../../../components/ContextMenus/CommentContextMenu";
import { contextDots } from "../../../styles/common";
import CommentCardEditMode from "./CommentCardEditMode";
import Linkify from "react-linkify";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

function CommentCollection(props) {
    const classes = contextDots();
    const [editMode, setEditMode] = useState(false);
    return (
        <div>
            {editMode ? (
                <CommentCardEditMode
                    author={props.author}
                    showAuthor={props.showAuthor}
                    timeCreated={props.timeCreated}
                    numEdits={props.numEdits}
                    public={props.publiclyVisible}
                    body={props.body}
                    uuid={props.uuid}
                    onReset={() => setEditMode(false)}
                />
            ) : (
                <CommentCard
                    showAuthor={props.showAuthor}
                    author={props.author}
                    timeCreated={props.timeCreated}
                    numEdits={props.numEdits}
                    public={props.publiclyVisible}
                >
                    <Linkify>{props.body}</Linkify>
                </CommentCard>
            )}
            <div className={classes.root}>
                {false && props.showContextMenu && !editMode ? (
                    <CommentContextMenu
                        commentUUID={props.uuid}
                        onSetEditMode={() => setEditMode(true)}
                    />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default function CommentsMain(props) {
    const useStyles = makeStyles(() => ({
        root: {
            flexGrow: 1,
            width: "100%",
        },
        right: {
            marginLeft: "auto",
        },
        item: {
            width: "100%",
        },
        tallSpacer: {
            height: 20,
        },
        shortSpacer: {
            height: 5,
        },
    }));
    const classes = useStyles();
    const whoami = useSelector((state) => state.whoami.user);

    return (
        <Grid
            container
            className={classes.root}
            direction={"column"}
            alignItems={"flex-start"}
        >
            {props.comments
                .sort(
                    (a, b) =>
                        new Date(a.time_created) - new Date(b.time_created)
                )
                .map((comment, index, array) => {
                    const prevAuthorUUID =
                        index > 0 ? array[index - 1].author.uuid : null;
                    return (
                        <>
                            <Grid item>
                                <div
                                    className={
                                        comment.author.uuid !== prevAuthorUUID
                                            ? classes.tallSpacer
                                            : classes.shortSpacer
                                    }
                                />
                            </Grid>
                            <Grid
                                className={clsx(
                                    whoami.uuid === comment.author.uuid
                                        ? classes.right
                                        : "",
                                    classes.item
                                )}
                                item
                                key={comment.uuid}
                            >
                                <CommentCollection
                                    showContextMenu={
                                        whoami.roles.includes("admin") ||
                                        whoami.uuid === comment.author_uuid
                                    }
                                    author={comment.author}
                                    showAuthor={
                                        comment.author.uuid !== prevAuthorUUID
                                    }
                                    timeCreated={comment.time_created}
                                    numEdits={comment.num_edits}
                                    publiclyVisible={comment.publicly_visible}
                                    uuid={comment.uuid}
                                    body={comment.body}
                                />
                            </Grid>
                        </>
                    );
                })}
            <Grid item>
                <div className={classes.tallSpacer} />
            </Grid>
            <Grid item>
                <NewCommentCard parentUUID={props.parentUUID} author={whoami} />
            </Grid>
        </Grid>
    );
}
