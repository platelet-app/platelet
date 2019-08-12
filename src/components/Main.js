import React from 'react';
import 'typeface-roboto'
import Home from './Home'
import SessionsList from './SessionList';
import UserProfile from './UserProfile'
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import SessionDetail from "./SessionDetail";

class Main extends React.Component {
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/sessions'
                           render={(props) => <SessionsList {...props} api_control={this.props.api_control}/>}
                    />
                    <Route path='/profile'
                           render={(props) => <UserProfile {...props} api_control={this.props.api_control}/>}
                    />
                    <Route path='/session/:session_uuid'
                           render={(props) => <SessionDetail {...props} api_control={this.props.api_control}/>}
                    />
                </Switch>
            </main>
        )
    }
}

export default Main;
