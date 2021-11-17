import React from "react";
import { applyMiddleware, createStore } from "redux";
import rootReducer from "./redux/Reducers";
import createSagaMiddleware from "redux-saga";
import { render } from "@testing-library/react";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
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

const sagaOptions = {
    onErraor: (action, error) => {
        console.log("An uncaught exception has occurred in redux-saga:");
        console.log(action);
        if (error) {
            console.log(error.message);
        }
        throw error;
    },
};

const sagaMiddleWare = createSagaMiddleware(sagaOptions);
const store = createStore(rootReducer, applyMiddleware(sagaMiddleWare));

const AllTheProviders = ({ children }) => {
    return (
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SnackbarProvider maxSnack={1}>{children}</SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    );
};

const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
