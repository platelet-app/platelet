import {
    ADD_TASK_SUCCESS,
    CLEAR_CURRENT_TASK,
    DELETE_TASK_SUCCESS,
    GET_MY_TASKS_FAILURE,
    GET_MY_TASKS_SUCCESS,
    GET_TASK_SUCCESS,
    GET_TASKS_FAILURE,
    GET_TASKS_SUCCESS,
    RESTORE_TASK_SUCCESS,
    SET_CURRENT_TASK,
    UPDATE_TASK_ASSIGNED_RIDER_SUCCESS,
    UPDATE_TASK_CANCELLED_TIME_SUCCESS,
    UPDATE_TASK_CONTACT_NAME_SUCCESS,
    UPDATE_TASK_CONTACT_NUMBER_SUCCESS,
    UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS,
    UPDATE_TASK_DROPOFF_TIME_SUCCESS,
    UPDATE_TASK_PATCH_SUCCESS,
    UPDATE_TASK_PICKUP_ADDRESS_SUCCESS,
    UPDATE_TASK_PICKUP_TIME_SUCCESS,
    UPDATE_TASK_PRIORITY_SUCCESS,
    UPDATE_TASK_REJECTED_TIME_SUCCESS,
    UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS,
    UPDATE_TASK_SUCCESS
} from "./TasksActions";
import update from "immutability-helper";
import {determineTaskType, findExistingTask, orderTaskList, spliceExistingTask} from "../../utilities";

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
        assigned_users: [],
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
            return state;
    }
}

export function currentTask(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_TASK:
            return {task: action.data, error: null};
        case CLEAR_CURRENT_TASK:
            return initialState;
        default:
            return state;
    }
}

const initialTasksState = {
    tasks: {
        tasksNew: [],
        tasksActive: [],
        tasksPickedUp: [],
        tasksDelivered: []
    },
    error: null
}

function sortAndConcat(tasks, data) {
    const taskInList = determineTaskType(data);
    let result = {};
    for (const [key, value] of Object.entries(taskInList)) {
        const newArray = [...tasks[key], ...value];
        newArray.sort(function (a, b) {
            var dateA = new Date(a.time_of_call), dateB = new Date(b.time_of_call);
            return dateB > dateA ? -1 : dateB < dateA ? 1 : 0;
        });
        result[key] = key === "tasksNew" ? newArray.reverse() : newArray;
    }
    return result;
}

export function tasks(state = initialTasksState, action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            const resultAdd = sortAndConcat(state.tasks, action.data)
            return {tasks: Object.assign(state.tasks, resultAdd), error: null}
        case RESTORE_TASK_SUCCESS:
            //TODO: should this check that the task matches the session? it's unlikely a task will be deleted from anything other than it's own session view
            const resultRestore = sortAndConcat(state.tasks, action.data)
            return {tasks: Object.assign(state.tasks, resultRestore), error: null}
        case UPDATE_TASK_SUCCESS:
        case UPDATE_TASK_CONTACT_NAME_SUCCESS:
        case UPDATE_TASK_CONTACT_NUMBER_SUCCESS:
        case UPDATE_TASK_CANCELLED_TIME_SUCCESS:
        case UPDATE_TASK_REJECTED_TIME_SUCCESS:
        case UPDATE_TASK_PRIORITY_SUCCESS:
        case UPDATE_TASK_PATCH_SUCCESS:
        case UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_TIME_SUCCESS:
        case UPDATE_TASK_DROPOFF_TIME_SUCCESS:
            let taskToUpdate = spliceExistingTask(state.tasks, action.data.taskUUID);
            if (taskToUpdate) {
                const updatedItem = {...taskToUpdate.task, ...action.data.payload};
                const resultAdd = sortAndConcat(state.tasks, updatedItem)
                return {tasks: Object.assign(state.tasks, resultAdd), error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
            const {task} = spliceExistingTask(state.tasks, action.data.taskUUID);
            if (task) {
                let assigneesList = task.assigned_users
                assigneesList.push(action.data.payload.rider)
                const finalTask = {...task, assigned_users: assigneesList, assigned_users_display_string: task.assigned_users.map((user) => user.display_name).join(", ")}
                const resultAdd = sortAndConcat(state.tasks, finalTask)
                return {tasks: Object.assign(state.tasks, resultAdd), error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS:
            const taskUnassign = spliceExistingTask(state.tasks, action.data.taskUUID).task;
            if (taskUnassign) {
                const filteredAssigneeList = taskUnassign.assigned_users.filter((u) => u.uuid !== action.data.payload.user_uuid);
                const finalTask = {...taskUnassign, assigned_users: filteredAssigneeList, assigned_users_display_string: filteredAssigneeList.map((user) => user.display_name).join(", ")}
                const resultAdd = sortAndConcat(state.tasks, finalTask)
                return {tasks: Object.assign(state.tasks, resultAdd), error: null}
            } else {
                return state;
            }
        case DELETE_TASK_SUCCESS:
            const findDelete = findExistingTask(state.tasks, action.data)
            let resultDelete = {};
            if (findDelete) {
                resultDelete[findDelete.listType] = update(state.tasks[findDelete.listType], {$splice: [[findDelete.index, 1]]})
                return {tasks: Object.assign(state.tasks, resultDelete), error: null};
            } else {
                return state;
            }
        case GET_TASKS_SUCCESS:
            return {tasks: orderTaskList(action.data), error: null};
        case GET_TASKS_FAILURE:
            return {...initialTasksState, error: action.error};
        case GET_MY_TASKS_SUCCESS:
            return {tasks: orderTaskList(action.data), error: null};
        case GET_MY_TASKS_FAILURE:
            return {...initialTasksState, error: action.error};
        default:
            return state
    }
}
