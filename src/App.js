import React, { useEffect } from "react";
import { MenuMainContainer } from "./navigation/MenuMainContainer";
import "./index.css";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
import { setMobileView } from "./redux/Actions";
import { withAuthenticator } from "@aws-amplify/ui-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Moment from "react-moment";
import Amplify, { Logger } from "aws-amplify";
import { SnackbarProvider, withSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import moment from "moment-timezone";
import "moment/locale/en-gb";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import SnackNotificationButtons from "./components/SnackNotificationButtons";
import { getWhoami } from "./redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "./models";
import useCurrentTheme from "./hooks/useCurrentTheme";
import TenantList from "./scenes/TenantPicker/TenantList";

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

let didInit = false;

function AppContents({ closeSnackbar, enqueueSnackbar }) {
    const incomingNotification = useSelector((state) => state.notification);
    const dispatch = useDispatch();

    function initialise() {
        if (!didInit) {
            dispatch(initialiseApp());
            didInit = true;
        }
    }
    useEffect(initialise, [dispatch]);

    const showNotification = React.useCallback(
        (notification) => {
            if (notification) {
                const { message, options, restoreCallback, viewLink } =
                    notification;
                options.action = (key) => (
                    <SnackNotificationButtons
                        restoreCallback={restoreCallback}
                        viewLink={viewLink}
                        snackKey={key}
                        closeSnackbar={closeSnackbar}
                    />
                );
                enqueueSnackbar(message, options);
            }
        },
        [enqueueSnackbar, closeSnackbar]
    );

    useEffect(
        () => showNotification(incomingNotification),
        [showNotification, incomingNotification]
    );

    function checkServerSettings() {
        Moment.globalMoment = moment;
        Moment.globalLocale = "en-GB";
    }

    useEffect(checkServerSettings, []);

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
    DROPPED_OFF: "darkgreen",
    COMPLETED: "lightgreen",
    CANCELLED: "blue",
    ABANDONED: "red",
    REJECTED: "grey",
};

function AppDefault(props) {
    //const themePreference = useSelector((state) => state.darkMode);
    const whoami = useSelector(getWhoami);
    let theme;

    const themePreference = useCurrentTheme();

    if (themePreference === "dark") {
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

const AppAuthenticated =
    process.env.REACT_APP_OFFLINE_ONLY === "true"
        ? AppDefault
        : withAuthenticator(AppDefault);

const App = () => {
    const [setupComplete, setSetupComplete] = React.useState(false);
    if (!setupComplete) {
        return <TenantList onSetupComplete={() => setSetupComplete(true)} />;
    } else {
        return <AppAuthenticated />;
    }
};

export default App;
