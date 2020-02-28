import React, {useEffect, useState} from 'react';
import {ResponsiveDrawer} from './containers/Menu'
import Login from './Login'
import './index.css'
import {deleteLogin, getLogin} from "./utilities";
import Control from "./ApiControl";
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
    getAvailableDeliverables,
    getAvailableLocations,
    getAvailablePriorities,
    getUsers,
    getWhoami
} from "./redux/Actions";


function App(props) {
    const [apiControl, setApiControl] = useState(new Control((props.apiUrl)));
    const dispatch = useDispatch();

    function componentDidMount() {
        if (props.logout) {
            deleteLogin();
            setApiControl(new Control(props.apiUrl));
            document.location.href = "/";

        } else {
            let savedBearer = getLogin();
            if (savedBearer) {
                let control = new Control(props.apiUrl, savedBearer);
                setApiControl(control);
                dispatch(getAvailablePriorities());
                dispatch(getAvailableDeliverables());
                dispatch(getAvailableLocations());
                dispatch(getUsers());
                dispatch(getWhoami());
            }
        }
    }
    useEffect(componentDidMount, [])


    if (apiControl.initialised) {
        return (
            <div className={'body'}>
                <Switch>
                    <Route exact path='/logout'
                           render={(props) => <App {...props} logout={true} apiUrl={props.apiUrl}/>}
                    />
                </Switch>

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
