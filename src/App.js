import React, {useEffect, useState} from 'react';
import {ResponsiveDrawer} from './containers/Menu'
import Login from './Login'
import './index.css'
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {useDispatch, useSelector} from "react-redux";
import {
    getWhoami, setMobileView, setViewMode
} from "./redux/Actions";
import {logoutUser} from "./redux/login/Actions";
import {getAvailableDeliverables} from "./redux/deliverables/Actions";
import {getAvailableLocations} from "./redux/locations/Actions";
import {getAvailablePatches} from "./redux/patches/Actions";
import {getAvailablePriorities} from "./redux/priorities/Actions";
import {getUsers} from "./redux/users/Actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import moment from 'moment/min/moment-with-locales';
import Moment from "react-moment"
import SideInfoSection from "./containers/SideInfoSection";



function App(props) {
    const apiControl = useSelector(state => state.apiControl);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const dispatch = useDispatch();

    if (props.logout) {
        dispatch(logoutUser());
        document.location.href = "/";
    }

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
    } else {
        return (
            <Login apiUrl={props.apiUrl}/>
        )
    }
}

export default App;
