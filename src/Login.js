import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App'
import Control from './ApiControl'
import {Background} from './css/common'
import {BrowserRouter} from "react-router-dom";
import {saveLogin} from "./utilities";
import {withRouter} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {loginUser} from "./redux/Actions";


export default function Login(props) {

    const [apiControl, setApiControl] = useState(new Control(props.apiUrl));
    const [isLogged, setIsLogged] = useState(false);
    const dispatch = useDispatch();


    if (isLogged) {
        return (
            <App apiUrl={apiControl.api_url}/>
        )
    } else {

        return (
            <div>
                <header className="App-header">
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    <TextField color="primary" id="user_field">
                        Username
                    </TextField>
                    <TextField id="password_field" type="password">
                        Password
                    </TextField>
                    <Button variant="contained" color="primary" onClick={() => {
                        dispatch(loginUser({username: document.getElementById("user_field").value,
                            password: document.getElementById("password_field").value}));
                    }}>
                        Login
                    </Button>
                    <a
                        className="App-link"
                        href="https://github.com/theocranmore/bloodbike"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Github
                    </a>
                </header>
            </div>
        )
    }

}

