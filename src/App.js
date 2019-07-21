import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'typeface-roboto'
import Control from './api_control'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.api_url);
        this.state = {api_control: new Control(props.api_url)}
    }

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
                        <TextField id="password_field">
                            Password
                        </TextField>
                        <Button variant="contained" color="primary" onClick={() => {
                            this.state.api_control.login(document.getElementById("user_field").value, document.getElementById("password_field").value)

                            console.log("aaaa")
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

export default App;
