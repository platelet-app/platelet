import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addCommentFromSocket,
    clearComments,
    getCommentsRequest
} from "../../redux/comments/CommentsActions";
import CommentsMain from "./components/CommentsMain";
import {createLoadingSelector, createNotFoundSelector} from "../../redux/selectors";
import CommentsSkeleton from "./components/CommentsSkeleton";
import NotFound from "../../ErrorComponents/NotFound";
import {subscribeToComments, unsubscribeFromComments} from "../../redux/sockets/SocketActions";
import {getTabIdentifier} from "../../utilities";

export default function CommentsSection(props) {
    const dispatch = useDispatch();
    const loadingSelector = createLoadingSelector(["GET_COMMENTS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const notFoundSelector = createNotFoundSelector(["GET_COMMENTS"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const comments = useSelector(state => state.comments.comments);
    const socketSubscription = useSelector(state => state.commentsSubscription);
    function updateComments() {
        if (props.parentUUID) {
            dispatch(getCommentsRequest(props.parentUUID));
        } else {
            dispatch(clearComments())
        }
    }
    useEffect(updateComments, [props.parentUUID]);

    useEffect(() => {
        if (Object.keys(socketSubscription).length === 0 && socketSubscription.constructor === Object) {
            console.log("ignore")
        } else {
            if (socketSubscription.tab_id != null && getTabIdentifier() !== socketSubscription.tab_id) {
                switch (socketSubscription.type) {
                    case "post":
                        dispatch(addCommentFromSocket(socketSubscription.data))
                        break;
                    default:
                        break;
                }
                console.log(socketSubscription.data)
            } else
                console.log("this came from us")
        }

    }, [socketSubscription])

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
        return <NotFound>Comments section not found.</NotFound>
    } else {
        return (
            <div style={{paddingTop: "30px"}}>
                <CommentsMain parentUUID={props.parentUUID} comments={comments}/>
            </div>
        )
    }
}
