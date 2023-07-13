import React from "react";
import "@azure/core-asynciterator-polyfill";
import { DataStore } from "aws-amplify";
import { ExpoSQLiteAdapter } from "@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter";
//import { StatusBar } from "expo-status-bar";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { PaperProvider } from "react-native-paper";
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./src/scenes/Dashboard/Dashboard";
import Task from "./src/scenes/Dashboard/components/Task";
import { store } from "./src/redux";
import { Provider, useDispatch } from "react-redux";
import { initialiseApp } from "./src/redux/initialise/initialiseActions";

Amplify.configure(config);

DataStore.configure({
    storageAdapter: ExpoSQLiteAdapter,
});

const Stack = createNativeStackNavigator();

const Main = () => {
    return (
        <Provider store={store}>
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Dashboard">
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="Task" component={Task} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </Provider>
    );
};

export default withAuthenticator(Main);
