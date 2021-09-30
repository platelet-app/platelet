import Grid from "@material-ui/core/Grid";
import CommentCard from "./CommentCard";
import React, { useState } from "react";
import NewCommentCard from "./NewCommentCard";
import { useSelector } from "react-redux";
import CommentContextMenu from "../../../components/ContextMenus/CommentContextMenu";
import CommentCardEditMode from "./CommentCardEditMode";
import Linkify from "react-linkify";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import { getWhoami } from "../../../redux/Selectors";

const contextCreateStyles = makeStyles((theme) => ({
    root: (props) => ({
        position: "relative",
        "&:hover": {
            "& $dots": {
                display:
                    props.showContextMenu && !props.editMode
                        ? "inline"
                        : "none",
            },
        },
    }),
    dots: (props) => ({
        background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${theme.palette.background.paper} 33%, ${theme.palette.background.paper} 100%)`,
        borderRadius: "1em",
        position: "absolute",
        bottom: 4,
        right: 4,
        display: "none",
        zIndex: 1000,
        "&::before": !props.public
            ? {
                  pointerEvents: "none",
                  borderRadius: "1em",
                  content: '""',
                  position: "absolute",
                  background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, black 33%, black 100%)`,
                  opacity: 0.15,
                  width: "100%",
                  height: "100%",
              }
            : {},
    }),
}));

function CommentCollection(props) {
    const [editMode, setEditMode] = useState(false);
    const classes = contextCreateStyles({ ...props, editMode: editMode });
    return (
        <div className={classes.root}>
            {editMode ? (
                <CommentCardEditMode
                    {...props}
                    onReset={() => setEditMode(false)}
                />
            ) : (
                <CommentCard {...props}>
                    <Linkify>{props.body}</Linkify>
                </CommentCard>
            )}
            <div className={classes.dots}>
                <CommentContextMenu
                    commentUUID={props.uuid}
                    onSetEditMode={() => setEditMode(true)}
                />
            </div>
        </div>
    );
}

CommentCollection.propTypes = {
    showContextMenu: PropTypes.bool,
    author: PropTypes.object,
    showAuthor: PropTypes.bool,
    timeCreated: PropTypes.string,
    numEdits: PropTypes.number,
    public: PropTypes.bool,
    uuid: PropTypes.string,
    body: PropTypes.string,
};

CommentCollection.defaultProps = {
    showContextMenu: false,
    author: {
        display_name: "",
        uuid: "",
        profile_picture_thumbnail_url: "",
    },
    showAuthor: true,
    timeCreated: undefined,
    numEdits: 0,
    public: false,
    uuid: "",
    body: "",
};

function CommentsMain(props) {
    const useStyles = makeStyles(() => ({
        root: {
            flexGrow: 1,
            width: "100%",
            maxWidth: 1000,
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
    const whoami = useSelector(getWhoami);

    return (
        <Grid
            container
            className={classes.root}
            direction={"column"}
            alignItems={"center"}
        >
            {props.comments
                .sort(
                    (a, b) =>
                        new Date(a.time_created) - new Date(b.time_created)
                )
                .map((comment, index, array) => {
                    const prevAuthorUUID =
                        index > 0 ? array[index - 1].author.id : null;
                    return (
                        <>
                            <Grid item>
                                <div className={classes.shortSpacer} />
                            </Grid>
                            <Grid
                                className={clsx(
                                    whoami.id === comment.author.id
                                        ? classes.right
                                        : "",
                                    classes.item
                                )}
                                item
                                key={comment.uuid}
                            >
                                <CommentCollection
                                    showContextMenu={
                                        // TODO: eventually let admins delete comments too
                                        //whoami.roles.includes("admin") ||
                                        whoami.id === comment.author.id
                                    }
                                    author={comment.author}
                                    showAuthor={
                                        comment.author.id !== prevAuthorUUID
                                    }
                                    timeCreated={comment.createdAt}
                                    numEdits={comment.num_edits}
                                    public={comment.publiclyVisible}
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
            <Grid item className={classes.item}>
                <NewCommentCard parentUUID={props.parentUUID} author={whoami} />
            </Grid>
        </Grid>
    );
}

CommentsMain.propTypes = {
    parentUUID: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.object),
};

CommentsMain.defaultProps = {
    parentUUID: "",
    comments: [],
};

export default CommentsMain;
