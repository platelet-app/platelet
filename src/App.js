import React, {useEffect, useState} from 'react';
import {ResponsiveDrawer} from './containers/Menu'
import Login from './Login'
import './index.css'
import connect from "react-redux";
import {deleteLogin, getLogin} from "./utilities";
import Control from "./ApiControl";
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getAvailableDeliverables,
    getAvailableLocations, getAvailablePatches,
    getAvailablePriorities,
    getUsers,
    getWhoami, logoutUser, setMobileView
} from "./redux/Actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";


function App(props) {
    const apiControl = useSelector(state => state.apiControl);
    const isInitialised = useSelector(state => state.apiControl.initialised);
    const dispatch = useDispatch();

    if (props.logout) {
        dispatch(logoutUser());
        document.location.href = "/";
    }

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
