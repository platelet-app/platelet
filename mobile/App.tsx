import React from "react";
import "@azure/core-asynciterator-polyfill";
import { DataStore } from "aws-amplify";
import { ExpoSQLiteAdapter } from "@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter";
//import { StatusBar } from "expo-status-bar";
import { Authenticator } from "@aws-amplify/ui-react-native";
import { PaperProvider } from "react-native-paper";
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./src/screens/Dashboard/Dashboard";
import Task from "./src/screens/Task/Task";
import { store } from "./src/redux";
import { Provider, useDispatch } from "react-redux";
import { Logger } from "aws-amplify";
import { REACT_APP_OFFLINE_ONLY } from "@env";
import { enGB, registerTranslation } from "react-native-paper-dates";
import moment from "moment";
import localization from "moment/locale/en-gb";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { initialiseApp } from "./src/redux/initialise/initialiseActions";

declare global {
    namespace ReactNavigation {
        interface RootParamList {
            Home: undefined;
            Task: { taskId: string };
            NotFound: undefined;
        }
    }
}
const Tab = createMaterialBottomTabNavigator();

moment.updateLocale("en-GB", localization);
registerTranslation("en-GB", enGB);

if (REACT_APP_OFFLINE_ONLY !== "true") {
    Amplify.configure(config);
}

DataStore.configure({
    storageAdapter: ExpoSQLiteAdapter,
});

Logger.LOG_LEVEL = "ERROR";

const Stack = createNativeStackNavigator();

const InProgress = () => {
    return <Dashboard status="inProgress" />;
};

const Completed = () => {
    return <Dashboard status="completed" />;
};

function InProgressStack() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen
                name="Home"
                component={InProgress}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Task"
                component={Task}
                options={{ title: "Task" }}
            />
        </Stack.Navigator>
    );
}
function CompletedStack() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTitleStyle: { fontWeight: "bold" },
            }}
        >
            <Stack.Screen
                name="Home"
                component={Completed}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Task"
                component={Task}
                options={{ title: "Task" }}
            />
        </Stack.Navigator>
    );
}

const Main = () => {
    const didInit = React.useRef(false);
    const dispatch = useDispatch();

    const initialise = () => {
        if (!didInit.current) {
            dispatch(initialiseApp());
            didInit.current = true;
        }
    };
    React.useEffect(initialise, [dispatch]);
    return (
        <PaperProvider theme={{ version: 3 }}>
            <NavigationContainer>
                <Tab.Navigator initialRouteName="Feed">
                    <Tab.Screen
                        name="InProgressStack"
                        component={InProgressStack}
                        options={{
                            tabBarIcon: "compass-outline",
                            tabBarLabel: "In Progress",
                        }}
                    />
                    <Tab.Screen
                        name="CompletedStack"
                        component={CompletedStack}
                        options={{
                            tabBarIcon: "check-circle-outline",
                            tabBarLabel: "Completed",
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};

const App = () => {
    if (REACT_APP_OFFLINE_ONLY === "true") {
        return (
            <Provider store={store}>
                <Main />
            </Provider>
        );
    } else {
        return (
            <Provider store={store}>
                <Authenticator.Provider>
                    <Authenticator>
                        <Main />
                    </Authenticator>
                </Authenticator.Provider>
            </Provider>
        );
    }
};

export default App;
