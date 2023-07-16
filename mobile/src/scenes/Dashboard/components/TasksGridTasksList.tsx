import * as models from "../../../models";
import { FlatList } from "react-native";
import TaskCard from "./TaskCard";
import useTaskObserveQueryByStatus from "../../../hooks/useTaskObserveQueryByStatus";

type TasksGridTasksListProps = {
    status: models.TaskStatus[];
    navigation: any;
};

const TasksGridTasksList = ({
    status,
    navigation,
}: TasksGridTasksListProps) => {
    const { state } = useTaskObserveQueryByStatus(status);

    return (
        <FlatList
            data={state}
            renderItem={({ item }) => (
                <TaskCard
                    task={item}
                    onPress={() => {
                        console.log("Pressed");
                        navigation.navigate("Task", { taskId: item.id });
                    }}
                />
            )}
            keyExtractor={(item) => item.id}
        />
    );
};

export default TasksGridTasksList;
