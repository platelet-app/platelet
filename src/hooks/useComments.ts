import React from "react";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import * as models from "../models";
import { getWhoami } from "../redux/Selectors";

const useComments = (parentId: string) => {
    const [state, setState] = React.useState<models.Comment[]>([]);
    const [isFetching, setIsFetching] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const whoami = useSelector(getWhoami);

    const observer = React.useRef({ unsubscribe: () => {} });

    const getUserAssignments = React.useCallback(async () => {
        debugger;
        if (!parentId) return;
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
            ).subscribe(({ items }) => {
                setState(items);
                setIsFetching(false);
            });
        } catch (error) {
            setError(error);
            setIsFetching(false);
        }
    }, [parentId, whoami]);

    React.useEffect(() => {
        getUserAssignments();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getUserAssignments]);

    return { state, isFetching, error };
};

export default useComments;
