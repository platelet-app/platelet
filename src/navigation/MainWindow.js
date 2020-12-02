import React from 'react';
import 'typeface-roboto'
import '../index.css';
import {Route, Switch, useLocation} from "react-router-dom";
import Dashboard from "../scenes/Dashboard/Dashboard";
import UsersTasks from "../scenes/Dashboard/UsersTasks";
import TaskDialog from "../scenes/Task/TaskDialog";
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

export default function MainWindow(_props) {
    let location = useLocation();

    return (
        <MainWindowContainer>
            <main>
                <Switch location={location}>
                    <Route exact path='/'
                           render={(props) => <Dashboard {...props}/>}
                    />
                    <Route path='/vehicles'
                           render={(props) => <VehicleList {...props}/>}
                    />
                    <Route exact path='/vehicle/:vehicle_uuid_b62'
                           render={(props) => <VehicleDetail {...props}/>}
                    />
                    <Route path='/locations'
                           render={(props) => <LocationsList {...props} />}
                    />
                    <Route exact path='/location/:location_uuid_b62'
                           render={(props) => <LocationDetail {...props}/>}
                    />
                    <Route exact path='/mytasks'
                           render={(props) => <UsersTasks {...props}/>}
                    />
                    <Route exact path='/users'
                           render={(props) => <UsersList {...props}/>}
                    />
                    <Route exact path='/admin'
                           render={(props) => <AdminControl {...props}/>}
                    />
                    <Route exact path='/user/:user_uuid_b62'
                           render={(props) => <UserDetail {...props}/>}
                    />
                    <Route exact path='/statistics'
                           render={(props) => <StatisticsDashboard {...props}/>}
                    />
                    <Route exact path="/task/:task_uuid_b62"
                           render={(props) => {
                               return (
                                   <>
                               <Dashboard {...props} />
                               <TaskDialog {...props} modal={true}/>
                               </>
                           )
                           }}
                       />
                    <Route exact path="/mytasks/task/:task_uuid_b62"
                           render={(props) => {
                               return (
                                   <>
                                       <UsersTasks {...props} />
                                       <TaskDialog {...props} modal={true}/>
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
