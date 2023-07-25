import * as models from "../models";

const taskStatusHumanReadable = (
    status: models.TaskStatus | null | undefined
) => {
    if (!status) {
        return "";
    }
    if (status === models.TaskStatus.DROPPED_OFF) return "DELIVERED";
    return status.replace(/_/g, " ");
};

export default taskStatusHumanReadable;
