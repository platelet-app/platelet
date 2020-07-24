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
    SET_CURRENT_TASK, UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET,
    UPDATE_TASK_ASSIGNED_RIDER_SUCCESS,
    UPDATE_TASK_CANCELLED_TIME_SUCCESS,
    UPDATE_TASK_CONTACT_NAME_SUCCESS,
    UPDATE_TASK_CONTACT_NUMBER_SUCCESS,
    UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS,
    UPDATE_TASK_DROPOFF_TIME_SUCCESS, UPDATE_TASK_FROM_SOCKET,
    UPDATE_TASK_PATCH_SUCCESS,
    UPDATE_TASK_PICKUP_ADDRESS_SUCCESS,
    UPDATE_TASK_PICKUP_TIME_SUCCESS,
    UPDATE_TASK_PRIORITY_SUCCESS,
    UPDATE_TASK_REJECTED_TIME_SUCCESS, UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET,
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
            return {tasks: Object.assign({}, state.tasks, resultAdd), error: null}
        case RESTORE_TASK_SUCCESS:
            //TODO: should this check that the task matches the session? it's unlikely a task will be deleted from anything other than it's own session view
            const resultRestore = sortAndConcat(state.tasks, action.data)
            return {tasks: Object.assign({}, state.tasks, resultRestore), error: null}
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
        case UPDATE_TASK_FROM_SOCKET:
            let taskToUpdate = findExistingTask(state.tasks, action.data.taskUUID);
            const newTasks = update(
                state.tasks, {[taskToUpdate.listType]: {$set: state.tasks[taskToUpdate.listType].filter(t => t.uuid !== taskToUpdate.task.uuid)}}
                );
            if (taskToUpdate) {
                const updatedItem = {...taskToUpdate.task, ...action.data.payload};
                const resultAdd = sortAndConcat(newTasks, updatedItem)
                const finalTasks = update(newTasks, {$merge: resultAdd});
                return {tasks: finalTasks, error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET:
            const taskToUpdateAssignedRider = findExistingTask(state.tasks, action.data.taskUUID);
            const newTasksAssignedRider = update(state.tasks,
                {[taskToUpdateAssignedRider.listType]: {$set: state.tasks[taskToUpdateAssignedRider.listType].filter(t => t.uuid !== taskToUpdateAssignedRider.task.uuid)}}
                );
            if (taskToUpdateAssignedRider.task) {
                let assigneesList = taskToUpdateAssignedRider.task.assigned_users
                assigneesList.push(action.data.payload.rider)
                const finalTask = {...taskToUpdateAssignedRider.task, assigned_users: assigneesList, assigned_users_display_string: taskToUpdateAssignedRider.task.assigned_users.map((user) => user.display_name).join(", ")}
                const resultAdd = sortAndConcat(newTasksAssignedRider, finalTask)
                const finalTasksAssignedRider = update(newTasksAssignedRider, {$merge: resultAdd});
                return {tasks: finalTasksAssignedRider, error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET:
            const taskUnassign = findExistingTask(state.tasks, action.data.taskUUID);
            const newTasksAssignedRiderRemove = update(state.tasks,
                {[taskUnassign.listType]: {$set: state.tasks[taskUnassign.listType].filter(t => t.uuid !== taskUnassign.task.uuid)}}
            );
            if (taskUnassign) {
                const filteredAssigneeList = taskUnassign.task.assigned_users.filter((u) => u.uuid !== action.data.payload.user_uuid);
                const finalTask = {...taskUnassign.task, assigned_users: filteredAssigneeList, assigned_users_display_string: filteredAssigneeList.map((user) => user.display_name).join(", ")}
                const resultAdd = sortAndConcat(newTasksAssignedRiderRemove, finalTask)
                const finalTasksAssignedRiderRemove = update(newTasksAssignedRiderRemove, {$merge: resultAdd});
                return {tasks: finalTasksAssignedRiderRemove, error: null}
            } else {
                return state;
            }
        case DELETE_TASK_SUCCESS:
            const findDelete = findExistingTask(state.tasks, action.data)
            if (findDelete) {
                const newTasks = update(state.tasks, {[findDelete.listType]: {$set: state.tasks[findDelete.listType].filter(t => t.uuid !== findDelete.task.uuid)}})
                return {tasks: Object.assign({}, state.tasks, newTasks), error: null};
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
