import React, {useEffect, useState} from 'react';
import {ResponsiveDrawer} from './containers/Menu'
import Login from './Login'
import './index.css'
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {useDispatch, useSelector} from "react-redux";
import {
    clearWhoami,
    getWhoami, setMobileView
} from "./redux/Actions";
import {logoutUser, removeApiURL, setApiURL} from "./redux/login/LoginActions";
import {getAvailableDeliverables} from "./redux/deliverables/DeliverablesActions";
import {getAvailableLocations} from "./redux/locations/LocationsActions";
import {getAvailablePatches} from "./redux/patches/PatchesActions";
import {getAvailablePriorities} from "./redux/priorities/PrioritiesActions";
import {getUsers} from "./redux/users/UsersActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Moment from "react-moment"
import ApiConfig from "./containers/ApiConfig";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {clearServerSettings, getServerSettings} from "./redux/ServerSettings/ServerSettingsActions";
import {withSnackbar} from "notistack";
import LoginSkeleton from "./loadingComponents/LoginSkeleton";
import {Helmet} from "react-helmet"
import moment from 'moment-timezone';
import {getApiURL} from "./utilities";
import Menu from "@material-ui/core/Menu";


const useStyles = makeStyles(theme => ({
    centeredDiv: {
        height: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        background: "rgb(230, 230, 230)",

    }
}));

const snackOptions = {
    preventDuplicate: true,
    autoHideDuration: 6000
}

function App(props) {
    const apiControl = useSelector(state => state.apiControl);
    const whoami = useSelector(state => state.whoami.user);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const apiURL = useSelector(state => state.apiControl.api_url);
    const serverSettings = useSelector(state => state.serverSettings);
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();
    const classes = useStyles();
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

    function handleError() {
        // any saga that returns with an error object that is not null will be handled here
        if (error) {
            if (error.message)
                props.enqueueSnackbar(`${error}: ${error.message}`,
                    {...snackOptions,
                        variant: "error"});
            else
                props.enqueueSnackbar(`${error}: No message returned from the server.`, {
                    ...snackOptions,
                    variant: "error"
                });
            // if all else fails with authentication, log out the user
            if (error.status === 401) {
                props.enqueueSnackbar("Access has expired. Please log in again.", {
                    ...snackOptions,
                    variant: "warning"
                });
                dispatch(logoutUser())
            }
        }
    }

    useEffect(handleError, [error])

    function requestServerSettings() {
        if (apiURL) {
            dispatch(getServerSettings())
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
            dispatch(getWhoami());
        else
            dispatch(clearWhoami())
    }

    useEffect(firstWhoami, [isInitialised])

    function getStaticData() {
        if (isInitialised) {
            dispatch(getAvailablePriorities());
            dispatch(getAvailableDeliverables());
            dispatch(getAvailableLocations());
            dispatch(getUsers());
            dispatch(getAvailablePatches())
        }
    }
    useEffect(getStaticData, [confirmLogin]);

    const theme = useTheme();
    dispatch(setMobileView(!useMediaQuery(theme.breakpoints.up('sm'))));

    if (isInitialised) {
        return (
            <div className={'body'}>
                <React.Fragment>
                    <CssBaseline/>
                    <div className="App">
                        <Helmet>
                            <title>{serverSettings.organisation_name}</title>
                            <link rel="icon" type="image/png" sizes="16x16" href={
                                serverSettings.favicon ? "data:image/png;base64," + serverSettings.favicon : "favicon.ico"
                            }/>
                        </Helmet>
                        <ResponsiveDrawer apiControl={apiControl}/>
                    </div>
                </React.Fragment>
            </div>
        );
    } else if (!apiURL) {
        return (
            <div className={classes.centeredDiv}>
                <Grid container direction={"column"} alignItems={"center"} spacing={3}>
                    <Grid item>
                        <ApiConfig onSelect={(result) => {
                            dispatch(setApiURL(result))
                        }}/>
                    </Grid>
                </Grid>
            </div>
        )
    } else if (serverSettings) {
        return (
            <div className={classes.centeredDiv}>
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
            </div>
        )
    } else {
        return (
            <div className={classes.centeredDiv}>
                <LoginSkeleton/>
            </div>
        )
    }

}

export default withSnackbar(App);
