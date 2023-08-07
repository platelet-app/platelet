import React from "react";
import createSagaMiddleware from "redux-saga";
import { NavigationContainer } from "@react-navigation/native";
import * as models from "./models";
import { Provider, useDispatch } from "react-redux";
import { render as rtlRender } from "@testing-library/react-native";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import rootSaga from "./redux/RootSagas";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/Reducers";
import { PaperProvider } from "react-native-paper";

const testUserModel = new models.User({
    name: "whoami",
    displayName: "Mock User",
    roles: Object.values(models.Role),
    dateOfBirth: null,
    profilePictureThumbnailURL: null,
});

export const testUser = { ...testUserModel, id: "whoami" };

const sagaOptions = {
    onError: (action, error) => {
        console.log("An uncaught exception has occurred in redux-saga:");
        console.log(action);
        if (error) {
            console.log(error.message);
        }
        throw error;
    },
};

function TestApp(props) {
    const dispatch = useDispatch();
    function initialise() {
        return;
        dispatch(initialiseApp());
    }
    React.useEffect(initialise, []);

    return <>{props.children}</>;
}

const sagaMiddleWare = createSagaMiddleware(sagaOptions);

function render(
    ui,
    {
        preloadedState,
        store = configureStore({
            reducer: rootReducer,
            middleware: [sagaMiddleWare],
            preloadedState: {
                roleView: "ALL",
                awsHubDataStoreEventsReducer: {
                    networkStatus: true,
                    ready: true,
                },
                ...preloadedState,
            },
        }),
        ...renderOptions
    } = {}
) {
    sagaMiddleWare.run(rootSaga);
    function Wrapper(props) {
        return (
            <Provider store={store}>
                <PaperProvider>
                    <NavigationContainer>{props.children}</NavigationContainer>
                </PaperProvider>
            </Provider>
        );
    }
    return {
        store,
        component: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
// re-export everything
export * from "@testing-library/react-native";
// override render method
export { render };
