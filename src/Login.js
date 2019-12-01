import React from 'react';
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


class Login extends React.Component {
    state = {
        apiControl: new Control(this.props.apiUrl),
        isLogged: false
    };


    render() {
        if (this.state.isLogged) {
            return (
                <App apiUrl={this.state.apiControl.api_url}/>
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
                            this.state.apiControl.login(document.getElementById("user_field").value, document.getElementById("password_field").value)
                                .then(() => {
                                    saveLogin(this.state.apiControl.token);
                                    this.setState({"isLogged": true})
                                    document.location.href = "/";
                                });
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

}

export default Login;
