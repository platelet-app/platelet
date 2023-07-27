import React from "react";
import * as models from "../../models";
import { View } from "react-native";
import TasksGridTasksList from "./components/TasksGridTasksList";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DashboardProps = {
    status: "inProgress" | "completed";
};

const Dashboard: React.FC<DashboardProps> = ({ status }) => {
    const insets = useSafeAreaInsets();
    let statuses = [];
    if (status === "inProgress") {
        statuses = [
            models.TaskStatus.ACTIVE,
            models.TaskStatus.PICKED_UP,
            models.TaskStatus.DROPPED_OFF,
        ];
    } else {
        statuses = [
            models.TaskStatus.COMPLETED,
            models.TaskStatus.CANCELLED,
            models.TaskStatus.ABANDONED,
            models.TaskStatus.REJECTED,
        ];
    }
    return (
        <View
            style={{
                height: "100%",
                backgroundColor: "#fff",
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left + 8,
                paddingRight: insets.right + 8,
            }}
        >
            <TasksGridTasksList status={statuses} />
        </View>
    );
};

export default Dashboard;
