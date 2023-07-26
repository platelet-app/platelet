import React from "react";
import * as models from "../../models";
import { StyleSheet, View } from "react-native";
import TasksGridTasksList from "./components/TasksGridTasksList";
import { useDispatch } from "react-redux";
import { initialiseApp } from "../../redux/initialise/initialiseActions";
import { DataStore } from "aws-amplify";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DashboardProps = {
    navigation: any;
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    const didInit = React.useRef(false);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const initialise = () => {
        if (!didInit.current) {
            dispatch(initialiseApp());
            didInit.current = true;
        }
    };
    React.useEffect(initialise, [dispatch]);

    const clearDataStore = async () => {
        await DataStore.clear();
    };
    return (
        <View
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left + 8,
                paddingRight: insets.right + 8,
            }}
        >
            <TasksGridTasksList
                navigation={navigation}
                status={[
                    models.TaskStatus.ACTIVE,
                    models.TaskStatus.PICKED_UP,
                    models.TaskStatus.DROPPED_OFF,
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Dashboard;
