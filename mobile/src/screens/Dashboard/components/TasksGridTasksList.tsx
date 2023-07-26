import React from "react";
import * as models from "../../../models";
import { FlatList, ScrollView, View } from "react-native";
import TaskCard from "./TaskCard";
import useMyAssignedTasks from "../../../hooks/useMyAssignedTasks";
import { Divider, Text } from "react-native-paper";
import taskStatusHumanReadable from "../../../utilities/taskStatusHumanReadable";
import { useNavigation } from "@react-navigation/native";

type TasksGridTasksListProps = {
    status: models.TaskStatus[];
};

type SortedTasksType = {
    [key in models.TaskStatus]?: models.Task[];
};

const TasksGridTasksList = ({ status }: TasksGridTasksListProps) => {
    const { state } = useMyAssignedTasks(status, models.Role.RIDER);
    const navigation = useNavigation();

    const sorted: SortedTasksType = React.useMemo(
        () =>
            status.reduce((acc, s) => {
                const tasks = state.filter((t) => t.status === s);
                return { ...acc, [s]: tasks };
            }, {}),
        [state, status]
    );

    return (
        <ScrollView style={{ gap: 8 }}>
            {Object.entries(sorted).map(([key, value]) => (
                <View key={key}>
                    <Text variant="titleMedium">
                        {taskStatusHumanReadable(key as models.TaskStatus)}
                    </Text>
                    <Divider />
                    {value.map((item) => (
                        <TaskCard
                            key={item.id}
                            task={item}
                            onPress={() => {
                                navigation.navigate("Task", {
                                    taskId: item.id,
                                });
                            }}
                        />
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

export default TasksGridTasksList;
