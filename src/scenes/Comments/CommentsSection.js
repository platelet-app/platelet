import React, { useEffect, useState } from "react";
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

function CommentsSection(props) {
    const [isFetching, setIsFetching] = useState(false);
    const notFoundSelector = createNotFoundSelector([getCommentsPrefix]);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [comments, setComments] = useState([]);

    async function getComments() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            const commentsResult = await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", props.parentUUID)
            );
            setComments(commentsResult);
        }
    }
    useEffect(() => getComments(), [props.parentUUID, dataStoreReadyStatus]);

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (false) {
        return <NotFound>Comments section could not found.</NotFound>;
    } else {
        return (
            <CommentsMain parentUUID={props.parentUUID} comments={comments} />
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
