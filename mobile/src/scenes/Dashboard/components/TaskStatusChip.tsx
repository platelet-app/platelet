import { Chip } from "react-native-paper";
import * as models from "../../../models";
//import { TaskStatus } from "../API";

const generateLabel = (status: models.TaskStatus) => {
    switch (status) {
        case models.TaskStatus.DROPPED_OFF:
            return "DELIVERED";
        case models.TaskStatus.PICKED_UP:
            return "PICKED UP";
        default:
            return status;
    }
};

type TaskStatusChipProps = {
    status?: models.TaskStatus | null;
    size?: "small" | "medium";
    style?: object;
};

const TaskStatusChip: React.FC<TaskStatusChipProps> = ({
    status = models.TaskStatus.NEW,
    size = "medium",
    style = {},
}) => {
    if (status) {
        return <Chip style={style}>{generateLabel(status)}</Chip>;
    } else {
        return <></>;
    }
};

export default TaskStatusChip;
