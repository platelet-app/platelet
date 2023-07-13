import { useSelector } from "react-redux";
import { getWhoami, commentsSelector } from "../redux/Selectors";
import * as models from "../models";

type CommentResolved = models.Comment & {
    author: models.User | undefined;
};

const useCommentsRedux = (parentId: string) => {
    const whoami = useSelector(getWhoami);
    const comments = useSelector(commentsSelector);
    const filteredComments = comments.items.filter(
        (item: CommentResolved) => item.parentId === parentId
    );
    const commentsPrivateFiltered = filteredComments.filter(
        (c: CommentResolved) =>
            c.visibility === models.CommentVisibility.EVERYONE ||
            (c.visibility === models.CommentVisibility.ME &&
                c.author &&
                c.author.id === whoami.id)
    );

    return commentsPrivateFiltered;
};

export default useCommentsRedux;
