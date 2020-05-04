import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearComments, getComments, getSidebarComments} from "../redux/comments/CommentsActions";
import CommentsMain from "../components/CommentsMain";
import {createLoadingSelector, createNotFoundSelector} from "../redux/selectors";
import CommentsSkeleton from "../loadingComponents/CommentsSkeleton";
import NotFound from "../ErrorComponenents/NotFound";

export default function CommentsSection(props) {
    const dispatch = useDispatch();
    const loadingSelector = props.session ? createLoadingSelector(["GET_SIDEBAR_COMMENTS"]) : createLoadingSelector(["GET_COMMENTS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const notFoundSelector = props.session ? createNotFoundSelector(["GET_SIDEBAR_COMMENTS"]) : createNotFoundSelector(["GET_COMMENTS"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const comments = useSelector(state => props.session ? state.sessionComments : state.comments);
    function updateComments() {
        if (props.parentUUID) {
            if (props.session)
                dispatch(getSidebarComments(props.parentUUID));
            else
                dispatch(getComments(props.parentUUID));
        } else {
            dispatch(clearComments())
        }
    }
    useEffect(updateComments, [props.parentUUID]);

    if (isFetching) {
        return <CommentsSkeleton/>
    } else if (notFound) {
        return <NotFound>Comments section not found.</NotFound>
    } else {
        return (
            <div style={{paddingTop: "30px"}}>
                <CommentsMain session={props.session} parentUUID={props.parentUUID} comments={comments}/>
            </div>
        )

    }
}
