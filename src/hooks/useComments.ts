import * as models from "../models";
import { DataStore } from "aws-amplify";
import React from "react";
import convertModelListToTypedObject from "./utilities/convertModelListToTypedObject";
import { useSelector } from "react-redux";
import { getWhoami } from "../redux/Selectors";

export type CommentsState = {
    [key: string]: models.Comment;
};

const useGetComments = (parentId: string) => {
    const [state, setState] = React.useState<CommentsState>({});
    const [isFetching, setIsFetching] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);
    const whoami = useSelector(getWhoami);
    const observer = React.useRef({ unsubscribe: () => {} });

    const filterHidden = React.useCallback(
        (comments: models.Comment[]) => {
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
            const comments = await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", parentId)
            );
            const filtered = filterHidden(comments);
            setState(convertModelListToTypedObject<models.Comment>(filtered));
            observer.current.unsubscribe();
            observer.current = DataStore.observe(models.Comment, (c) =>
                c.parentId("eq", parentId)
            ).subscribe(async () => {
                const comments = await DataStore.query(models.Comment, (c) =>
                    c.parentId("eq", parentId)
                );
                const filtered = filterHidden(comments);
                setState(
                    convertModelListToTypedObject<models.Comment>(filtered)
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

    return { state, isFetching, error };
};

export default useGetComments;
