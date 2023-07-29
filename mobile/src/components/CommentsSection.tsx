import { Card } from "react-native-paper";
import useComments from "../hooks/useComments";
import DividerWithBottomMargin from "./DividerWithBottomMargin";

type CommentsSectionProps = {
    parentId: string;
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ parentId }) => {
    const { state, isFetching, error } = useComments(parentId);

    return (
        <Card>
            <Card.Content>
                {state.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </Card.Content>
        </Card>
    );
};
