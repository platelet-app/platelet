import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommentsMain from "./components/CommentsMain";
import CommentsSkeleton from "./components/CommentsSkeleton";
import PropTypes from "prop-types";
import {
    dataStoreModelSyncedStatusSelector,
    getWhoami,
} from "../../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { convertListDataToObject } from "../../utilities";
import GetError from "../../ErrorComponents/GetError";

function CommentsSection(props) {
    const [isFetching, setIsFetching] = useState(false);
    const [comments, setComments] = useState({});
    const [errorState, setErrorState] = useState(null);
    const whoami = useSelector(getWhoami);
    const commentsRef = useRef({});
    const getCommentsRef = useRef(null);
    commentsRef.current = comments;
    const commentsSubscription = useRef({
        unsubscribe: () => {},
    });

    const commentsSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Comment;

    const getComments = React.useCallback(async () => {
        //TODO: see if a more secure way to restrict private comment access
        console.log("comm", commentsSynced);
        try {
            const commentsGet = await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", props.parentId)
            );
            const commentsResult = commentsGet.filter(
                (c) =>
                    c.visibility === models.CommentVisibility.EVERYONE ||
                    (c.visibility === models.CommentVisibility.ME &&
                        c.author &&
                        c.author.id === whoami.id)
            );
            const commentsObject = convertListDataToObject(commentsResult);
            setComments(commentsObject);
            setIsFetching(false);
        } catch (error) {
            setIsFetching(false);
            setErrorState(error);
            console.error("Request failed", error);
        }
    }, [commentsSynced, props.parentId, whoami.id]);
    useEffect(
        () => getComments(),
        [props.parentId, commentsSynced, getComments]
    );
    getCommentsRef.current = getComments;

    useEffect(() => {
        commentsSubscription.current.unsubscribe();
        commentsSubscription.current = DataStore.observe(models.Comment, (c) =>
            c.parentId("eq", props.parentId)
        ).subscribe(async () => {
            getCommentsRef.current();
        });
        return () => {
            if (commentsSubscription.current)
                commentsSubscription.current.unsubscribe();
        };
    }, [props.parentId]);

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (errorState) {
        return <GetError />;
    } else {
        return (
            <CommentsMain
                parentUUID={props.parentId}
                comments={Object.values(comments).filter((c) => !c._deleted)}
                onRestore={(comment) => {
                    setComments((prevState) => {
                        return {
                            ...prevState,
                            [comment.id]: {
                                ...comment,
                                _deleted: false,
                            },
                        };
                    });
                }}
                onDelete={(commentId) => {
                    setComments((prevState) => {
                        return {
                            ...prevState,
                            [commentId]: {
                                ...prevState[commentId],
                                _deleted: true,
                            },
                        };
                    });
                }}
            />
        );
    }
}

CommentsSection.propTypes = {
    parentId: PropTypes.string,
};

CommentsSection.defaultProps = {
    parentId: "",
};

export default CommentsSection;
