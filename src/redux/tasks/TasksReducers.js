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
    UPDATE_TASK_REQUESTER_CONTACT_SUCCESS,
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
import {determineTaskType, findExistingTask, findExistingTaskParent, recursiveFindTaskChild} from "../../utilities";

const initialState = {
    task: {
        uuid: null,
        author: null,
        author_uuid: null,
        pickup_address: null,
        dropoff_address: null,
        patch: null,
        patch_id: null,
        requester_contact: {
            name: null,
            telephone_number: null
        },
        priority: null,
        session_uuid: null,
        time_of_call: null,
        deliverables: null,
        comments: null,
        links: null,
        time_picked_up: null,
        time_dropped_off: null,
        rider: null,
        assigned_riders: [],
        assigned_coordinators: [],
        priority_id: null,
        time_cancelled: null,
        time_rejected: null,
        patient_name: null,
        patient_contact_number: null,
        destination_contact_number: null,
        destination_contact_name: null,
        time_created: null,
        time_modified: null,
        assigned_riders_display_string: "",
        assigned_coordinators_display_string: ""
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
        tasksActivePickedUp: [],
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

function recursiveTaskUpdate(task, previousTask, taskUUID, payload) {
    if (task.uuid === taskUUID) {
        return {...previousTask, relay_next: {...task, ...payload}}
    }
    else if (task.relay_next) {
        return {...previousTask, relay_next: recursiveTaskUpdate(task.relay_next, task, taskUUID, payload)}
    }
}

export function tasks(state = initialTasksState, action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            const resultAdd = sortAndConcat(state.tasks, action.data)
            return {tasks: Object.assign({}, state.tasks, resultAdd), error: null}
        case RESTORE_TASK_SUCCESS:
            const resultRestore = sortAndConcat(state.tasks, action.data)
            return {tasks: Object.assign({}, state.tasks, resultRestore), error: null}
        case UPDATE_TASK_SUCCESS:
        case UPDATE_TASK_REQUESTER_CONTACT_SUCCESS:
        case UPDATE_TASK_CANCELLED_TIME_SUCCESS:
        case UPDATE_TASK_REJECTED_TIME_SUCCESS:
        case UPDATE_TASK_PRIORITY_SUCCESS:
        case UPDATE_TASK_PATCH_SUCCESS:
        case UPDATE_TASK_DROPOFF_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_ADDRESS_SUCCESS:
        case UPDATE_TASK_PICKUP_TIME_SUCCESS:
        case UPDATE_TASK_DROPOFF_TIME_SUCCESS:
        case UPDATE_TASK_FROM_SOCKET:
            const taskToUpdate = findExistingTaskParent(state.tasks, action.data.taskUUID);
            const newTasks = update(
                state.tasks, {[taskToUpdate.listType]: {$set: state.tasks[taskToUpdate.listType].filter(t => t.uuid !== taskToUpdate.task.uuid)}}
                );
            if (taskToUpdate.task) {
                let updatedItem;
                if (taskToUpdate.task.uuid === action.data.taskUUID) {
                    updatedItem = {...taskToUpdate.task, ...action.data.payload}
                } else if (taskToUpdate.task.relay_next) {
                    updatedItem = recursiveTaskUpdate(taskToUpdate.task.relay_next, taskToUpdate.task, action.data.taskUUID, action.data.payload)
                }
                const resultAdd = sortAndConcat(newTasks, updatedItem)
                const finalTasks = update(newTasks, {$merge: resultAdd});
                return {tasks: finalTasks, error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET:
            // Get the parent first
            const taskToUpdateAssignedRiderParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            // remove it from the list
            const newTasksAssignedRider = update(state.tasks,
                {[taskToUpdateAssignedRiderParent.listType]: {$set: state.tasks[taskToUpdateAssignedRiderParent.listType].filter(t => t.uuid !== taskToUpdateAssignedRiderParent.task.uuid)}}
                );
            const updateList = (task, rider) =>
            {
                // add the assignee to the list
                let assigneesList = task.assigned_riders
                assigneesList.push(rider)
                return {
                    assigned_riders: assigneesList,
                    assigned_riders_display_string: task.assigned_riders.map(
                        (user) => user.display_name
                    ).join(", ")
                }
            }
            let updatedItem;
            if (taskToUpdateAssignedRiderParent.task) {
                // see if the parent is the task we are looking for
                if (taskToUpdateAssignedRiderParent.task.uuid === action.data.taskUUID) {
                    updatedItem = {
                        ...taskToUpdateAssignedRiderParent.task,
                        ...updateList(taskToUpdateAssignedRiderParent.task,
                            action.data.payload.rider)}

                } else if (taskToUpdateAssignedRiderParent.task.relay_next) {
                    // if it isn't the parent, find the relay child
                    const taskToUpdateAssignedRider = recursiveFindTaskChild(taskToUpdateAssignedRiderParent.task, action.data.taskUUID);
                    // get the list
                    const result = updateList(taskToUpdateAssignedRider, action.data.payload.rider)
                    // make use of the recursive task update function to push new assignees list
                    updatedItem = recursiveTaskUpdate(
                        taskToUpdateAssignedRiderParent.task.relay_next,
                        taskToUpdateAssignedRiderParent.task,
                        action.data.taskUUID, result)
                }
                // sort the item and merge it
                const resultAdd = sortAndConcat(newTasksAssignedRider, updatedItem)
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
                const filteredAssigneeList = taskUnassign.task.assigned_riders.filter((u) => u.uuid !== action.data.payload.user_uuid);
                const finalTask = {...taskUnassign.task, assigned_riders: filteredAssigneeList, assigned_riders_display_string: filteredAssigneeList.map((user) => user.display_name).join(", ")}
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
            return {tasks: action.data, error: null};
        case GET_TASKS_FAILURE:
            return {...initialTasksState, error: action.error};
        case GET_MY_TASKS_SUCCESS:
            return {tasks: action.data, error: null};
        case GET_MY_TASKS_FAILURE:
            return {...initialTasksState, error: action.error};
        default:
            return state
    }
}
