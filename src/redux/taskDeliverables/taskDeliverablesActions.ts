import * as models from "../../models";
export const INIT_TASK_DELIVERABLES = "INIT_TASK_DELIVERABLES";

export function initTaskDeliverables() {
    return {
        type: INIT_TASK_DELIVERABLES,
    };
}

export const SET_TASK_DELIVERABLES = "SET_TASK_DELIVERABLES";

export type TaskDeliverableActionType = {
    type: string;
    taskDeliverables: models.Deliverable[];
};

export function setTaskDeliverables(
    taskDeliverables: TaskDeliverableActionType
) {
    return {
        type: SET_TASK_DELIVERABLES,
        taskDeliverables,
    };
}
