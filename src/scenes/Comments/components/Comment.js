import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
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
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import EditCommentDialog from "./EditCommentDialog";

const contextCreateStyles = makeStyles((theme) => {
    return {
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
        dots: (props) => {
            const backColor =
                theme.palette.mode === "dark"
                    ? "rgb(51, 51, 51)"
                    : theme.palette.background.paper;
            return {
                background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${backColor} 33%, ${backColor} 100%)`,
                borderRadius: "1em",
                position: "absolute",
                bottom: 4,
                right: 4,
                display: "none",
                zIndex: 1000,
                "&::before":
                    props.comment &&
                    props.comment.visibility === commentVisibility.me
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
            };
        },
    };
});

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
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
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

    async function onEditComment(value) {
        try {
            setEditMode(false);
            const existingComment = await DataStore.query(
                models.Comment,
                state.id
            );
            await DataStore.save(
                models.Comment.copyOf(
                    existingComment,
                    (updated) => (updated.body = value)
                )
            );
        } catch (e) {
            dispatch(displayErrorNotification("Sorry, an error occurred"));
        }
    }

    if (!comment) {
        return <></>;
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
                        onDelete={props.onDelete}
                        onRestore={() => props.onRestore(state)}
                    />
                </div>
                <EditCommentDialog
                    open={editMode}
                    visibility={state.visibility}
                    author={state.author}
                    onClose={() => setEditMode(false)}
                    value={state.body}
                    onConfirm={onEditComment}
                />
            </div>
        );
    }
}

Comment.propTypes = {
    showContextMenu: PropTypes.bool,
    comment: PropTypes.object,
    showAuthor: PropTypes.bool,
    onDelete: PropTypes.func,
    onRestore: PropTypes.func,
};

Comment.defaultProps = {
    showContextMenu: false,
    showAuthor: true,
    onDelete: () => {},
    onRestore: () => {},
};

export default Comment;
