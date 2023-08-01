import { View } from "react-native";
import useComments from "../hooks/useComments";
import GenericError from "../screens/Errors/GenericError";
import CommentItem from "./CommentItem";
import NewCommentCard from "./NewCommentCard";
import * as models from "../models";

type CommentsSectionProps = {
    parentId: string;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ parentId }) => {
    const { state, isFetching, error } = useComments(parentId);

    if (error) {
        return <GenericError />;
    } else {
        return (
            <View style={{ gap: 4 }}>
                {state
                    .sort(
                        (a, b) =>
                            +new Date(a.createdAt || new Date()) -
                            +new Date(b.createdAt || new Date())
                    )
                    .map((comment, index, array) => {
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
                <NewCommentCard parentId={parentId} />
            </View>
        );
    }
};

export default CommentsSection;
