import React from 'react';
import Main from './components/Main'
import Menu from './components/Menu'
import Login from './Login'
import {deleteLogin, getLogin} from "./utilities";
import Control from "./ApiControl";
import './App.css';
import SessionsList from './components/SessionList';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends React.Component {
    componentDidMount() {
        if (this.props.logout) {
            deleteLogin();
            this.setState({"apiControl": new Control(this.props.apiUrl)})
        }
        else {
            let savedBearer = getLogin();
            if (savedBearer) {
                let control = new Control(this.props.apiUrl, savedBearer);
                this.setState({"apiControl": control});
            }
        }
    }
    state = {
        "apiControl" : new Control(this.props.apiUrl)
    };

    render() {
        if (this.state.apiControl.initialised) {
            return (
                <React.Fragment>
                    <CssBaseline/>
                    <div className="App">
                        <Menu></Menu>
                        <Main apiControl={this.state.apiControl}></Main>
                        <header className="App-header">
                            <meta
                                name="viewport"
                                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                            />
                        </header>
                    </div>
                </React.Fragment>
            );
        }
        else {
            return (
                <Login apiUrl={this.props.apiUrl}/>
            )
        }
    }
}

export default App;
