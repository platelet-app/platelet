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
import { filterTasks } from "../../../utilities/filterTasks";
import { useSelector } from "react-redux";
import { dashboardFilterTermSelector } from "../../../redux/Selectors";
import GenericError from "../../Errors/GenericError";

type TasksGridTasksListProps = {
    status: models.TaskStatus[];
    limit?: boolean;
    tabIndex: number;
};

type SortedTasksType = {
    title: models.TaskStatus;
    data: ResolvedTask[];
};

const TasksGridTasksList = ({
    status,
    limit = false,
    tabIndex,
}: TasksGridTasksListProps) => {
    const { state, isFetching, error } = useMyAssignedTasks(
        status,
        models.Role.RIDER,
        limit
    );
    const navigation = useNavigation();
    const { colors } = useTheme();
    const dashboardFilter = useSelector(dashboardFilterTermSelector);

    const filteredTasksIds = React.useMemo(() => {
        if (!dashboardFilter) {
            return null;
        } else {
            return filterTasks(state, dashboardFilter);
        }
    }, [dashboardFilter, state]);

    const sorted: SortedTasksType[] = React.useMemo(
        () =>
            status.map((s) => {
                let tasks = state.filter((t) => t.status === s);
                if (filteredTasksIds) {
                    tasks = tasks.filter((t) =>
                        filteredTasksIds.includes(t.id)
                    );
                }

                let limitedTasks = tasks;
                if (limit) {
                    limitedTasks = tasks.slice(0, 50);
                }
                return {
                    title: s,
                    data: limitedTasks,
                };
            }),
        [state, status, limit, filteredTasksIds]
    );

    // for when doing checkbox select all
    /*const selectAllByStatus = (status: models.TaskStatus) => {
        const tasks = state.filter((t) => t.status === status);
        dispatch(selectMultipleItems(tasks, tabIndex));
    };

    const checkboxStatus = (status: models.TaskStatus) => {
        if (_.isEmpty(selectedItems)) {
            return "unchecked";
        }
        const tasks = state.filter((t) => t.status === status);

        const intersection = _.intersection(
            tasks.map((t) => t.id),
            // @ts-ignore
            Object.values(selectedItems).map((t: models.Task) => t.id)
        );
        if (intersection.length === 0) {
            return "unchecked";
        } else if (intersection.length === tasks.length) {
            return "checked";
        } else {
            return "indeterminate";
        }
        };*/

    if (error) {
        return <GenericError />;
    } else if (isFetching) {
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
    } else {
        return (
            <View style={{ gap: 8 }}>
                <SectionList
                    sections={sorted}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskCard
                            tabIndex={tabIndex}
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
                        <View
                            style={{
                                marginTop: 10,
                                backgroundColor:
                                    colors[title as keyof typeof colors],
                                padding: 2,
                                paddingLeft: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 16,
                                }}
                            >
                                {taskStatusHumanReadable(title)}
                            </Text>
                        </View>
                    )}
                />
            </View>
        );
    }
};

export default TasksGridTasksList;
