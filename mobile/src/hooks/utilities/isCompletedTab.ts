import _ from "lodash";
import * as models from "../../models";

export const isCompletedTab = (keys: models.TaskStatus[]) =>
    _.intersection(
        [
            models.TaskStatus.COMPLETED,
            models.TaskStatus.CANCELLED,
            models.TaskStatus.REJECTED,
            models.TaskStatus.ABANDONED,
        ],
        keys
    ).length > 0;
