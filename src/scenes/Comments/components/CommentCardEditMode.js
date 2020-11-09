import React, {useState} from "react";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import {useDispatch} from "react-redux";

export default function CommentCardEditMode(props) {
    const dispatch = useDispatch();
    const [body, setBody] = useState(props.body);
    return (
        <React.Fragment>
            <TextFieldUncontrolled
                value={body}
                onChange={e => setBody(e.target.value)}
            />
            <SaveCancelButtons
                onCancel={props.onCancel}
               // onSave={() => dispatch(editCommentRequest(body))}
            />
        </React.Fragment>
    )
}
