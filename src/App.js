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


function App() {
    const apiControl = useSelector(state => state.apiControl);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const apiURL = useSelector(state => state.apiControl.api_url);
    const dispatch = useDispatch();
    const classes = useStyles();

    function componentDidMount() {
        Moment.globalMoment = moment;
        //TODO: get this from server settings table once implemented
        Moment.globalLocale = 'en-GB';
    }

    useEffect(componentDidMount, []);

    function getStaticData() {
        if (isInitialised) {
            dispatch(getAvailablePriorities());
            dispatch(getAvailableDeliverables());
            dispatch(getAvailableLocations());
            dispatch(getUsers());
            dispatch(getWhoami());
            dispatch(getAvailablePatches())
        }
    }

    useEffect(getStaticData, [isInitialised]);

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
    } else if (apiURL) {
        return (
            <div className={classes.centeredDiv}>
                <Grid container direction={"column"} alignItems={"center"} spacing={3}>
                    <Grid item>
                        <Login apiUrl={apiURL}/>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => {
                            dispatch(removeApiURL());
                        }}>
                            Change Organisation
                        </Button>
                    </Grid>
                </Grid>
            </div>
        )
    } else {
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
    }
}

export default App;
