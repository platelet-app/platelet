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
    UPDATE_TASK_SUCCESS, ADD_TASK_RELAY_REQUEST, ADD_TASK_RELAY_SUCCESS
} from "./TasksActions";
import update from "immutability-helper";
import {
    determineTaskType,
    findExistingTask,
    findExistingTaskParent,
    findExistingTaskParentByID,
    recursiveFindTaskChild
} from "../../utilities";

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
    const {taskType, taskGroup} = determineTaskType(data);
    let result = {};
    const newArray = [...tasks[taskType], taskGroup];
    newArray.sort(function (a, b) {
        var dateA = new Date(a[0].time_of_call), dateB = new Date(b[0].time_of_call);
        return dateB > dateA ? -1 : dateB < dateA ? 1 : 0;
    });
    result = taskType === "tasksNew" ? newArray.reverse() : newArray;
    return {taskType, result};
}

function recursiveTaskUpdate(task, previousTask, taskUUID, payload) {
    if (task.uuid === taskUUID) {
        return {...previousTask, relay_next: {...task, ...payload}}
    }
    else if (task.relay_next) {
        return {...previousTask, relay_next: recursiveTaskUpdate(task.relay_next, task, taskUUID, payload)}
    }
}

function groupRelaysTogether(tasks) {
    let groupedTasks = {};
    for(const [key, value] of Object.entries(tasks)) {
        groupedTasks[key] = [];
        let currentParentId = -1;
        let currentIndex = -1;
        for (const t of value) {
            if (currentParentId !== t.parent_id) {
                currentParentId = t.parent_id;
                currentIndex += 1;
                groupedTasks[key][currentIndex] = [];
            }
            groupedTasks[key][currentIndex].push(t);
        }
    }
    for(const [key, value] of Object.entries(groupedTasks)) {
        groupedTasks[key] = value.sort((a, b) => a.order_in_relay < b.order_in_relay);
    }
    return groupedTasks;
}

const addAssigneeToList = (task, rider) =>
{
    // add the assignee to the list
    let assigneesList = [...task.assigned_riders, rider]
    return {
        assigned_riders: assigneesList,
        assigned_riders_display_string: assigneesList.map(
            (user) => user.display_name
        ).join(", ")
    }
}

const removeAssigneeFromList = (task, userUUID) =>
{
    // remove the assignee from the list
    let assigneesList = task.assigned_riders.filter(u => u.uuid !== userUUID)
    return {
        assigned_riders: assigneesList,
        assigned_riders_display_string: assigneesList.map(
            (user) => user.display_name
        ).join(", ")
    }
}

