import React, { useEffect } from "react";
import { MenuMainContainer } from "./navigation/MenuMainContainer";
import "./index.css";
import "./App.css";
import "typeface-roboto";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
import { useIdleTimer } from "react-idle-timer";
import { setIdleStatus, setMobileView } from "./redux/Actions";
import { withAuthenticator } from "@aws-amplify/ui-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Moment from "react-moment";
import Amplify, { Logger } from "aws-amplify";

import { SnackbarProvider, withSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import moment from "moment-timezone";
import "moment/locale/en-gb";
import { DismissButton } from "./styles/common";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import SnackNotificationButtons from "./components/SnackNotificationButtons";

if (
    (!process.env.REACT_APP_OFFLINE_ONLY ||
        process.env.REACT_APP_OFFLINE_ONLY === "false") &&
    (!process.env.REACT_APP_DEMO_MODE ||
        process.env.REACT_APP_DEMO_MODE === "false")
) {
    const config = require("../src/aws-exports");
    Amplify.configure({
        ...config,
        ssr: true,
    });
}
Logger.LOG_LEVEL = "ERROR";

function AppContents(props) {
    const incomingNotification = useSelector((state) => state.notification);
    const serverSettings = useSelector((state) => state.serverSettings);
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
        Moment.globalLocale = serverSettings.locale.code;
    }

    useEffect(checkServerSettings, [serverSettings]);

    const theme = useTheme();
    dispatch(setMobileView(!useMediaQuery(theme.breakpoints.up("sm"))));

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
    DROPPED_OFF: "lightgreen",
    CANCELLED: "blue",
    REJECTED: "grey",
};

function AppDefault(props) {
    const darkMode = useSelector((state) => state.darkMode);
    let theme;
    if (darkMode) {
        theme = createMuiTheme({
            palette: {
                type: "dark",
                taskStatus,
            },
        });
    } else {
        theme = createMuiTheme({
            palette: {
                type: "light",
                background: {
                    default: "rgb(235, 235, 235)",
                },
                taskStatus,
            },
        });
    }

    const useStylesNotistack = makeStyles({
        contentRoot: {
            backgroundColor: theme.palette.background.default,
        },
        variantSuccess: {
            backgroundColor: theme.palette.success.main,
        },
        variantError: {
            backgroundColor: theme.palette.error.main,
        },
        variantInfo: {
            backgroundColor: theme.palette.info.main,
        },
        variantWarning: {
            backgroundColor: theme.palette.warning.main,
        },
    });

    const classes = useStylesNotistack();

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider classes={classes} maxSnack={1}>
                <AppMain {...props} />
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}

const App =
    process.env.REACT_APP_OFFLINE_ONLY === "true"
        ? AppDefault
        : withAuthenticator(AppDefault);
export default App;
