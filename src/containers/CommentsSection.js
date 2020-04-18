import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearComments, getComments, getSessionComments} from "../redux/comments/Actions";
import CommentsMain from "../components/CommentsMain";
import {createLoadingSelector} from "../redux/selectors";
import CommentsSkeleton from "../loadingComponents/CommentsSkeleton";

export default function CommentsSection(props) {
    const dispatch = useDispatch();
    const loadingSelector = props.session ? createLoadingSelector(["GET_SESSION_COMMENTS"]) : createLoadingSelector(["GET_COMMENTS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const comments = useSelector(state => props.session ? state.sessionComments : state.comments);
    function updateComments() {
        if (props.parentUUID) {
            if (props.session)
                dispatch(getSessionComments(props.parentUUID));
            else
                dispatch(getComments(props.parentUUID));
        } else {
            dispatch(clearComments())
        }
    }
    useEffect(updateComments, [props.parentUUID]);

    if (isFetching) {
        return <CommentsSkeleton/>
    } else {
        return (
            <div style={{paddingTop: "30px"}}>
                <CommentsMain session={props.session} parentUUID={props.parentUUID} comments={comments}/>
            </div>
        )

    }
}
