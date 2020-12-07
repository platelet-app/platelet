import React, {useEffect, useState} from 'react';
import {MenuMainContainer} from './navigation/MenuMainContainer'
import Login from './scenes/Login/Login'
import './index.css'
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {useDispatch, useSelector} from "react-redux";
import {useIdleTimer} from 'react-idle-timer'
import {
    clearWhoami,
    getWhoamiRequest, setIdleStatus, setMobileView
} from "./redux/Actions";
import {logoutUser, removeApiURL, setApiURL} from "./redux/login/LoginActions";
import {getAvailableDeliverablesRequest} from "./redux/deliverables/DeliverablesActions";
import {getAvailableLocationsRequest} from "./redux/locations/LocationsActions";
import {getAvailablePatchesRequest} from "./redux/patches/PatchesActions";
import {getAvailablePrioritiesRequest} from "./redux/priorities/PrioritiesActions";
import {getUsersRequest} from "./redux/users/UsersActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Moment from "react-moment"
import ApiConfig from "./scenes/ApiConfig";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {clearServerSettings, getServerSettingsRequest} from "./redux/ServerSettings/ServerSettingsActions";
import {withSnackbar} from "notistack";
import LoginSkeleton from "./scenes/Login/components/LoginSkeleton";
import {Helmet} from "react-helmet"
import moment from 'moment-timezone';
import 'moment/locale/en-gb'
import {getApiURL} from "./utilities";
import {
    connectAssignmentsSocket,
    connectCommentsSocket,
    connectSocket,
} from "./redux/sockets/SocketActions";
import {DismissButton, showHide} from "./styles/common";
import {Link} from "react-router-dom";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    centeredDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    }
}));

const themeLight = createMuiTheme({
    palette: {
        background: {
            default: "rgb(230, 230, 230)"
        }
    }
});

const themeDark = createMuiTheme({
    palette: {
        background: {
            default: "#222222"
        },
        text: {
            primary: "#ffffff"
        }
    }
});


