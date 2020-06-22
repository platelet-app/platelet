import React from 'react';
import 'typeface-roboto'
import Home from '../scenes/Home'
import '../index.css';
import SessionsList from '../scenes/SessionList';
import MyUserProfile from '../scenes/UserProfile/MyUserProfile'
import {Route, Switch, useLocation} from "react-router-dom";
import SessionDetail from "../scenes/SessionDetail/SessionDetail";
import UsersTasks from "../scenes/SessionDetail/UsersTasks";
import TaskDialog from "../scenes/Task/TaskDialog";
import VehicleList from "../scenes/VehiclesList";
import {MainWindowContainer} from "../styles/common";
import UsersList from "../scenes/UsersList";
import UserDetail from "../scenes/UserProfile/components/UserDetail";
import VehicleDetail from "../scenes/VehicleDetail/VehicleDetail";
import {AdminControl} from "../scenes/AdminControl/AdminControl";

export default function MainWindow(_props) {
    let location = useLocation();

    return (
        <MainWindowContainer>
            <main>
                <Switch location={location}>
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
                    <Route exact path='/admin'
                           render={(props) => <AdminControl {...props}/>}
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
                               <TaskDialog {...props} apiControl={_props.apiControl} modal={true}/>
                               </>
                           )
                           }}
                       />
                    <Route exact path="/mytasks/task/:task_uuid_b62"
                           render={(props) => {
                               return (
                                   <>
                                       <UsersTasks {...props} />
                                       <TaskDialog {...props} apiControl={_props.apiControl} modal={true}/>
                                   </>
                               )
                           }}
                    />
                </Switch>
            </main>
        </MainWindowContainer>
    )
}
