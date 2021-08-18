import React, { useEffect, useRef, useState } from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { useDispatch, useSelector } from "react-redux";
import { updateCommentRequest } from "../../../redux/comments/CommentsActions";
import { createPostingSelector } from "../../../redux/LoadingSelectors";
import CommentCard from "./CommentCard";
import { commentStyles, CommentCardStyled } from "../styles/CommentCards";

const TextFieldSaveButtons = (props) => {
    const [body, setBody] = useState(props.body);
    const dispatch = useDispatch();
    const classes = commentStyles();
    return (
        <React.Fragment>
            <TextFieldUncontrolled
                value={body}
                className={classes.newCommentTextField}
                multiline
                disabled={props.isPosting}
                onChange={(e) => setBody(e.target.value)}
            />
            <SaveCancelButtons
                onCancel={props.onReset}
                disabled={props.isPosting || !!!body}
                onSave={() =>
                    dispatch(updateCommentRequest(props.uuid, { body }))
                }
            />
        </React.Fragment>
    );
};

export default function CommentCardEditMode(props) {
    const postingSelector = createPostingSelector(["UPDATE_COMMENT"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const firstUpdate = useRef(true);
    const classes = commentStyles();
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
        } else {
            if (!isPosting) props.onReset();
        }
    }, [isPosting]);
    return (
        <CommentCardStyled {...props}>
            <div className={classes.newComment}>
                <TextFieldSaveButtons {...props} isPosting={isPosting} />
            </div>
        </CommentCardStyled>
    );
}
