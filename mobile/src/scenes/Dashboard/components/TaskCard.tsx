import * as models from "../../../models";
import React from "react";
import { TouchableOpacity } from "react-native";
import TaskCardLocationDetail from "./TaskCardLocationDetail";
import CommentsBadge from "./CommentsBadge";
import TaskCardTimestamp from "./TaskCardTimestamp";
import TaskCardChips from "./TaskCardChips";
import useTaskAssigneesRedux from "../../../hooks/useTaskAssigneesRedux";
import useTaskDeliverablesRedux from "../../../hooks/useTaskDeliverablesRedux";
import useCommentsRedux from "../../../hooks/useCommentsRedux";
//import UserAvatar from "./UserAvatar";
import { Divider, Card } from "react-native-paper";

const colourBarPercent = "90%";

type TaskCardProps = {
    task: models.Task;
    onPress?: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
    const assignees = useTaskAssigneesRedux(task.id, true);
    const deliverables = useTaskDeliverablesRedux(task.id);
    const comments = useCommentsRedux(task.id);
    const [pickUpLocation, setPickUpLocation] =
        React.useState<models.Location | null>(null);
    const [dropOffLocation, setDropOffLocation] =
        React.useState<models.Location | null>(null);

    let taskBadge = <></>;

    if (comments) {
        if (comments.length > 0) {
            taskBadge = <CommentsBadge count={comments.length} />;
        }
    }

    const cutOff = 4;

    const resolveLocation = React.useCallback(async () => {
        setPickUpLocation((await task.pickUpLocation) || null);
        setDropOffLocation((await task.dropOffLocation) || null);
    }, [task.pickUpLocation, task.dropOffLocation]);

    React.useEffect(() => {
        resolveLocation();
    }, [resolveLocation]);

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
                location={pickUpLocation}
            />
            <Divider />
            <TaskCardLocationDetail
                nullLocationText="No delivery address"
                location={dropOffLocation}
            />
            {(task?.createdAt || task?.timeOfCall) && (
                <TaskCardTimestamp
                    timestamp={task.createdAt || task.timeOfCall || ""}
                />
            )}
            {taskBadge}
        </TouchableOpacity>
    );
};

export default TaskCard;
