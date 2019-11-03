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

function Modal() {
    let history = useHistory();
    let { task_id } = useParams();

    let back = e => {
        e.stopPropagation();
        history.goBack();
    };

    return (
        <div
            onClick={back}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: "rgba(0, 0, 0, 0.15)"
            }}
        >
            <div
                className="modal"
                style={{
                    position: "absolute",
                    background: "#fff",
                    top: 25,
                    left: "10%",
                    right: "10%",
                    padding: 15,
                    border: "2px solid #444"
                }}
            >
                YAAAAAAAAAAAAAAAAA {task_id}
                <button type="button" onClick={back}>
                    Close
                </button>
            </div>
        </div>
    );
}


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
                <Route path="/task/:task_id" children={<TaskDialog />} />
                {background && <Route path="/task/:task_id" children={<TaskDialog />} />}

            </Switch>
        </main>
    )
}
