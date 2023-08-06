import * as React from "react";
import * as models from "../../models";
import { View } from "react-native";
import TasksGridTasksList from "./components/TasksGridTasksList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

type DashboardProps = {
    status: "inProgress" | "completed";
    tabIndex: number;
};

const Dashboard: React.FC<DashboardProps> = ({ status, tabIndex }) => {
    const colorScheme = useColorScheme();
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
                backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff",
                paddingLeft: insets.left + 8,
                paddingRight: insets.right + 8,
            }}
        >
            <TasksGridTasksList
                limit={status === "completed"}
                status={statuses}
                tabIndex={tabIndex}
            />
        </View>
    );
};

export default Dashboard;
