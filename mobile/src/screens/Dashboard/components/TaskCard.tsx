import * as models from "../../../models";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import TaskCardLocationDetail from "./TaskCardLocationDetail";
import CommentsBadge from "./CommentsBadge";
import TaskCardTimestamp from "./TaskCardTimestamp";
import TaskCardChips from "./TaskCardChips";
import useTaskDeliverablesRedux from "../../../hooks/useTaskDeliverablesRedux";
import useCommentsRedux from "../../../hooks/useCommentsRedux";
//import UserAvatar from "./UserAvatar";
import { Divider, Card } from "react-native-paper";

const colourBarPercent = "90%";

type ResolvedTask = Omit<models.Task, "pickUpLocation" | "dropOffLocation"> & {
    pickUpLocation: models.Location;
    dropOffLocation: models.Location;
};

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
            <Divider style={{ width: "80%" }} />
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
