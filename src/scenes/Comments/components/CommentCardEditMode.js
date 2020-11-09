import React, {useEffect, useRef, useState} from "react";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import {useDispatch, useSelector} from "react-redux";
import {updateCommentRequest} from "../../../redux/comments/CommentsActions";
import {createPostingSelector} from "../../../redux/selectors";

export default function CommentCardEditMode(props) {
    const dispatch = useDispatch();
    const postingSelector = createPostingSelector(["UPDATE_COMMENT"]);
    const isPosting = useSelector(state => postingSelector(state));
    const [body, setBody] = useState(props.body);
    const firstUpdate = useRef(true);
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
        } else {
            if (!isPosting)
                props.onReset()
        }
    }, [isPosting])
    return (
        <React.Fragment>
            <TextFieldUncontrolled
                value={body}
                onChange={e => setBody(e.target.value)}
            />
            <SaveCancelButtons
                onCancel={props.onReset}
                disabled={isPosting || !!!body}
                onSave={() => dispatch(updateCommentRequest({commentUUID: props.uuid, payload: {body}}))}
            />
        </React.Fragment>
    )
}
