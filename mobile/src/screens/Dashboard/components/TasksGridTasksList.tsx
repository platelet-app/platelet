import * as models from "../../../models";
import * as React from "react";
import { ScrollView, SectionList, View } from "react-native";
import TaskCard from "./TaskCard";
import useMyAssignedTasks, {
    ResolvedTask,
} from "../../../hooks/useMyAssignedTasks";
import { Text, useTheme } from "react-native-paper";
import taskStatusHumanReadable from "../../../utilities/taskStatusHumanReadable";
import { useNavigation } from "@react-navigation/native";
import ContentLoader, { Rect } from "react-content-loader/native";
import _ from "lodash";

type TasksGridTasksListProps = {
    status: models.TaskStatus[];
    limit?: boolean;
};

type SortedTasksType = {
    title: models.TaskStatus;
    data: ResolvedTask[];
};

const TasksGridTasksList = ({
    status,
    limit = false,
}: TasksGridTasksListProps) => {
    const { state, isFetching, error } = useMyAssignedTasks(
        status,
        models.Role.RIDER,
        limit
    );
    const navigation = useNavigation();
    const { colors } = useTheme();

    const sorted: SortedTasksType[] = React.useMemo(
        () =>
            status.map((s) => {
                const tasks = state.filter((t) => t.status === s);
                let limitedTasks = tasks;
                if (limit) {
                    limitedTasks = tasks.slice(0, 50);
                }
                return {
                    title: s,
                    data: limitedTasks,
                };
            }),
        [state, status, limit]
    );

    if (isFetching) {
        let count = 0;
        return (
            <ScrollView>
                <ContentLoader
                    testID="task-grid-tasks-list-skeleton"
                    speed={2}
                    width="100%"
                    height={1650}
                    viewBox="0 0 400 1650"
                    backgroundColor={colors.shimmerBackground}
                    foregroundColor={colors.shimmerForeground}
                >
                    {_.range(0, 15).map((i) => {
                        if (i % 5 === 0) {
                            const offset = i !== 0 ? 50 : 0;
                            const result = (
                                <Rect
                                    key={`skeleton_${i}`}
                                    x="0"
                                    y={i * 100 + i * 20 - offset * count}
                                    rx="4"
                                    ry="4"
                                    width="100%"
                                    height="50"
                                />
                            );
                            count += 1;
                            return result;
                        } else {
                            const offset = i % 5 !== 0 ? 50 : 0;
                            return (
                                <Rect
                                    key={`skeleton_${i}`}
                                    x="0"
                                    y={i * 100 + i * 20 - offset * count}
                                    rx="4"
                                    ry="4"
                                    width="100%"
                                    height="100"
                                />
                            );
                        }
                    })}
                </ContentLoader>
            </ScrollView>
        );
    } else if (error) {
        return <Text>Sorry, something went wrong.</Text>;
    } else {
        return (
            <View style={{ gap: 8 }}>
                <SectionList
                    sections={sorted}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskCard
                            key={item.id}
                            task={item}
                            onPress={() => {
                                navigation.navigate("Task", {
                                    taskId: item.id,
                                });
                            }}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                marginTop: 10,
                            }}
                        >
                            {taskStatusHumanReadable(title)}
                        </Text>
                    )}
                />
            </View>
        );
    }
};

export default TasksGridTasksList;
