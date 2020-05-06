import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {Provider} from 'react-redux'
import store from "./redux/Store"
import {SnackbarProvider} from "notistack";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import 'typeface-roboto'

window.store = store;


ReactDOM.render((
        <Provider store={store}>
            <BrowserRouter>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <ReactNotification/>
                    <SnackbarProvider maxSnack={1}>
                        <App/>
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </BrowserRouter>
        </Provider>),
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

