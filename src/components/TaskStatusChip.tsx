import { alpha, Chip } from "@mui/material";
import { red, blue, yellow, orange, grey, green } from "@mui/material/colors";
import * as models from "../models";
import { TaskStatus } from "../API";

const colors = {
    NEW: yellow[700],
    ACTIVE: blue[700],
    PICKED_UP: orange[700],
    DROPPED_OFF: green[500],
    COMPLETED: green[700],
    CANCELLED: blue[700],
    ABANDONED: red[700],
    REJECTED: grey[700],
    PENDING: blue[200],
};

const generateLabel = (status: models.TaskStatus | TaskStatus) => {
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
    sx?: object;
};

const TaskStatusChip: React.FC<TaskStatusChipProps> = ({
    status = models.TaskStatus.NEW,
    size = "medium",
    sx = {},
}) => {
    if (status) {
        return (
            <Chip
                sx={{
                    ...sx,
                    backgroundColor: alpha(colors[status] || "#000", 0.2),
                }}
                size={size}
                label={generateLabel(status)}
            />
        );
    } else {
        return <></>;
    }
};

export default TaskStatusChip;
