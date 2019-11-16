import React from 'react';
import {ResponsiveDrawer} from './containers/Menu'
import Login from './Login'
import './index.css'
import {deleteLogin, getLogin} from "./utilities";
import Control from "./ApiControl";
import './App.css';
import 'typeface-roboto'
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";


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
