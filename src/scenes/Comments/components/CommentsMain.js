import Grid from "@mui/material/Grid";
import React from "react";
import NewCommentCard from "./NewCommentCard";
import { useSelector } from "react-redux";
import { makeStyles } from 'tss-react/mui';
import PropTypes from "prop-types";
import { getWhoami } from "../../../redux/Selectors";
import Comment from "./Comment";

function CommentsMain(props) {
    const useStyles = makeStyles()(() => ({
        root: {
            flexGrow: 1,
            width: "100%",
            maxWidth: 1000,
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
    const { classes } = useStyles();
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
                        <React.Fragment key={comment.id}>
                            <Grid item>
                                <div className={classes.shortSpacer} />
                            </Grid>
                            <Grid
                                className={classes.item}
                                item
                                key={comment.id}
                            >
                                <Comment
                                    showContextMenu={
                                        comment.author &&
                                        comment.author.id === whoami.id
                                    }
                                    showAuthor={
                                        comment.author &&
                                        prevAuthorUUID !== comment.author.id
                                    }
                                    comment={comment}
                                    onDelete={props.onDelete}
                                    onRestore={props.onRestore}
                                />
                            </Grid>
                        </React.Fragment>
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
    onDelete: PropTypes.func,
    onRestore: PropTypes.func,
    onNewComment: PropTypes.func,
};

CommentsMain.defaultProps = {
    parentUUID: "",
    comments: [],
    onDelete: () => {},
    onRestore: () => {},
    onNewComment: () => {},
};

export default CommentsMain;
