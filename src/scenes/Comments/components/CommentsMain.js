import Grid from "@material-ui/core/Grid";
import React, { useState } from "react";
import NewCommentCard from "./NewCommentCard";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import { getWhoami } from "../../../redux/Selectors";
import Comment from "./Comment";

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
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((comment, index, array) => {
                    const prevAuthorUUID =
                        index > 0 && array[index - 1].author
                            ? array[index - 1].author.id
                            : null;
                    return (
                        <>
                            <Grid item>
                                <div className={classes.shortSpacer} />
                            </Grid>
                            <Grid
                                className={clsx(
                                    comment.author &&
                                        whoami.id === comment.author.id
                                        ? classes.right
                                        : "",
                                    classes.item
                                )}
                                item
                                key={comment.id}
                            >
                                <Comment
                                    showContextMenu={
                                        comment.author.id === whoami.id
                                    }
                                    showAuthor={
                                        prevAuthorUUID !== comment.author.id
                                    }
                                    comment={comment}
                                />
                            </Grid>
                        </>
                    );
                })}
            <Grid item>
                <div className={classes.tallSpacer} />
            </Grid>
            <Grid item className={classes.item}>
                <NewCommentCard
                    parentUUID={props.parentUUID}
                    onNewComment={props.onNewComment}
                    author={whoami}
                />
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
