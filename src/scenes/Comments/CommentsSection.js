import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommentsMain from "./components/CommentsMain";
import CommentsSkeleton from "./components/CommentsSkeleton";
import PropTypes from "prop-types";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { convertListDataToObject } from "../../utilities";
import _ from "lodash";
import { commentVisibility } from "../../apiConsts";

function CommentsSection(props) {
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [comments, setComments] = useState({});
    const whoami = useSelector(getWhoami);
    const commentsRef = useRef({});
    commentsRef.current = comments;
    const commentsSubscription = useRef({
        unsubscribe: () => {},
    });

    async function addCommentToState(comment) {
        if (comment) {
            if (
                !commentsRef.current[comment.id] ||
                comment._version !== commentsRef.current[comment.id]._version
            ) {
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
    }

    async function getComments() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            //TODO: see if a more secure way to restrict private comment access
            const commentsResult = (
                await DataStore.query(models.Comment, (c) =>
                    c.parentId("eq", props.parentUUID)
                )
            ).filter(
                (c) =>
                    c.visibility === commentVisibility.everyone ||
                    (c.visibility === commentVisibility.me &&
                        c.author.id === whoami.id)
            );
            const commentsObject = convertListDataToObject(commentsResult);
            setComments(commentsObject);
            commentsSubscription.current.unsubscribe();
            commentsSubscription.current = DataStore.observe(
                models.Comment,
                (c) => c.parentId("eq", props.parentUUID)
            ).subscribe(async (newComment) => {
                const comment = newComment.element;
                if (
                    !comment.commentAuthorId ||
                    (comment.commentAuthorId !== whoami.id &&
                        comment.visibility === commentVisibility.me)
                ) {
                    return;
                } else {
                    addCommentToState(comment);
                }
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
    } else {
        return (
            <CommentsMain
                onNewComment={addCommentToState}
                parentUUID={props.parentUUID}
                comments={Object.values(comments).filter((c) => !c._deleted)}
                onRestore={(commentId) => {
                    setComments((prevState) => {
                        return {
                            ...prevState,
                            [commentId]: {
                                ...prevState[commentId],
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
    parentUUID: PropTypes.string,
};

CommentsSection.defaultProps = {
    parentUUID: "",
};

export default CommentsSection;
