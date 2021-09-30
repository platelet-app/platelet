import React, { useEffect, useRef, useState } from "react";
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
import PropTypes from "prop-types";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { convertListDataToObject } from "../../utilities";

function CommentsSection(props) {
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [comments, setComments] = useState({});
    const commentsSubscription = useRef({
        unsubscribe: () => {},
    });

    async function addCommentToState(comment) {
        debugger;
        if (comment) {
            let author = comment.author;
            if (!author) {
                author = await DataStore.query(
                    models.User,
                    comment.commentAuthorId
                );
            }
            setComments((prevState) => {
                return {
                    ...prevState,
                    [comment.id]: {
                        ...comment,
                        author,
                    },
                };
            });
        }
    }

    async function getComments() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            const commentsResult = await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", props.parentUUID)
            );
            const commentsObject = convertListDataToObject(commentsResult);
            setComments(commentsObject);
            commentsSubscription.current.unsubscribe();
            commentsSubscription.current = DataStore.observe(
                models.Comment,
                (c) => c.parentId("eq", props.parentUUID)
            ).subscribe(async (comment) => {
                addCommentToState(comment.element);
            });
        }
    }
    useEffect(() => getComments(), [props.parentUUID, dataStoreReadyStatus]);

    useEffect(() => {
        return () => {
            if (commentsSubscription.current)
                commentsSubscription.current.unsubscribe();
        };
    }, []);

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (false) {
        return <NotFound>Comments section could not found.</NotFound>;
    } else {
        return (
            <CommentsMain
                onNewComment={addCommentToState}
                parentUUID={props.parentUUID}
                comments={Object.values(comments)}
            />
        );
    }
}

CommentsSection.propTypes = {
    parentUUID: PropTypes.string,
};

CommentsSection.defaultProps = {
    parentUUID: "",
};

export default CommentsSection;
