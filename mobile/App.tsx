import "@azure/core-asynciterator-polyfill";
import { DataStore } from "aws-amplify";
import { ExpoSQLiteAdapter } from "@aws-amplify/datastore-storage-adapter/ExpoSQLiteAdapter";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, PaperProvider } from "react-native-paper";
import * as models from "./src/models";
import { Amplify } from "aws-amplify";
import config from "./src/aws-exports";
import useTaskObserveQueryByStatus from "./src/hooks/useTaskObserveQueryByStatus";
Amplify.configure(config);

DataStore.configure({
    storageAdapter: ExpoSQLiteAdapter,
});

const App = () => {
    const { state } = useTaskObserveQueryByStatus(models.TaskStatus.NEW);

    return (
        <View style={styles.container}>
            <Text>tasks</Text>
            {state.map((task) => (
                <Text key={task.id}>{task.id}</Text>
            ))}
        </View>
    );
};

const Main = () => {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
};

export default withAuthenticator(Main);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
