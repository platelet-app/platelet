import React, { useEffect } from "react";
import { MenuMainContainer } from "./navigation/MenuMainContainer";
import "./index.css";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
import { useIdleTimer } from "react-idle-timer";
import { setIdleStatus, setMobileView } from "./redux/Actions";
import { withAuthenticator } from "@aws-amplify/ui-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Moment from "react-moment";
import Amplify, { Logger } from "aws-amplify";
import { SnackbarProvider, withSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import moment from "moment-timezone";
import "moment/locale/en-gb";
import { DismissButton } from "./styles/common";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import SnackNotificationButtons from "./components/SnackNotificationButtons";
import { getWhoami } from "./redux/Selectors";
import registerServiceWorker from "./register-worker";
import { DataStore } from "aws-amplify";
import * as models from "./models";

if (
    (!process.env.REACT_APP_OFFLINE_ONLY ||
        process.env.REACT_APP_OFFLINE_ONLY === "false") &&
    (!process.env.REACT_APP_DEMO_MODE ||
        process.env.REACT_APP_DEMO_MODE === "false")
) {
    const config = require("../src/aws-exports");
    Amplify.configure({
        ...config.default,
    });
}
Logger.LOG_LEVEL = "ERROR";
window.amplifyLogger = Logger;

window.DataStore = DataStore;
window.models = models;

function AppContents(props) {
    const incomingNotification = useSelector((state) => state.notification);
    const error = useSelector((state) => state.error);
    const dispatch = useDispatch();

    function initialise() {
        dispatch(initialiseApp());
    }
    useEffect(initialise, []);

    const handleOnIdle = (event) => {
        dispatch(setIdleStatus(true));
    };

    const handleOnActive = (event) => {
        dispatch(setIdleStatus(false));
    };

    useIdleTimer({
        timeout: 1000 * 60 * 5,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        debounce: 500,
    });

    const snackDismissAction = (key) => (
        <React.Fragment>
            <DismissButton onClick={() => props.closeSnackbar(key)} />
        </React.Fragment>
    );
    const snackOptions = {
        action: snackDismissAction,
        preventDuplicate: true,
        autoHideDuration: 6000,
    };

    function handleError() {
        // any saga that returns with an error object that is not null will be handled here
        if (error) {
            if (
                error.status_code === 404 ||
                error.status_code === 401 ||
                error.status_code === 425
            ) {
                // do nothing if not found, unauthorised or too early (token refresh error)
            }
            // TODO: fix error messages not showing up here
            else if (error.status_code) {
                if (error.response)
                    error.response.then((data) => {
                        if (data.message) {
                            props.enqueueSnackbar(`${data.message}`, {
                                ...snackOptions,
                                variant: "error",
                            });
                        } else {
                            props.enqueueSnackbar(
                                `No message returned from the server.`,
                                {
                                    ...snackOptions,
                                    variant: "error",
                                }
                            );
                        }
                    });
            } else {
                if (process.env.REACT_APP_THROW_ERRORS === "true") throw error;
                else console.error(error);
            }
        }
    }

    useEffect(handleError, [error]);

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

    useEffect(showNotification, [incomingNotification]);

    function checkServerSettings() {
        Moment.globalMoment = moment;
        Moment.globalLocale = "en-GB";
    }

    useEffect(checkServerSettings, []);

    const theme = useTheme();
    dispatch(setMobileView(!useMediaQuery(theme.breakpoints.up("sm"))));

    registerServiceWorker(props);

    return (
        <React.Fragment>
            <Helmet>
                <title>platelet</title>
            </Helmet>
            <MenuMainContainer />
        </React.Fragment>
    );
}

const AppMain = withSnackbar(AppContents);

const taskStatus = {
    NEW: "rgba(252, 231, 121, 1)",
    ACTIVE: "cornflowerblue",
    PICKED_UP: "orange",
    DROPPED_OFF: "darkgreen",
    COMPLETED: "lightgreen",
    CANCELLED: "blue",
    ABANDONED: "red",
    REJECTED: "grey",
};

function AppDefault(props) {
    const darkMode = useSelector((state) => state.darkMode);
    const whoami = useSelector(getWhoami);
    let theme;

    if (darkMode) {
        theme = createTheme({
            palette: {
                mode: "dark",
                background: {
                    paper: "rgb(40, 40, 40)",
                    default: "rgb(30, 30, 30)",
                },
                taskStatus,
            },
        });
    } else {
        theme = createTheme({
            palette: {
                mode: "light",
                background: {
                    default: "rgb(235, 235, 235)",
                },
                taskStatus,
            },
        });
    }

    if (!whoami) {
        return <></>;
    } else {
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <SnackbarProvider maxSnack={1}>
                        <AppMain {...props} />
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

const App =
    process.env.REACT_APP_OFFLINE_ONLY === "true"
        ? AppDefault
        : withAuthenticator(AppDefault);
export default App;
