import React, {useEffect, useState} from 'react';
import {ResponsiveDrawer} from './containers/Menu'
import Login from './Login'
import './index.css'
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {useDispatch, useSelector} from "react-redux";
import {
    getWhoami, setMobileView
} from "./redux/Actions";
import {loginUser, logoutUser, removeApiURL, setApiURL} from "./redux/login/LoginActions";
import {getAvailableDeliverables} from "./redux/deliverables/DeliverablesActions";
import {getAvailableLocations} from "./redux/locations/LocationsActions";
import {getAvailablePatches} from "./redux/patches/PatchesActions";
import {getAvailablePriorities} from "./redux/priorities/PrioritiesActions";
import {getUsers} from "./redux/users/UsersActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment"
import ApiConfig from "./containers/ApiConfig";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {clearServerSettings, getServerSettings} from "./redux/ServerSettings/ServerSettingsActions";
import {withSnackbar} from "notistack";
import LoginSkeleton from "./loadingComponents/LoginSkeleton";

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


function App(props) {
    const apiControl = useSelector(state => state.apiControl);
    const whoami = useSelector(state => state.whoami);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const apiURL = useSelector(state => state.apiControl.api_url);
    const serverSettings = useSelector(state => state.serverSettings);
    const error = useSelector(state => state.error);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [confirmLogin, setConfirmLogin] = useState(false);

    function displayError() {
        if (error)
            props.enqueueSnackbar(`${error}`,  { variant: "error", autoHideDuration: 8000 });
    }
    useEffect(displayError, [error])

    function requestServerSettings() {
        if (apiURL) {
            dispatch(getServerSettings())
        }
    }
    useEffect(requestServerSettings, [apiURL])

    function checkServerSettings() {
        Moment.globalMoment = moment;
        if (serverSettings) {
            Moment.globalLocale = serverSettings.locale.code;
        }
    }
    useEffect(checkServerSettings, [serverSettings]);

    function loginCheck() {
        if (whoami && whoami.login_expiry) {
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
                        <ResponsiveDrawer apiControl={apiControl}/>
                    </div>
                </React.Fragment>
            </div>
        );
    } else if (serverSettings) {
        return (
            <div className={classes.centeredDiv}>
                <Grid container direction={"column"} alignItems={"center"} spacing={3}>
                    <Grid item>
                        <Login apiUrl={apiURL}/>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => {
                            dispatch(removeApiURL());
                            dispatch(clearServerSettings());
                        }}>
                            Change Organisation
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
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
    } else {
        return (
        <div className={classes.centeredDiv}>
            <LoginSkeleton/>
        </div>
        )
    }

}

export default withSnackbar(App);
