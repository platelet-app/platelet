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
import { Provider } from "react-redux";
import { Logger } from "aws-amplify";
import { REACT_APP_OFFLINE_ONLY } from "@env";

if (REACT_APP_OFFLINE_ONLY !== "true") {
    Amplify.configure(config);
}

DataStore.configure({
    storageAdapter: ExpoSQLiteAdapter,
});

Logger.LOG_LEVEL = "ERROR";

const Stack = createNativeStackNavigator();

const Main = () => {
    return (
        <Provider store={store}>
            <PaperProvider theme={{ version: 2 }}>
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

const App = () => {
    if (REACT_APP_OFFLINE_ONLY === "true") {
        return <Main />;
    } else {
        return (
            <Authenticator.Provider>
                <Authenticator>
                    <Main />
                </Authenticator>
            </Authenticator.Provider>
        );
    }
};

export default App;
