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
import {logoutUser, setApiURL} from "./redux/login/Actions";
import {getAvailableDeliverables} from "./redux/deliverables/Actions";
import {getAvailableLocations} from "./redux/locations/Actions";
import {getAvailablePatches} from "./redux/patches/Actions";
import {getAvailablePriorities} from "./redux/priorities/Actions";
import {getUsers} from "./redux/users/Actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment"
import ApiConfig from "./containers/ApiConfig";
import {useHistory} from "react-router";



function App(props) {
    const apiControl = useSelector(state => state.apiControl);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const apiURL = useSelector(state => state.apiControl.api_url);
    const dispatch = useDispatch();

    function componentDidMount() {
        Moment.globalMoment = moment;
        //TODO: get this from server settings table once implemented
        Moment.globalLocale = 'en-GB';
    }
    useEffect(componentDidMount, []);

    function getStaticData() {
        // Not sure why props.logout check is needed here
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
            <Login apiUrl={apiURL}/>
        )
    } else {
        return (
            <ApiConfig onSelect={(result) => {
                dispatch(setApiURL(result))
            }}/>
        )
    }
}

export default App;
