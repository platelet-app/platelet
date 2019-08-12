import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {BrowserRouter} from "react-router-dom";

class Login extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <div className="App">
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
                            this.props.api_control.login(document.getElementById("user_field").value, document.getElementById("password_field").value)
                                .then(()=> {
                                    ReactDOM.render((
                                        <BrowserRouter>
                                            <App api_control={this.props.api_control} />
                                        </BrowserRouter>),
                                        document.getElementById('root'));
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
            </React.Fragment>
        );
    }
}

export default Login;
