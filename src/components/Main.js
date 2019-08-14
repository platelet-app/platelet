import React from 'react';
import 'typeface-roboto'
import Home from './Home'
import App from "../App";
import SessionsList from './SessionList';
import UserProfile from './UserProfile'
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import SessionDetail from "./SessionDetail";
import Login from "../Login";

class Main extends React.Component {
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/sessions'
                           render={(props) => <SessionsList {...props} apiControl={this.props.apiControl}/>}
                    />
                    <Route path='/profile'
                           render={(props) => <UserProfile {...props} apiControl={this.props.apiControl}/>}
                    />
                    <Route path='/session/:session_uuid'
                           render={(props) => <SessionDetail {...props} apiControl={this.props.apiControl}/>}
                    />
                </Switch>
            </main>
        )
    }
}

export default Main;
