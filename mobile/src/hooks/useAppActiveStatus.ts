import * as React from "react";
import { AppState } from "react-native";

const useAppActiveStatus = () => {
    const [state, setState] = React.useState(AppState.currentState);

    React.useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
                setState(nextAppState);
                console.log("AppState", nextAppState);
            }
        );
        return () => {
            subscription.remove();
        };
    }, []);

    return state;
};

export default useAppActiveStatus;
