import React from "react";
import CommentsMain from "./components/CommentsMain";
import CommentsSkeleton from "./components/CommentsSkeleton";
import PropTypes from "prop-types";
import GetError from "../../ErrorComponents/GetError";
import useComments from "../../hooks/useComments";

function CommentsSection(props) {
    const { state, isFetching, error, setState } = useComments(props.parentId);

    const onNewComment = async (comment) => {
        const author = await comment.author;
        setState((prevState) => [...prevState, { ...comment, author }]);
    };

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (error) {
        return <GetError />;
    } else {
        return (
            <CommentsMain
                parentId={props.parentId}
                comments={state.filter((c) => !c._deleted)}
                onNewComment={onNewComment}
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
