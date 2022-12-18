import React, { useEffect } from "react";
import { MenuMainContainer } from "./navigation/MenuMainContainer";
import "./index.css";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import { useDispatch, useSelector } from "react-redux";
import { setMobileView } from "./redux/Actions";
import "@aws-amplify/ui-react/styles.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Moment from "react-moment";
import { Logger } from "aws-amplify";
import { SnackbarProvider, withSnackbar } from "notistack";
import moment from "moment-timezone";
import "moment/locale/en-gb";
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
} from "@mui/material/styles";
import { initialiseApp } from "./redux/initialise/initialiseActions";
import SnackNotificationButtons from "./components/SnackNotificationButtons";
import { getWhoami, notificationsSelector } from "./redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "./models";
import useCurrentTheme from "./hooks/useCurrentTheme";
import TenantList from "./scenes/TenantPicker/TenantList";
import Login from "./scenes/Login/Login";
import configureAmplify from "./scenes/TenantPicker/utilities/configureAmplify";

declare module "@mui/material/styles" {
    interface Palette {
        taskStatus: {
            NEW: React.CSSProperties["color"];
            ACTIVE: React.CSSProperties["color"];
            PICKED_UP: React.CSSProperties["color"];
            DROPPED_OFF: React.CSSProperties["color"];
            COMPLETED: React.CSSProperties["color"];
            CANCELLED: React.CSSProperties["color"];
            ABANDONED: React.CSSProperties["color"];
            REJECTED: React.CSSProperties["color"];
        };
    }

    interface PaletteOptions {
        taskStatus: {
            NEW: React.CSSProperties["color"];
            ACTIVE: React.CSSProperties["color"];
            PICKED_UP: React.CSSProperties["color"];
            DROPPED_OFF: React.CSSProperties["color"];
            COMPLETED: React.CSSProperties["color"];
            CANCELLED: React.CSSProperties["color"];
            ABANDONED: React.CSSProperties["color"];
            REJECTED: React.CSSProperties["color"];
        };
    }
}

if (
    (!process.env.REACT_APP_OFFLINE_ONLY ||
        process.env.REACT_APP_OFFLINE_ONLY === "false") &&
    (!process.env.REACT_APP_DEMO_MODE ||
        process.env.REACT_APP_DEMO_MODE === "false")
) {
    const config = require("../src/aws-exports");
    configureAmplify(config.default);
}

Logger.LOG_LEVEL = "ERROR";

(window as any).amplifyLogger = Logger;
(window as any).DataStore = DataStore;
(window as any).models = models;

let didInit = false;

const AppContents: React.FC<SnackbarProvider> = ({
    closeSnackbar,
    enqueueSnackbar,
}) => {
    const incomingNotification = useSelector(notificationsSelector);
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
                options.action = (key: number) => (
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
    return <MenuMainContainer />;
};

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

function AppDefault(props: any) {
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

const App = () => {
    const [setupComplete, setSetupComplete] = React.useState(false);
    const offline =
        process.env.REACT_APP_OFFLINE_ONLY &&
        process.env.REACT_APP_OFFLINE_ONLY === "true";
    if (offline) {
        return <AppDefault />;
    } else if (true || setupComplete) {
        return (
            <Login>
                <AppDefault />
            </Login>
        );
    } else {
        return <TenantList onSetupComplete={() => setSetupComplete(true)} />;
    }
};

export default App;
