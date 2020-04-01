import {
    ADD_TASK_SUCCESS,
    DELETE_TASK_SUCCESS, GET_MY_TASKS_SUCCESS,
    GET_TASK_SUCCESS, GET_TASKS_SUCCESS,
    RESTORE_TASK_SUCCESS,
    UPDATE_TASK_SUCCESS
} from "./Actions";
import update from "immutability-helper";

export function task(state = {}, action) {
    switch (action.type) {
        case GET_TASK_SUCCESS:
            return action.data;
        default:
            return state
    }
}

export function tasks(state = [], action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case RESTORE_TASK_SUCCESS:
            //TODO: should this check that the task matches the session? it's unlikely a task will be deleted from anything other than it's own session view
            return [
                ...state,
                {
                    ...action.data
                }
            ];
        case UPDATE_TASK_SUCCESS:
            let result = state.filter(task => task.uuid === action.data.taskUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.indexOf(result[0]);
                return update(state, {[index]: {$set: updated_item}});
            } else {
                return state;
            }

        case DELETE_TASK_SUCCESS:
            let result_delete = state.filter(task => task.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.indexOf(result_delete[0]);
                return update(state, { $splice: [[index, 1]] });
            } else {
                return state;
            }

        case GET_TASKS_SUCCESS:
            return action.data;

        case GET_MY_TASKS_SUCCESS:
            return action.data;

        default:
            return state
    }
}
