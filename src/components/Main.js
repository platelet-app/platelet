import React from 'react';
import 'typeface-roboto'
import Home from '../containers/Home'
import '../index.css';
import SessionsList from '../containers/SessionList';
import MyUserProfile from '../containers/MyUserProfile'
import {BrowserRouter as Router, Route, Switch, useLocation, useHistory, useParams} from "react-router-dom";
import SessionDetail from "../containers/SessionDetail";
import UsersTasks from "../containers/UsersTasks";
import TaskModal from "./taskdialog/TaskModal";
import VehicleList from "../containers/VehiclesList";
import VehicleDetail from "../containers/VehicleDetail";
import {MainWindowContainer} from "../css/common";
import {clearLoading} from "../redux/Actions";
import {useDispatch} from "react-redux";
import App from "../App";
import UsersList from "../containers/UsersList";
import UserProfile from "./UserProfile";
import UserDetail from "../containers/UserDetail";

export default function Main(_props) {
    let location = useLocation();

    let background = location.state && location.state.background;
    return (
        <MainWindowContainer>
            <main>
                <Switch location={background || location}>
                    >
                    <Route exact path='/' component={Home}/>
                    <Route path='/sessions'
                           render={(props) => <SessionsList {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route path='/profile'
                           render={(props) => <MyUserProfile {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route path='/vehicles'
                           render={(props) => <VehicleList {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route path='/vehicle/:vehicle_uuid_b62'
                           render={(props) => <VehicleDetail {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route exact path='/mytasks'
                           render={(props) => <UsersTasks {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route exact path='/users'
                           render={(props) => <UsersList {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route exact path='/user/:user_uuid_b62'
                           render={(props) => <UserDetail {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route exact path='/session/:session_uuid_b62'
                           render={(props) => <SessionDetail {...props} apiControl={_props.apiControl}/>}
                    />
                    <Route exact path='/session/:session_uuid_b62/statistics'
                           render={(props) => <SessionDetail {...props} statsView={true} apiControl={_props.apiControl}/>}
                    />
                    <Route exact path="/session/:session_uuid_b62/task/:task_uuid_b62"
                           render={(props) => {
                               return (
                                   <>
                               <SessionDetail {...props} />
                               <TaskModal {...props} apiControl={_props.apiControl} modal={true}/>
                               </>
                           )
                           }}
                       />
                    <Route exact path="/mytasks/task/:task_uuid_b62"
                           render={(props) => {
                               return (
                                   <>
                                       <UsersTasks {...props} />
                                       <TaskModal {...props} apiControl={_props.apiControl} modal={true}/>
                                   </>
                               )
                           }}
                    />
                </Switch>
            </main>
        </MainWindowContainer>
    )
}
