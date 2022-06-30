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
import _ from "lodash";
import { commentVisibility } from "../../apiConsts";
import GetError from "../../ErrorComponents/GetError";

function CommentsSection(props) {
    const [isFetching, setIsFetching] = useState(false);
    const [comments, setComments] = useState({});
    const [errorState, setErrorState] = useState(null);
    const whoami = useSelector(getWhoami);
    const commentsSubscription = useRef({
        unsubscribe: () => {},
    });

    function getComments() {
        //TODO: see if a more secure way to restrict private comment access
        try {
            commentsSubscription.current.unsubscribe();
            commentsSubscription.current = DataStore.observeQuery(
                models.Comment,
                (c) => c.parentId("eq", props.parentId)
            ).subscribe(({ items }) => {
                const commentsResult = items.filter(
                    (c) =>
                        c.visibility === commentVisibility.everyone ||
                        (c.visibility === commentVisibility.me &&
                            c.author &&
                            c.author.id === whoami.id)
                );
                const commentsObject = convertListDataToObject(commentsResult);
                setComments(commentsObject);
                setIsFetching(false);
            });
        } catch (error) {
            setIsFetching(false);
            setErrorState(error);
            console.error("Request failed", error);
        }
        return () => {
            if (commentsSubscription.current) {
                commentsSubscription.current.unsubscribe();
            }
        };
    }
    useEffect(getComments, [props.parentId]);

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
