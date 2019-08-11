import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login'
import * as serviceWorker from './serviceWorker';
import Control from './api_control'
import {BrowserRouter} from 'react-router-dom'


const api_url = 'http://localhost:5000/api/v0.1/';
let control = new Control(api_url);
ReactDOM.render(
        <Login api_control={control}/>,
        document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
