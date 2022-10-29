import { useDispatch } from "react-redux";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import * as modalTrackerActions from "../redux/modalTracker/modalTrackerActions";
import { useSelector } from "react-redux";
import { modalTrackerSelector } from "../redux/Selectors";

export function useCordovaBackButton(
    handler: () => void,
    enabled: boolean = true
) {
    const backId = React.useRef(uuidv4());
    const dispatch = useDispatch();
    const modalTracker = useSelector(modalTrackerSelector);
    const targetRef = React.useRef<HTMLElement>(null);

    const handleBackButtonPress = React.useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            handler();
        },
        [handler]
    );

    React.useEffect(() => {
        const currentId = backId.current;
        if (enabled) {
            dispatch(modalTrackerActions.appendModal(currentId));
        } else {
            dispatch(modalTrackerActions.removeModal(currentId));
        }
        return () => {
            dispatch(modalTrackerActions.removeModal(currentId));
        };
    }, [dispatch, enabled]);

    const onBackKeyDown = React.useCallback(
        (event) => {
            if (modalTracker[modalTracker.length - 1] === backId.current) {
                handleBackButtonPress(event);
            }
        },
        [handleBackButtonPress, modalTracker]
    );

    React.useEffect(() => {
        if (enabled) {
            document.addEventListener("backbutton", onBackKeyDown, false);
            return () => {
                document.removeEventListener(
                    "backbutton",
                    onBackKeyDown,
                    false
                );
            };
        } else {
            document.removeEventListener("backbutton", onBackKeyDown, false);
        }
    }, [onBackKeyDown, enabled]);

    return targetRef;
}
