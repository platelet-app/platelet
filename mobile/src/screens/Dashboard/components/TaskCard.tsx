import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import TaskCardLocationDetail from "./TaskCardLocationDetail";
import CommentsBadge from "./CommentsBadge";
import TaskCardTimestamp from "./TaskCardTimestamp";
import TaskCardChips from "./TaskCardChips";
import useTaskDeliverablesRedux from "../../../hooks/useTaskDeliverablesRedux";
import useCommentsRedux from "../../../hooks/useCommentsRedux";
import { Divider } from "react-native-paper";
import { ResolvedTask } from "../../../hooks/useMyAssignedTasks";

type TaskCardProps = {
    task: ResolvedTask;
    onPress?: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
    const deliverables = useTaskDeliverablesRedux(task.id);
    const comments = useCommentsRedux(task.id);

    let taskBadge = <></>;

    if (comments) {
        if (comments.length > 0) {
            taskBadge = <CommentsBadge count={comments.length} />;
        }
    }

    const cutOff = 3;

    return (
        <TouchableOpacity onPress={onPress}>
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
            <Divider style={{ width: "20%", margin: 1 }} />
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
        </TouchableOpacity>
    );
};

export default TaskCard;
