import React from "react";
import * as models from "../../models";
import useTaskObserveQueryByStatus from "../../hooks/useTaskObserveQueryByStatus";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import TaskCard from "./components/TaskCard";
import { useDispatch } from "react-redux";
import { initialiseApp } from "../../redux/initialise/initialiseActions";

type DashboardProps = {
    navigation: any;
};

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    const { state } = useTaskObserveQueryByStatus(models.TaskStatus.NEW);
    const didInit = React.useRef(false);
    const dispatch = useDispatch();

    function initialise() {
        if (!didInit.current) {
            dispatch(initialiseApp());
            didInit.current = true;
        }
    }
    React.useEffect(initialise, [dispatch]);
    return (
        <SafeAreaView>
            <FlatList
                data={state}
                renderItem={({ item }) => (
                    <TaskCard
                        task={item}
                        onPress={() =>
                            navigation.navigate("Task", { taskId: item.id })
                        }
                    />
                )}
                keyExtractor={(item) => item.id}
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
