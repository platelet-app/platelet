import React from 'react';
import 'typeface-roboto'
import Home from './Home'
import '../index.css';
import App from "../App";
import SessionsList from './SessionList';
import UserProfile from './UserProfile'
import {BrowserRouter as Router, Route, Switch, useLocation, useHistory, useParams} from "react-router-dom";
import SessionDetail from "./SessionDetail";
import TaskDetail from "./TaskDetail";
import Login from "../Login";
import UsersTasks from "./UsersTasks";
import TaskDialog from "./TaskModal";

export default function Main(_props) {
    let location = useLocation();

    let background = location.state && location.state.background;
    return (
        <main>
            <Switch location={background || location}>
                >
                <Route exact path='/' component={Home}/>
                <Route path='/sessions'
                       render={(props) => <SessionsList {...props} apiControl={_props.apiControl}/>}
                />
                <Route path='/profile'
                       render={(props) => <UserProfile {...props} apiControl={_props.apiControl}/>}
                />
                <Route path='/user/:user_uuid/tasks'
                       render={(props) => <UsersTasks {...props} apiControl={_props.apiControl}/>}
                />
                <Route path='/session/:session_uuid'
                       render={(props) => <SessionDetail {...props} apiControl={_props.apiControl}/>}
                />
                <Route path="/task/:task_id"
                       render={(props) => <TaskDialog {...props} modal={false} apiControl={_props.apiControl}/>}
                   />

            </Switch>
            {background && <Route path="/task/:task_id"
                                  render={(props) => <TaskDialog {...props}  modal={true} view={location.state.view} apiControl={_props.apiControl}/>}
            />}
        </main>
    )
}
