import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearComments,
    getCommentsPrefix,
    getCommentsRequest,
} from "../../redux/comments/CommentsActions";
import CommentsMain from "./components/CommentsMain";
import {
    createLoadingSelector,
    createNotFoundSelector,
} from "../../redux/LoadingSelectors";
import CommentsSkeleton from "./components/CommentsSkeleton";
import NotFound from "../../ErrorComponents/NotFound";
import {
    subscribeToComments,
    unsubscribeFromComments,
} from "../../redux/sockets/SocketActions";

export default function CommentsSection(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector([getCommentsPrefix]);
    const isFetching = useSelector((state) => loadingSelector(state));
    const notFoundSelector = createNotFoundSelector([getCommentsPrefix]);
    const notFound = useSelector((state) => notFoundSelector(state));
    const comments = useSelector((state) => state.comments.comments);
    function updateComments() {
        if (props.parentUUID) {
            dispatch(getCommentsRequest(props.parentUUID));
        } else {
            dispatch(clearComments());
        }
    }
    useEffect(updateComments, [props.parentUUID]);

    function componentDidMount() {
        dispatch(subscribeToComments(props.parentUUID));
        return function cleanup() {
            dispatch(unsubscribeFromComments(props.parentUUID));
        };
    }
    useEffect(componentDidMount, [props.parentUUID]);

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (notFound) {
        return <NotFound>Comments section could not found.</NotFound>;
    } else {
        return (
            <CommentsMain
                parentUUID={props.parentUUID}
                comments={Object.values(comments)}
            />
        );
    }
}
