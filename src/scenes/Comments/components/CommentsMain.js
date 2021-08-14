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

function CommentCollection(props) {
    const classes = contextDots();
    const [editMode, setEditMode] = useState(false);
    return (
        <div style={{ position: "relative" }}>
            {editMode ? (
                <CommentCardEditMode
                    author={props.author}
                    timeCreated={props.timeCreated}
                    numEdits={props.numEdits}
                    public={props.publiclyVisible}
                    body={props.body}
                    uuid={props.uuid}
                    onReset={() => setEditMode(false)}
                />
            ) : (
                <CommentCard
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
        right: {
            marginLeft: "auto",
        },
    }));
    const classes = useStyles();
    const whoami = useSelector((state) => state.whoami.user);

    return (
        <Grid
            container
            spacing={3}
            direction={"column"}
            alignItems={"flex-start"}
        >
            {props.comments
                .sort(
                    (a, b) =>
                        new Date(a.time_created) - new Date(b.time_created)
                )
                .map((comment) => (
                    <Grid
                        className={
                            whoami.uuid === comment.author_uuid
                                ? ""
                                : classes.right
                        }
                        item
                        key={comment.uuid}
                    >
                        <CommentCollection
                            showContextMenu={
                                whoami.roles.includes("admin") ||
                                whoami.uuid === comment.author_uuid
                            }
                            author={comment.author}
                            timeCreated={comment.time_created}
                            numEdits={comment.num_edits}
                            publiclyVisible={comment.publicly_visible}
                            uuid={comment.uuid}
                            body={comment.body}
                        />
                    </Grid>
                ))}
            <Grid item>
                <NewCommentCard parentUUID={props.parentUUID} author={whoami} />
            </Grid>
        </Grid>
    );
}
