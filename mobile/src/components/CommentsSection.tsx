import { View } from "react-native";
import useComments from "../hooks/useComments";
import CommentItem from "./CommentItem";

type CommentsSectionProps = {
    parentId: string;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ parentId }) => {
    const { state, isFetching, error } = useComments(parentId);

    return (
        <View style={{ gap: 4 }}>
            {state.map((comment, index, array) => {
                const prevAuthorId =
                    index > 0 && array[index - 1].author
                        ? array[index - 1].author?.id
                        : null;
                return (
                    <CommentItem
                        showAuthor={prevAuthorId !== comment.author?.id}
                        key={comment.id}
                        comment={comment}
                    />
                );
            })}
        </View>
    );
};

export default CommentsSection;
