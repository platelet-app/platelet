import * as models from "../../../models";
import { FlatList } from "react-native";
import TaskCard from "./TaskCard";
import useMyAssignedTasks from "../../../hooks/useMyAssignedTasks";

type TasksGridTasksListProps = {
    status: models.TaskStatus[];
    navigation: any;
};

const TasksGridTasksList = ({
    status,
    navigation,
}: TasksGridTasksListProps) => {
    const { state } = useMyAssignedTasks(status, models.Role.RIDER);

    return (
        <FlatList
            data={state}
            renderItem={({ item }) => (
                <TaskCard
                    task={item}
                    onPress={() => {
                        navigation.navigate("Task", { taskId: item.id });
                    }}
                />
            )}
            keyExtractor={(item) => item.id}
        />
    );
};

export default TasksGridTasksList;
