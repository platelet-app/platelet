import React from "react";
import * as models from "../../models";
import { SafeAreaView, StyleSheet } from "react-native";
import TasksGridTasksList from "./components/TasksGridTasksList";
import { useDispatch } from "react-redux";
import { initialiseApp } from "../../redux/initialise/initialiseActions";

type DashboardProps = {
    navigation: any;
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
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
        <SafeAreaView style={styles.container}>
            <TasksGridTasksList
                navigation={navigation}
                status={[
                    models.TaskStatus.NEW,
                    models.TaskStatus.PICKED_UP,
                    models.TaskStatus.DROPPED_OFF,
                    models.TaskStatus.ACTIVE,
                ]}
            />
        </SafeAreaView>
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
