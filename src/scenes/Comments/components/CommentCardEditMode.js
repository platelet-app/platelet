import React, {useEffect, useRef, useState} from "react";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import {useDispatch, useSelector} from "react-redux";
import {updateCommentRequest} from "../../../redux/comments/CommentsActions";
import {createPostingSelector} from "../../../redux/selectors";
import CommentCard from "./CommentCard";

const TextFieldSaveButtons = props => {
    const [body, setBody] = useState(props.body);
    const dispatch = useDispatch();
    return (
        <React.Fragment>
            <TextFieldUncontrolled
                value={body}
                multiline
                disabled={props.isPosting}
                onChange={e => setBody(e.target.value)}
            />
            <SaveCancelButtons
                onCancel={props.onReset}
                disabled={props.isPosting || !!!body}
                onSave={() => dispatch(updateCommentRequest({commentUUID: props.uuid, payload: {body}}))}
            />
        </React.Fragment>
    )
}

export default function CommentCardEditMode(props) {
    const postingSelector = createPostingSelector(["UPDATE_COMMENT"]);
    const isPosting = useSelector(state => postingSelector(state));
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
        <CommentCard {...props}>
            <TextFieldSaveButtons uuid={props.uuid} body={props.body} isPosting={isPosting}/>
        </CommentCard>
    )
}
