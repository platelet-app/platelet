import * as React from "react";
import { DataStore } from "aws-amplify";
import { matchSorter } from "match-sorter";
import {
    PersistentModel,
    PersistentModelConstructor,
} from "@aws-amplify/datastore";
import { useDispatch } from "react-redux";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";

const useListControls = <T extends PersistentModel>(
    searchKeys: string[] = [],
    searchInput: string = "",
    hideDisabled = true,
    model: PersistentModelConstructor<T>
) => {
    const [state, setState] = React.useState<T[]>([]);
    const [filteredState, setFilteredState] = React.useState<T[]>([]);
    const dispatch = useDispatch();
    const observer = React.useRef({ unsubscribe: () => {} });
    const getData = React.useCallback(() => {
        try {
            observer.current.unsubscribe();
            observer.current = DataStore.observeQuery(model).subscribe(
                ({ items }) => {
                    setState(items);
                }
            );
        } catch (error) {
            console.log("Request failed", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }, [dispatch, model]);

    React.useEffect(() => {
        getData();
        return () => {
            observer.current.unsubscribe();
        };
    }, [getData]);

    const searchKeysString = JSON.stringify(searchKeys);

    React.useEffect(() => {
        let filtered = state;
        if (hideDisabled) {
            filtered = state.filter((item) => item.disabled !== 1);
        }
        setFilteredState(
            matchSorter(filtered, searchInput, {
                keys: searchKeys,
            })
        );
    }, [searchInput, state, hideDisabled, searchKeysString]);

    return { state: filteredState };
};

export default useListControls;
