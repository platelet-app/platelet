import * as models from "../models";
import { DataStore } from "aws-amplify";
import * as React from "react";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import { useSelector } from "react-redux";
import { getWhoami } from "../redux/Selectors";

export type CommentsState = {
    [key: string]: ResolvedComment;
};

type ResolvedComment = Omit<models.Comment, "author"> & {
    author: models.User | null;
};

const useComments = (parentId: string) => {
    const [state, setState] = React.useState<CommentsState>({});
    const [isFetching, setIsFetching] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const whoami = useSelector(getWhoami);
    const observer = React.useRef({ unsubscribe: () => {} });

    const filterHidden = React.useCallback(
        (comments: ResolvedComment[]) => {
            return comments.filter(
                (c) =>
                    c.visibility === models.CommentVisibility.EVERYONE ||
                    (c.visibility === models.CommentVisibility.ME &&
                        c.author &&
                        c.author.id === whoami.id)
            );
        },
        [whoami]
    );

    const getComments = React.useCallback(async () => {
        if (!parentId) return;
        setIsFetching(true);
        try {
            observer.current.unsubscribe();
            observer.current = DataStore.observeQuery(models.Comment, (c) =>
                c.parentId.eq(parentId)
            ).subscribe(async ({ items }) => {
                const resolved: ResolvedComment[] = await Promise.all(
                    items.map(async (item) => {
                        const author = (await item.author) || null;
                        return { ...item, author };
                    })
                );
                const filtered = filterHidden(resolved);
                setState(
                    convertModelListToTypedObject<ResolvedComment>(filtered)
                );
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e);
            }
            console.log(e);
        } finally {
            setIsFetching(false);
        }
    }, [parentId, filterHidden]);

    React.useEffect(() => {
        getComments();
        return () => observer.current.unsubscribe();
    }, [getComments]);

    return { state: Object.values(state), setState, isFetching, error };
};

export default useComments;
