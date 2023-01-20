import React from "react";
import CommentsMain from "./components/CommentsMain";
import CommentsSkeleton from "./components/CommentsSkeleton";
import PropTypes from "prop-types";
import GetError from "../../ErrorComponents/GetError";
import useComments from "../../hooks/useComments";

function CommentsSection(props) {
    const { state, isFetching, error } = useComments(props.parentId);

    if (isFetching) {
        return <CommentsSkeleton />;
    } else if (error) {
        return <GetError />;
    } else {
        return (
            <CommentsMain
                parentUUID={props.parentId}
                comments={state.filter((c) => !c._deleted)}
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
