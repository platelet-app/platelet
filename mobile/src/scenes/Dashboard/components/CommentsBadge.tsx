type CommentsBadgeProps = {
    count: number;
    iconSize?: number;
};

const CommentsBadge: React.FC<CommentsBadgeProps> = ({
    count,
    iconSize = 20,
}) => {
    if (count > 0) {
        return null;
    } else {
        return null;
    }
};

export default CommentsBadge;
