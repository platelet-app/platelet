import React from 'react';
import Main from './components/Main'
import Menu from './components/Menu'
import {ResponsiveDrawer} from './components/Menu'
import Login from './Login'
import './index.css'
import {deleteLogin, getLogin} from "./utilities";
import Control from "./ApiControl";
import './App.css';
import Grid from "@material-ui/core/Grid";
import SessionsList from './components/SessionList';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import {withRouter} from 'react-router-dom';


class App extends React.Component {
    componentDidMount() {
        if (this.props.logout) {
            deleteLogin();
            this.setState({"apiControl": new Control(this.props.apiUrl)})
            document.location.href = "/";

        } else {
            let savedBearer = getLogin();
            if (savedBearer) {
                let control = new Control(this.props.apiUrl, savedBearer);
                this.setState({"apiControl": control});
            }
        }
    }

    state = {
        "apiControl": new Control(this.props.apiUrl)
    };

    render() {
        if (this.state.apiControl.initialised) {
            return (
                <div className={'body'}>
                    <Switch>
                        <Route exact path='/logout'
                               render={(props) => <App {...props} logout={true} apiUrl={this.props.apiUrl}/>}
                        />
                    </Switch>

                    <React.Fragment>
                        <CssBaseline/>
                        <div className="App">
                            <ResponsiveDrawer apiControl={this.state.apiControl}/>
                        </div>
                    </React.Fragment>
                </div>
            );
        } else {
            return (
                <Login apiUrl={this.props.apiUrl}/>
            )
        }
    }
}

export default App;