function App(props) {
    const apiControl = useSelector(state => state.apiControl);
    const whoami = useSelector(state => state.whoami.user);
    const forceResetPassword = useSelector(state => state.whoami.user.password_reset_on_login);

    const isInitialised = useSelector(state => state.apiControl.initialised);
    const incomingNotification = useSelector(state => state.infoNotifications);
    const apiURL = useSelector(state => state.apiControl.api_url);
    const serverSettings = useSelector(state => state.serverSettings);
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {show, hide} = showHide();
    const [confirmLogin, setConfirmLogin] = useState(false);
    const [headerSettings, setHeaderSettings] = useState({
        title: "Bloodbike Dispatch",
        favicon: ""
    })

    function checkEnvApirURL() {
        if (process.env.REACT_APP_API_URL) {
            if (getApiURL() !== process.env.REACT_APP_API_URL)
                dispatch(setApiURL(process.env.REACT_APP_API_URL))
        }
    }

    useEffect(checkEnvApirURL, [])

    const handleOnIdle = event => {
        dispatch(setIdleStatus(true));
        console.log('user is idle', event)
        console.log('last active', getLastActiveTime())
    }

    const handleOnActive = event => {
        dispatch(setIdleStatus(false));
        console.log('user is active', event)
        console.log('time remaining', getRemainingTime())
    }

    const {getRemainingTime, getLastActiveTime} = useIdleTimer({
        timeout: 1000 * 60 * 5,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        debounce: 500
    })

    const snackDismissAction = (key) => (
        <React.Fragment>
            <DismissButton onClick={() => props.closeSnackbar(key)}/>
        </React.Fragment>
    )
    const snackOptions = {
        action: snackDismissAction,
        preventDuplicate: true,
        autoHideDuration: 6000
    }

    function handleError() {
        // any saga that returns with an error object that is not null will be handled here
        if (error) {
            if (error.status === 404) {
                // do nothing
            }
            else if (error.name === "HttpError") {
                if (error.message)
                    props.enqueueSnackbar(`${error.message}`,
                        {
                            ...snackOptions,
                            variant: "error",
                        });
                else
                    props.enqueueSnackbar(`No message returned from the server.`, {
                        ...snackOptions,
                        variant: "error",
                    });
                // if all else fails with authentication, log out the user
                if (error.status === 401) {
                    props.enqueueSnackbar("Access has expired. Please log in again.", {
                        ...snackOptions,
                        variant: "warning",
                    });
                    dispatch(logoutUser())
                }
            } else {
                if (process.env.REACT_APP_THROW_ERRORS === "true")
                    throw error;
                else
                    console.error(error)
            }
        }
    }

    useEffect(handleError, [error])

    function showNotification() {
        if (incomingNotification) {
            const {message, options, restoreActions, viewLink} = incomingNotification;
            options.action = key => (
                <React.Fragment>
                    <Button
                        className={restoreActions && restoreActions().length !== 0 ? show : hide}
                        color="secondary"
                        size="small" onClick={() => {
                        props.closeSnackbar(key);
                        for (const dispatchAction of restoreActions()) {
                            dispatch(dispatchAction);
                        }
                    }}>
                        UNDO
                    </Button>
                    <Button
                        className={viewLink ? show : hide}
                        color="secondary"
                        size="small"
                        component={Link} to={viewLink || "/"}>
                        VIEW
                    </Button>
                    <DismissButton onClick={() => props.closeSnackbar(key)}/>
                </React.Fragment>
            );
            props.enqueueSnackbar(message, options)
        }
    }

    useEffect(showNotification, [incomingNotification])

    function requestServerSettings() {
        if (apiURL) {
            dispatch(getServerSettingsRequest())
            dispatch(connectSocket(apiURL + "subscribe"))
            dispatch(connectCommentsSocket(apiURL + "subscribe_comments"))
            dispatch(connectAssignmentsSocket(apiURL + "subscribe_assignments"))
        }
    }

    useEffect(requestServerSettings, [apiURL])

    let helmet =
        <Helmet>
            <title>Bloodbike Dispatch</title>
        </Helmet>

    function checkServerSettings() {
        Moment.globalMoment = moment;
        Moment.globalLocale = serverSettings.locale.code;
    }

    useEffect(checkServerSettings, [serverSettings]);

    function loginCheck() {
        if (whoami && whoami.login_expiry) {
            // if the login is going to expire in 3 days, log out the user
            if (whoami.login_expiry < moment().add("days", 3).unix()) {
                dispatch(logoutUser());
            } else {
                setConfirmLogin(true);
            }
        }
    }

    useEffect(loginCheck, [whoami])

    function firstWhoami() {
        if (isInitialised)
            dispatch(getWhoamiRequest());
        else
            dispatch(clearWhoami())
    }

    useEffect(firstWhoami, [isInitialised])

    function getStaticData() {
        if (isInitialised) {
            dispatch(getAvailablePrioritiesRequest());
            dispatch(getAvailableDeliverablesRequest());
            dispatch(getAvailableLocationsRequest());
            dispatch(getUsersRequest());
            dispatch(getAvailablePatchesRequest())
        }
    }

    useEffect(getStaticData, [confirmLogin]);

    const theme = useTheme();
    dispatch(setMobileView(!useMediaQuery(theme.breakpoints.up('sm'))));

    let appContents;

    if (!apiURL) {
        appContents =
            <ApiConfig onSelect={(result) => {
                dispatch(setApiURL(result))
            }}/>

    } else if (forceResetPassword || (serverSettings && !isInitialised)) {
        appContents =
            <Grid container direction={"column"} alignItems={"center"} spacing={3}>
                <Grid item>
                    <Login apiUrl={apiURL}/>
                </Grid>
                {process.env.REACT_APP_API_URL ? <></> :
                    // No need for change organisation button if the api url is hard coded
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => {
                            dispatch(removeApiURL());
                            dispatch(clearServerSettings());
                        }}>
                            Change Organisation
                        </Button>
                    </Grid>
                }
            </Grid>

    } else if (isInitialised) {
        appContents = <React.Fragment>
            <Helmet>
                <title>{serverSettings.organisation_name}</title>
                <link rel="icon" type="image/png" sizes="16x16" href={
                    serverSettings.favicon ? "data:image/png;base64," + serverSettings.favicon : "favicon.ico"
                }/>
            </Helmet>
            <MenuMainContainer/>
        </React.Fragment>
        ;
    } else {
        appContents =
            <div className={classes.centeredDiv}>
                <LoginSkeleton/>
            </div>

    }
    return (
        <MuiThemeProvider theme={themeLight}>
            <CssBaseline/>
            {appContents}
        </MuiThemeProvider>

    )

}

export default withSnackbar(App);
