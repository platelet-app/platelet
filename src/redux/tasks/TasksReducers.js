import {
    ADD_TASK_SUCCESS,
    DELETE_TASK_SUCCESS,
    GET_MY_TASKS_SUCCESS,
    GET_TASK_SUCCESS,
    GET_TASKS_SUCCESS,
    RESTORE_TASK_SUCCESS,
    UPDATE_TASK_ASSIGNED_RIDER_SUCCESS,
    UPDATE_TASK_CANCELLED_TIME_SUCCESS,
    UPDATE_TASK_CONTACT_NAME_SUCCESS,
    UPDATE_TASK_CONTACT_NUMBER_SUCCESS,
    UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS, UPDATE_TASK_DROPOFF_TIME_SUCCESS,
    UPDATE_TASK_PICKUP_ADDRESS_SUCCESS,
    UPDATE_TASK_PICKUP_TIME_SUCCESS, UPDATE_TASK_PRIORITY_SUCCESS, UPDATE_TASK_REJECTED_TIME_SUCCESS,
    UPDATE_TASK_SUCCESS
} from "./TasksActions";
import update from "immutability-helper";

const initialState = {
    task: {
        uuid: null,
        pickup_address: null,
        dropoff_address: null,
        patch: null, patch_id: null,
        contact_name: null,
        contact_number: null,
        priority: null,
        session_uuid: null,
        time_of_call: null,
        deliverables: null,
        comments: null,
        links: null,
        assigned_rider: null,
        time_picked_up: null,
        time_dropped_off: null,
        rider: null,
        priority_id: null,
        time_cancelled: null,
        time_rejected: null,
        patient_name: null,
        patient_contact_number: null,
        destination_contact_number: null,
        destination_contact_name: null,
        time_created: null,
        time_modified: null
    },
    error: null
}

export function task(state = initialState, action) {
    switch (action.type) {
        case GET_TASK_SUCCESS:
            return {task: action.data, error: null};
        default:
            return state
    }
}

const initialTasksState = {
    tasks: [],
    error: null
}

export function tasks(state = initialTasksState, action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            return {
                tasks: [
                    ...state.tasks,
                    {
                        ...action.data
                    }
                ], error: null
            };
        case RESTORE_TASK_SUCCESS:
            //TODO: should this check that the task matches the session? it's unlikely a task will be deleted from anything other than it's own session view
            return {
                tasks: [
                    ...state,
                    {
                        ...action.data
                    }
                ], error: null
            };
        case UPDATE_TASK_SUCCESS:
        case UPDATE_TASK_CONTACT_NAME_SUCCESS:
        case UPDATE_TASK_CONTACT_NUMBER_SUCCESS:
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_CANCELLED_TIME_SUCCESS:
        case UPDATE_TASK_REJECTED_TIME_SUCCESS:
        case UPDATE_TASK_PRIORITY_SUCCESS:
        case UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_TIME_SUCCESS:
        case UPDATE_TASK_DROPOFF_TIME_SUCCESS:
            let result = state.tasks.filter(task => task.uuid === action.data.taskUUID);
            if (result.length === 1) {
                const updated_item = {...result[0], ...action.data.payload};
                const index = state.tasks.indexOf(result[0]);
                return {tasks: update(state.tasks, {[index]: {$set: updated_item}}), error: null};
            } else {
                return state;
            }
        case DELETE_TASK_SUCCESS:
            let result_delete = state.tasks.filter(task => task.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.tasks.indexOf(result_delete[0]);
                return {tasks: update(state, {$splice: [[index, 1]]}), error: null};
            } else {
                return state;
            }
        case GET_TASKS_SUCCESS:
            return {tasks: action.data, error: null};
        case GET_MY_TASKS_SUCCESS:
            return {tasks: action.data, error: null};
        default:
            return state
    }
}
