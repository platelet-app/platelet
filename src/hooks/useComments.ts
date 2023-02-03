import React from "react";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import * as models from "../models";
import { getWhoami } from "../redux/Selectors";
import { ResolvedComment } from "../resolved-models";

const useComments = (parentId: string) => {
    const [state, setState] = React.useState<ResolvedComment[]>([]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const whoami = useSelector(getWhoami);
    const loadedOnce = React.useRef(false);

    const observer = React.useRef({ unsubscribe: () => {} });

    const getUserAssignments = React.useCallback(async () => {
        if (!parentId) return;
        if (!loadedOnce.current) setIsFetching(true);
        setIsFetching(true);
        observer.current.unsubscribe();
        try {
            observer.current = DataStore.observeQuery(models.Comment, (c) =>
                c.and((c) => [
                    c.parentId.eq(parentId),
                    c.or((c) => [
                        c.visibility.eq(models.CommentVisibility.EVERYONE),
                        c.and((c) => [
                            c.visibility.eq(models.CommentVisibility.ME),
                            c.author.id.eq(whoami.id),
                        ]),
                    ]),
                ])
            ).subscribe(async ({ items }) => {
                const resolvedComments = await Promise.all(
                    items.map(async (comment) => {
                        const author = await comment.author;
                        return {
                            ...comment,
                            author,
                        };
                    })
                );
                setState(resolvedComments);
                setIsFetching(false);
                loadedOnce.current = true;
            });
        } catch (error) {
            setError(error);
            setIsFetching(false);
            loadedOnce.current = true;
        }
    }, [parentId, whoami]);

    React.useEffect(() => {
        getUserAssignments();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getUserAssignments]);

    return { state, isFetching, error, setState };
};

export default useComments;
