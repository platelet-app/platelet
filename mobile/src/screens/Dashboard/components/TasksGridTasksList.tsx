import React from "react";
import * as models from "../../../models";
import { FlatList, View } from "react-native";
import TaskCard from "./TaskCard";
import useMyAssignedTasks from "../../../hooks/useMyAssignedTasks";
import { Divider, Text } from "react-native-paper";
import taskStatusHumanReadable from "../../../utilities/taskStatusHumanReadable";

type TasksGridTasksListProps = {
    status: models.TaskStatus[];
    navigation: any;
};

type SortedTasksType = {
    [key in models.TaskStatus]?: models.Task[];
};

const TasksGridTasksList = ({
    status,
    navigation,
}: TasksGridTasksListProps) => {
    const { state } = useMyAssignedTasks(status, models.Role.RIDER);

    const sorted: SortedTasksType = React.useMemo(
        () =>
            status.reduce((acc, s) => {
                const tasks = state.filter((t) => t.status === s);
                return { ...acc, [s]: tasks };
            }, {}),
        [state, status]
    );

    return (
        <View style={{ gap: 8 }}>
            {Object.entries(sorted).map(([key, value]) => (
                <View key={key}>
                    <Text variant="titleMedium">
                        {taskStatusHumanReadable(key as models.TaskStatus)}
                    </Text>
                    <Divider />
                    <FlatList
                        data={value}
                        renderItem={({ item }) => (
                            <TaskCard
                                task={item}
                                onPress={() => {
                                    navigation.navigate("Task", {
                                        taskId: item.id,
                                    });
                                }}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            ))}
        </View>
    );
};

export default TasksGridTasksList;
