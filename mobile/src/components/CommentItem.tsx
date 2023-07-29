import * as React from "react";

type CommentItemProps = {
    comment: models.Comment;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const { author, body, createdAt } = comment;
    return null;
};

export default CommentItem;
