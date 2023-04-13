import React from "react";
import createSagaMiddleware from "redux-saga";
import * as models from "./models";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider, withSnackbar } from "notistack";
import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import mediaQuery from "css-mediaquery";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { render as rtlRender } from "@testing-library/react";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import rootSaga from "./redux/RootSagas";
import { DismissButton } from "./styles/common";
import SnackNotificationButtons from "./components/SnackNotificationButtons";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/Reducers";
import { userRoles } from "./apiConsts";

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

    const incomingNotification = useSelector((state) => state.notification);

    const snackDismissAction = (key) => (
        <React.Fragment>
            <DismissButton onClick={() => props.closeSnackbar(key)} />
        </React.Fragment>
    );

    function showNotification() {
        if (incomingNotification) {
            const { message, options, restoreCallback, viewLink } =
                incomingNotification;
            options.action = (key) => (
                <SnackNotificationButtons
                    restoreCallback={restoreCallback}
                    viewLink={viewLink}
                    snackKey={key}
                    closeSnackbar={props.closeSnackbar}
                />
            );
            props.enqueueSnackbar(message, options);
        }
    }

    React.useEffect(showNotification, [incomingNotification]);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

const AppSnacked = withSnackbar(TestApp);

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
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <ReactNotification />
                        <SnackbarProvider maxSnack={1}>
                            <AppSnacked {...props}>{props.children}</AppSnacked>
                        </SnackbarProvider>
                    </LocalizationProvider>
                </BrowserRouter>
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
