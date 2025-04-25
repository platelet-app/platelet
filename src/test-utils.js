import React from "react";
import createSagaMiddleware from "redux-saga";
import * as models from "./models";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Provider, useDispatch } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import mediaQuery from "css-mediaquery";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { render as rtlRender } from "@testing-library/react";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import rootSaga from "./redux/RootSagas";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/Reducers";
import { userRoles } from "./apiConsts";
import SnackNotificationBar from "./components/SnackNotificationBar";

const testUserModel = new models.User({
    name: "whoami",
    displayName: "Mock User",
    roles: Object.values(userRoles),
    dateOfBirth: null,
    profilePictureThumbnailURL: null,
});

export const testUser = { ...testUserModel, id: "whoami" };

const taskStatus = {
    NEW: "rgba(252, 231, 121, 1)",
    ACTIVE: "cornflowerblue",
    PICKED_UP: "orange",
    DROPPED_OFF: "lightgreen",
    CANCELLED: "blue",
    REJECTED: "grey",
};
const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "rgb(235, 235, 235)",
        },
        taskStatus,
    },
});

export function createMatchMedia(width) {
    return (query) => ({
        matches: mediaQuery.match(query, {
            width,
        }),
        addListener: () => {},
        removeListener: () => {},
    });
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function generateTimes(previous = null, hours = 2) {
    let date;
    if (previous) date = new Date(previous);
    else date = new Date();
    if (!previous) date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeOfCall = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timePickedUp = date.toISOString();
    date.setMinutes(date.getMinutes() + getRandomInt(20, 30));
    const timeDroppedOff = date.toISOString();

    return { timeDroppedOff, timePickedUp, timeOfCall };
}

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
    <SnackNotificationBar />;

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
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
    } = {},
    initialEntries = ["/"]
) {
    sagaMiddleWare.run(rootSaga);
    function Wrapper(props) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={initialEntries}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <ReactNotification />
                        <SnackbarProvider maxSnack={1}>
                            <TestApp {...props}>{props.children}</TestApp>
                            <SnackNotificationBar {...props} />
                        </SnackbarProvider>
                    </LocalizationProvider>
                </MemoryRouter>
            </Provider>
        );
    }
    return {
        store,
        component: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}
// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
