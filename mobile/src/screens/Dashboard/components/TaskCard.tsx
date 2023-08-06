import * as React from "react";
import { TouchableOpacity, Vibration, View } from "react-native";
import TaskCardLocationDetail from "./TaskCardLocationDetail";
import CommentsBadge from "./CommentsBadge";
import TaskCardTimestamp from "./TaskCardTimestamp";
import TaskCardChips from "./TaskCardChips";
import useTaskDeliverablesRedux from "../../../hooks/useTaskDeliverablesRedux";
import useCommentsRedux from "../../../hooks/useCommentsRedux";
import { Divider, IconButton, useTheme } from "react-native-paper";
import { ResolvedTask } from "../../../hooks/useMyAssignedTasks";
import { useDispatch, useSelector } from "react-redux";
import {
    selectItem,
    unselectItem,
} from "../../../redux/selectionMode/selectionModeActions";
import { selectedItemsSelector } from "../../../redux/Selectors";
import * as models from "../../../models";

type TaskCardProps = {
    task: ResolvedTask;
    onPress?: () => void;
    tabIndex: number;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, tabIndex }) => {
    const deliverables = useTaskDeliverablesRedux(task.id);
    const comments = useCommentsRedux(task.id);
    const dispatch = useDispatch();
    const selectedItems = useSelector(selectedItemsSelector);
    const [isSelected, setIsSelected] = React.useState(false);

    const calculateIsSelected = () => {
        const itemsTab: models.Task[] = selectedItems[tabIndex];
        let result = false;
        if (itemsTab) {
            result = Object.values(itemsTab)
                .map((t: models.Task) => t.id)
                .includes(task.id);
        }
        setIsSelected(result);
    };
    React.useEffect(calculateIsSelected, [selectedItems, task.id, tabIndex]);

    let taskBadge = <></>;

    if (comments) {
        if (comments.length > 0) {
            taskBadge = <CommentsBadge count={comments.length} />;
        }
    }

    const handleSelect = () => {
        if (isSelected) {
            dispatch(unselectItem(task.id, tabIndex));
        } else {
            dispatch(selectItem(task, tabIndex));
        }
        Vibration.vibrate(50);
    };

    const cutOff = 3;
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} onLongPress={handleSelect}>
            <TaskCardChips
                limit={cutOff}
                deliverables={deliverables}
                priority={task.priority}
                riderResponsibility={task.riderResponsibility}
            />
            <TaskCardLocationDetail
                nullLocationText="No pick up address"
                location={task.pickUpLocation}
            />
            <TaskCardLocationDetail
                nullLocationText="No delivery address"
                location={task.dropOffLocation}
            />
            <View style={{ height: 8 }} />
            <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
                {(task?.createdAt || task?.timeOfCall) && (
                    <TaskCardTimestamp
                        timestamp={task.createdAt || task.timeOfCall || ""}
                    />
                )}
                {taskBadge}
            </View>
            {isSelected && (
                <>
                    <View
                        style={{
                            backgroundColor: colors.primary,
                            borderRadius: 8,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0.5,
                        }}
                    />
                    <IconButton
                        icon="checkbox-marked"
                        style={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            backgroundColor: "black",
                        }}
                        onPress={() => {
                            dispatch(unselectItem(task.id, tabIndex));
                        }}
                    />
                </>
            )}
        </TouchableOpacity>
    );
};

export default TaskCard;
