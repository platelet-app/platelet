import * as React from "react";
import { StatusBar } from "expo-status-bar";
import "@azure/core-asynciterator-polyfill";
import { DataStore } from "aws-amplify";
import { ExpoSQLiteAdapter } from "@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter";
import { Authenticator } from "@aws-amplify/ui-react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import Dashboard from "./src/screens/Dashboard/Dashboard";
import Task from "./src/screens/Task/Task";
import { store } from "./src/redux";
import { Provider, useDispatch } from "react-redux";
import { Logger } from "aws-amplify";
import { REACT_APP_OFFLINE_ONLY } from "@env";
import { enGB, registerTranslation } from "react-native-paper-dates";
import moment from "moment";
import "moment/locale/en-gb";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { initialiseApp } from "./src/redux/initialise/initialiseActions";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DashboardHeader from "./src/screens/Dashboard/components/DashboardHeader";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

moment.locale("en-GB");
registerTranslation("en-GB", enGB);

if (REACT_APP_OFFLINE_ONLY !== "true") {
    Amplify.configure(config);
}

DataStore.configure({
    storageAdapter: ExpoSQLiteAdapter,
});

Logger.LOG_LEVEL = "ERROR";

const Stack = createNativeStackNavigator();

declare global {
    namespace ReactNativePaper {
        interface ThemeColors {
            shimmerForeground: string;
            shimmerBackground: string;
            NEW: string;
            ACTIVE: string;
            PICKED_UP: string;
            DROPPED_OFF: string;
            COMPLETED: string;
            CANCELLED: string;
            ABANDONED: string;
            REJECTED: string;
            PENDING: string;
        }
    }
}

const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        shimmerForeground: "#ecebeb",
        shimmerBackground: "#f3f3f3",
        NEW: "rgba(252, 231, 121, 1)",
        ACTIVE: "#8fb7ff",
        PICKED_UP: "#ffc252",
        DROPPED_OFF: "#15d615",
        COMPLETED: "#b8ffb8",
        CANCELLED: "#8f8fff",
        ABANDONED: "#ff8787",
        REJECTED: "#adadad",
        PENDING: "lightblue",
    },
};

const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        shimmerForeground: "#333",
        shimmerBackground: "#555",
        NEW: "rgba(252, 231, 121, 1)",
        ACTIVE: "#3e5d94",
        PICKED_UP: "#946000",
        DROPPED_OFF: "#004d00",
        COMPLETED: "#4d804d",
        CANCELLED: "#0000a8",
        ABANDONED: "#940000",
        REJECTED: "#4d4d4d",
        PENDING: "lightblue",
    },
};

const InProgress = () => {
    return <Dashboard tabIndex={0} status="inProgress" />;
};

const Completed = () => {
    return <Dashboard tabIndex={1} status="completed" />;
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
                options={{ header: () => <DashboardHeader tabIndex={0} /> }}
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
                options={{ header: () => <DashboardHeader tabIndex={1} /> }}
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
    const colorScheme = useColorScheme();

    const initialise = () => {
        if (!didInit.current) {
            dispatch(initialiseApp());
            didInit.current = true;
        }
    };
    React.useEffect(initialise, [dispatch]);
    return (
        <PaperProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
            <NavigationContainer
                theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <StatusBar translucent backgroundColor="transparent" />
                <Tab.Navigator initialRouteName="InProgressStack">
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
            <Authenticator.Provider>
                <Authenticator loginMechanisms={["email"]}>
                    <Provider store={store}>
                        <SafeAreaProvider>
                            <Main />
                        </SafeAreaProvider>
                    </Provider>
                </Authenticator>
            </Authenticator.Provider>
        );
    }
};

export default App;
