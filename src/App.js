import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import SessionsList from './session_view';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_control: props.api_control,
            user_control: undefined,
            session_control: undefined,
            task_control: undefined,
            vehicle_control: undefined,
            note_control: undefined,
        }
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
                        <Button variant="contained" color="primary" onClick={async () => {
                            this.state.api_control.login(document.getElementById("user_field").value, document.getElementById("password_field").value)
                            if (this.state.api_control.initialised) {
                                this.state.user_control = this.state.api_control.users;
                                this.state.session_control = this.state.api_control.sessions;
                                this.state.task_control = this.state.api_control.tasks;
                                this.state.vehicle_control = this.state.api_control.vehicles;
                                this.state.note_control = this.state.api_control.notes;
                                alert("Login successful");
                            }
                            else {
                                alert("Login failed")
                            }
                            ReactDOM.render(<SessionsList />, document.getElementById('root'));
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
