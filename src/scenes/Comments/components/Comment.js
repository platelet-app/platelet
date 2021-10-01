import React, { useEffect, useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import Linkify from "react-linkify";
import { CommentCardStyled, commentStyles } from "../styles/CommentCards";
import CommentCard from "./CommentCard";
import CommentContextMenu from "../../../components/ContextMenus/CommentContextMenu";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { commentVisibility } from "../../../apiConsts";

const contextCreateStyles = makeStyles((theme) => ({
    root: (props) => ({
        position: "relative",
        "&:hover": {
            "& $dots": {
                display:
                    true || (props.showContextMenu && !props.editMode)
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
        "&::before":
            props.visibility === commentVisibility.me
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

const initialCommentState = {
    id: "",
    author: {
        displayName: "",
        id: "",
        profilePictureThumbnailURL: "",
    },
    body: "",
    visibility: commentVisibility.me,
};

function Comment(props) {
    const { comment } = props;
    const [state, setState] = useState(initialCommentState);
    const [oldState, setOldState] = useState(initialCommentState);
    const [editMode, setEditMode] = useState(false);
    const contextClasses = contextCreateStyles({
        ...props,
        editMode: editMode,
    });
    const [isPosting, setIsPosting] = useState(false);
    const classes = commentStyles();

    useEffect(() => {
        setState(props.comment);
        setOldState(props.comment);
    }, [props.comment]);

    if (!comment) {
        return <></>;
    } else if (editMode) {
        return (
            <CommentCard
                author={state.author}
                numEdits={state._version - 1}
                showAuthor={props.showAuthor}
                timeCreated={state.createdAt}
                visibility={state.visibility}
            >
                <TextFieldUncontrolled
                    value={state.body}
                    InputProps={{
                        style: {
                            minWidth: 400,
                        },
                    }}
                    className={classes.newCommentTextField}
                    multiline
                    fullWidth
                    disabled={isPosting}
                    onChange={(e) =>
                        setState((prevState) => ({
                            ...prevState,
                            body: e.target.value,
                        }))
                    }
                />
                <SaveCancelButtons
                    disabled={isPosting || !!!state.body}
                    onCancel={() => {
                        setState(oldState);
                        setEditMode(false);
                    }}
                    onSave={async () => {
                        setIsPosting(true);
                        const existing = await DataStore.query(
                            models.Comment,
                            state.id
                        );
                        await DataStore.save(
                            models.Comment.copyOf(existing, (updated) => {
                                updated.body = state.body;
                            })
                        );
                        setEditMode(false);
                        setState((prevState) => ({
                            ...prevState,
                            _version: prevState._version + 1,
                        }));
                        setIsPosting(false);
                    }}
                />
            </CommentCard>
        );
    } else {
        return (
            <div className={contextClasses.root}>
                <CommentCard
                    author={state.author}
                    numEdits={state._version - 1}
                    showAuthor={props.showAuthor}
                    timeCreated={state.createdAt}
                    visibility={state.visibility}
                >
                    <Typography className={classes.body} align={"justify"}>
                        <Linkify>{state.body}</Linkify>
                    </Typography>
                </CommentCard>
                <div className={contextClasses.dots}>
                    <CommentContextMenu
                        commentUUID={comment.id}
                        onSetEditMode={() => setEditMode(true)}
                    />
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    showContextMenu: PropTypes.bool,
    comment: PropTypes.object,
    showAuthor: PropTypes.bool,
};

Comment.defaultProps = {
    showContextMenu: false,
    showAuthor: true,
};

export default Comment;
