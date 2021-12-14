import React from "react";
import rootReducer from "./redux/Reducers";
import createSagaMiddleware from "redux-saga";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { render as rtlRender } from "@testing-library/react";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import rootSaga from "./redux/RootSagas";
import store from "./redux/Store";

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

const sagaMiddleWare = createSagaMiddleware(sagaOptions);

function TestApp({ children }) {
    const dispatch = useDispatch();
    function initialise() {
        dispatch(initialiseApp());
    }
    React.useEffect(initialise, []);
    return (
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ReactNotification />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <SnackbarProvider maxSnack={1}>
                            {children}
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </LocalizationProvider>
        </BrowserRouter>
    );
}

function render(ui, { preloadedState, ...renderOptions } = {}) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <ReactNotification />
                        <TestApp>{children}</TestApp>
                    </LocalizationProvider>
                </BrowserRouter>
            </Provider>
        );
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