export function tasks(state = initialTasksState, action) {
    switch (action.type) {
        case ADD_TASK_SUCCESS:
            const {taskType, result} = sortAndConcat(state.tasks, [action.data])
            const finalTasks = update(state.tasks, {[taskType]: {$set: result}});
            return {tasks: finalTasks, error: null}
        case RESTORE_TASK_SUCCESS:
            const {taskTypeRestore, resultRestore} = sortAndConcat(state.tasks, action.data)
            const finalTasksRestore = update(state.tasks, {[taskTypeRestore]: {$set: resultRestore}});
            return {tasks: finalTasksRestore, error: null}
        case ADD_TASK_RELAY_SUCCESS:
            const findParent = findExistingTaskParentByID(state.tasks, action.data.parent_id);
            const newGroup = [...findParent.taskGroup, action.data]
            const newTasks = update(state.tasks, {[findParent.listType]: {$set: state.tasks[findParent.listType].filter(t => action.data.parent_id !== t[0].parent_id)}});
            const sortedRelay = sortAndConcat(newTasks, newGroup)
            const finalTasksRelay = update(state.tasks, {[sortedRelay.taskType]: {$set: sortedRelay.result}});
            return {tasks: finalTasksRelay, error: null}
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
            const taskToUpdateParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            if (taskToUpdateParent.taskGroup) {
                const newTasks = update(
                    state.tasks, {[taskToUpdateParent.listType]: {$set: state.tasks[taskToUpdateParent.listType].filter(t => taskToUpdateParent.taskGroup[0].parent_id !== t[0].parent_id)}}
                    );
                let updatedItem;
                const taskToUpdate = taskToUpdateParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                const taskIndex = taskToUpdateParent.taskGroup.indexOf(taskToUpdate);
                updatedItem = {...taskToUpdate, ...action.data.payload};
                const updatedGroup = update(taskToUpdateParent.taskGroup, {[taskIndex]: {$set: updatedItem}})
                const {taskType, result} = sortAndConcat(newTasks, updatedGroup);
                const finalTasks = update(newTasks, {[taskType]: {$set: result}});
                return {tasks: finalTasks, error: null};
            } else {
                return state;
            }
        case UPDATE_TASK_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_ASSIGNED_RIDER_FROM_SOCKET:
            // Get the parent group first
            const taskToUpdateAssignedRiderParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            // remove it from the list
            const newTasksAssignedRider = update(
                state.tasks, {
                    [taskToUpdateAssignedRiderParent.listType]: {$set: state.tasks[taskToUpdateAssignedRiderParent.listType].filter(
                        t => taskToUpdateAssignedRiderParent.taskGroup[0].parent_id !== t[0].parent_id)
                    }}
            );

            if (taskToUpdateAssignedRiderParent.taskGroup) {
                const taskToUpdateAssignedRider = taskToUpdateAssignedRiderParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                const updatedItem = {
                    ...taskToUpdateAssignedRider,
                    ...addAssigneeToList(taskToUpdateAssignedRider,
                        action.data.payload.rider)
                }
                const taskIndex = taskToUpdateAssignedRiderParent.taskGroup.indexOf(taskToUpdateAssignedRider);
                const updatedGroup = update(taskToUpdateAssignedRiderParent.taskGroup, {[taskIndex]: {$set: updatedItem}})

                // sort the item and merge it
                const {taskType, result} = sortAndConcat(newTasksAssignedRider, updatedGroup)
                const finalTasksAssignedRider = update(newTasksAssignedRider, {[taskType]: {$set: result}});
                return {tasks: finalTasksAssignedRider, error: null}
            } else {
                return state;
            }
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_SUCCESS:
        case UPDATE_TASK_REMOVE_ASSIGNED_RIDER_FROM_SOCKET:
            // Get the parent group first
            const taskToUnassignParent = findExistingTaskParent(state.tasks, action.data.taskUUID);
            // remove it from the list
            const newTasksUnassignedRider = update(
                state.tasks, {
                    [taskToUnassignParent.listType]: {$set: state.tasks[taskToUnassignParent.listType].filter(
                            t => taskToUnassignParent.taskGroup[0].parent_id !== t[0].parent_id)
                    }}
            );

            if (taskToUnassignParent.taskGroup) {
                const taskToUpdateUnassignedRider = taskToUnassignParent.taskGroup.find(t => t.uuid === action.data.taskUUID);
                const updatedItem = {
                    ...taskToUpdateUnassignedRider,
                    ...removeAssigneeFromList(taskToUpdateUnassignedRider,
                        action.data.payload.user_uuid)
                }
                const taskIndex = taskToUnassignParent.taskGroup.indexOf(taskToUpdateUnassignedRider);
                const updatedGroup = update(taskToUnassignParent.taskGroup, {[taskIndex]: {$set: updatedItem}})

                // sort the item and merge it
                const {taskType, result} = sortAndConcat(newTasksUnassignedRider, updatedGroup)
                const finalTasksAssignedRider = update(newTasksUnassignedRider, {[taskType]: {$set: result}});
                return {tasks: finalTasksAssignedRider, error: null}
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
            return {tasks: groupRelaysTogether(action.data), error: null};
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
