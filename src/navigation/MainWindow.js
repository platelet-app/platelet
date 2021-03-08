import React from 'react';
import 'typeface-roboto'
import '../index.css';
import {Route, Switch, useLocation} from "react-router-dom";
import Dashboard from "../scenes/Dashboard/Dashboard";
import VehicleList from "../scenes/VehiclesList";
import {MainWindowContainer} from "../styles/common";
import UsersList from "../scenes/UsersList";
import UserDetail from "../scenes/UserProfile/UserDetail";
import VehicleDetail from "../scenes/VehicleDetail/VehicleDetail";
import {AdminControl} from "../scenes/AdminControl/AdminControl";
import NotFound from "../ErrorComponents/NotFound";
import LocationsList from "../scenes/LocationsList";
import LocationDetail from "../scenes/Location/LocationDetail";
import StatisticsDashboard from "../scenes/Statistics/StatisticsDashboard";
import TaskDialogCompact from "../scenes/Task/TaskDialogCompact";
import {useDispatch} from "react-redux";
import {setMenuIndex} from "../redux/Actions";

export default function MainWindow(_props) {
    let location = useLocation();
    const dispatch = useDispatch();

    // whenever returning an item, set the MenuIndex to update the mobile view drawer menu
    return (
        <MainWindowContainer>
            <main>
                <Switch location={location}>
                    <Route exact path='/dashboard'
                           render={(props) => {
                               dispatch(setMenuIndex("dashboard"));
                               return <Dashboard {...props}/>
                           }}
                    />
                    <Route path='/vehicles'
                           render={(props) => {
                               dispatch(setMenuIndex("vehicles"));
                               return <VehicleList {...props}/>
                           }}
                    />
                    <Route exact path='/vehicle/:vehicle_uuid_b62'
                           render={(props) => {
                               dispatch(setMenuIndex("vehicles"));
                               return <VehicleDetail {...props}/>
                           }}
                    />
                    <Route path='/locations'
                           render={(props) => {
                               dispatch(setMenuIndex("locations"));
                               return <LocationsList {...props} />
                           }}
                    />
                    <Route exact path='/location/:location_uuid_b62'
                           render={(props) => {
                               dispatch(setMenuIndex("locations"));
                               return <LocationDetail {...props}/>
                           }}
                    />
                    <Route exact path='/users'
                           render={(props) => {
                               dispatch(setMenuIndex("users"));
                               return <UsersList {...props}/>
                           }}
                    />
                    <Route exact path='/admin'
                           render={(props) => {
                               dispatch(setMenuIndex("admin"));
                               return <AdminControl {...props}/>
                           }}
                    />
                    <Route exact path='/user/:user_uuid_b62'
                           render={(props) => {
                               dispatch(setMenuIndex("users"));
                               return <UserDetail {...props}/>
                           }}
                    />
                    <Route exact path='/statistics'
                           render={(props) => {
                               dispatch(setMenuIndex("statistics"));
                               return <StatisticsDashboard {...props}/>
                           }}
                    />
                    <Route exact path="/task/:task_uuid_b62"
                           render={(props) => {
                               dispatch(setMenuIndex("dashboard"));
                               return (
                                   <>
                               <Dashboard {...props} />
                               <TaskDialogCompact {...props} modal={true}/>
                               </>
                           )
                           }}
                       />
                    <Route component={NotFound}/>
                </Switch>
            </main>
        </MainWindowContainer>
    )
}
