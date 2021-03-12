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
    setDarkMode,
    setIdleStatus, setMobileView
} from "./redux/Actions";
import {logoutUser, removeApiURL} from "./redux/login/LoginActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Moment from "react-moment"
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {clearServerSettings, getServerSettingsRequest} from "./redux/ServerSettings/ServerSettingsActions";
import {SnackbarProvider, withSnackbar} from "notistack";
import LoginSkeleton from "./scenes/Login/components/LoginSkeleton";
import {Helmet} from "react-helmet"
import moment from 'moment-timezone';
import 'moment/locale/en-gb'
import {DismissButton, showHide} from "./styles/common";
import {Link} from "react-router-dom";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import {initialiseApp} from "./redux/initialise/initialiseActions";


const useStyles = makeStyles(theme => ({
    centeredDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
    },
    login: {
        height: "100%",
        margin: "auto",
        paddingTop: 70

    }
}));


function AppContents(props) {
    const forceResetPassword = useSelector(state => state.whoami.user.password_reset_on_login);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const incomingNotification = useSelector(state => state.notification);
    const apiURL = useSelector(state => state.apiControl.api_url);
    const serverSettings = useSelector(state => state.serverSettings);
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {show, hide} = showHide();


    const [headerSettings, setHeaderSettings] = useState({
        title: "Bloodbike Dispatch",
        favicon: ""
    })

    useEffect(() => dispatch(getServerSettingsRequest()), [])

    function initialise() {
        // this gets priorities, deliverable types, users, patches from the api and connects sockets
        if (isInitialised)
            dispatch(initialiseApp())
    }

    useEffect(initialise, [isInitialised])

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
            if (error.status_code === 404 || error.status_code === 401) {
                // do nothing
            }
            // TODO: fix error messages not showing up here
            else if (error.status_code) {
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


    let helmet =
        <Helmet>
            <title>Bloodbike Dispatch</title>
        </Helmet>

    function checkServerSettings() {
        Moment.globalMoment = moment;
        Moment.globalLocale = serverSettings.locale.code;
    }

    useEffect(checkServerSettings, [serverSettings]);


    const theme = useTheme();
    dispatch(setMobileView(!useMediaQuery(theme.breakpoints.up('sm'))));

    let appContents;


    if (forceResetPassword || (serverSettings && !isInitialised)) {
        appContents =
            <div className={classes.login}>
                <Login apiUrl={apiURL}/>
            </div>

    } else if (isInitialised) {
        appContents = <React.Fragment>
            <Helmet>
                <title>platelet</title>
            </Helmet>
            <MenuMainContainer/>
        </React.Fragment>
        ;
    } else {
        appContents =
            <div className={classes.login}>
                <LoginSkeleton/>
            </div>

    }
    return (
        <React.Fragment>
            {appContents}
        </React.Fragment>

    )

}

const AppMain = withSnackbar(AppContents);

function App(props) {
    const darkMode = useSelector(state => state.darkMode);
    let theme;
    if (darkMode) {
        theme = createMuiTheme({
            palette: {
                type: "dark",
            },
        });
    } else {
        theme = createMuiTheme({
            palette: {
                type: "light",
                background: {
                    default: "rgb(235, 235, 235)"
                }
            },

        })
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
            <CssBaseline/>
            <SnackbarProvider classes={classes} maxSnack={1}>
                <AppMain {...props}/>
            </SnackbarProvider>
        </MuiThemeProvider>


    )
}

export default App;


