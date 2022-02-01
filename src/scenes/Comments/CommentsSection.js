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
import GetError from "../../ErrorComponents/GetError";
import { Typography } from "@mui/material";

function CommentsSection(props) {
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [comments, setComments] = useState({});
    const [errorState, setErrorState] = useState(null);
    const whoami = useSelector(getWhoami);
    const commentsRef = useRef({});
    commentsRef.current = comments;
    const commentsSubscription = useRef({
        unsubscribe: () => {},
    });

    function removeCommentFromState(commentId) {
        if (commentId) {
            setComments((prevState) => _.omit(prevState, commentId));
        }
    }

    async function addCommentToState(comment) {
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
            //TODO: see if a more secure way to restrict private comment access
            try {
                const commentsResult = (
                    await DataStore.query(models.Comment, (c) =>
                        c.parentId("eq", props.parentId)
                    )
                ).filter(
                    (c) =>
                        c.visibility === commentVisibility.everyone ||
                        (c.visibility === commentVisibility.me &&
                            c.author.id === whoami.id)
                );
                const commentsObject = convertListDataToObject(commentsResult);
                setComments(commentsObject);
                setIsFetching(false);
                commentsSubscription.current.unsubscribe();
                commentsSubscription.current = DataStore.observe(
                    models.Comment,
                    (c) => c.parentId("eq", props.parentId)
                ).subscribe(async (newComment) => {
                    const comment = newComment.element;
                    if (newComment.opType === "DELETE") {
                        removeCommentFromState(comment.id);
                        return;
                    }
                    if (
                        !comment.author ||
                        !comment.author.id ||
                        (comment.author.id !== whoami.id &&
                            comment.visibility === commentVisibility.me)
                    ) {
                        return;
                    } else if (
                        ["UPDATE", "INSERT"].includes(newComment.opType)
                    ) {
                        addCommentToState(comment);
                    }
                });
            } catch (error) {
                setIsFetching(false);
                setErrorState(error);
                console.error("Request failed", error);
            }
        }
    }
    useEffect(() => getComments(), [props.parentId, dataStoreReadyStatus]);

    useEffect(() => {
        return () => {
            if (commentsSubscription.current)
                commentsSubscription.current.unsubscribe();
        };
    }, []);

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (errorState) {
        return (
            <GetError>
                <Typography>
                    {errorState && errorState.message
                        ? errorState.message
                        : "Unknown"}
                </Typography>
            </GetError>
        );
    } else {
        return (
            <CommentsMain
                onNewComment={addCommentToState}
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
