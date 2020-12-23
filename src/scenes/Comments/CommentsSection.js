import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    clearComments,
    getCommentsRequest
} from "../../redux/comments/CommentsActions";
import CommentsMain from "./components/CommentsMain";
import {createLoadingSelector, createNotFoundSelector} from "../../redux/selectors";
import CommentsSkeleton from "./components/CommentsSkeleton";
import NotFound from "../../ErrorComponents/NotFound";
import {subscribeToComments, unsubscribeFromComments} from "../../redux/sockets/SocketActions";

export default function CommentsSection(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_COMMENTS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const notFoundSelector = createNotFoundSelector(["GET_COMMENTS"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const comments = useSelector(state => state.comments.comments);
    console.log(props.parentUUID)
    function updateComments() {
        if (props.parentUUID) {
            dispatch(getCommentsRequest(props.parentUUID));
        } else {
            dispatch(clearComments())
        }
    }
    useEffect(updateComments, []);

    function componentDidMount() {
        dispatch(subscribeToComments(props.parentUUID));
        return function cleanup() {
            dispatch(unsubscribeFromComments(props.parentUUID));
        }
    }
    useEffect(componentDidMount, []);

    if (isFetching) {
        return <CommentsSkeleton/>
    } else if (notFound) {
        return <NotFound>Comments section could not found.</NotFound>
    } else {
        return (
            <div style={{paddingTop: "30px"}}>
                <CommentsMain parentUUID={props.parentUUID} comments={Object.values(comments)}/>
            </div>
        )
    }
}
