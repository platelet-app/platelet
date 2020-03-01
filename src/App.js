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
    getAvailableLocations,
    getAvailablePriorities,
    getUsers,
    getWhoami, logoutUser
} from "./redux/Actions";


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
        }
    }

    useEffect(getStaticData, [isInitialised]);


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
