import {
    getTaskActions,
    UPDATE_ACTIVE_TASK,
    UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR,
    UPDATE_ACTIVE_TASK_ASSIGNED_RIDER, UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER
} from "./ActiveTaskActions";
import {addAssigneeToList, removeAssigneeFromList} from "../tasks/task_redux_utilities";

const initialLocationState = {
    address: null,
    contact: {name: null, telephone_number: null},
    protected: false,
    listed: false
}

const initialState = {
    task: {
        uuid: null,
        reference: "",
        etag: "",
        author: null,
        author_uuid: null,
        pickup_location: initialLocationState,
        dropoff_location: initialLocationState,
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
        parent_id: 0,
        order_in_relay: 0,
        assigned_riders_display_string: "",
        assigned_coordinators_display_string: ""
    },
    error: null
}

export function task(state = initialState, action) {
    switch (action.type) {
        case getTaskActions.success:
            return {task: action.data, error: null};
        case UPDATE_ACTIVE_TASK:
            return {task: {...state.task, ...action.data.payload}, error: null}
        case UPDATE_ACTIVE_TASK_ASSIGNED_RIDER: {
            return { task: {
                ...state.task,
                ...addAssigneeToList(state.task,
                    action.data.payload.rider, "rider")
            }, error: null}
        }
        case UPDATE_ACTIVE_TASK_ASSIGNED_COORDINATOR: {
            return { task: {
                ...state.task,
                ...addAssigneeToList(state.task,
                    action.data.payload.user, "coordinator")
            }, error: null}
        }
        case UPDATE_ACTIVE_TASK_REMOVE_ASSIGNED_RIDER: {
            return { task: {
                    ...state.task,
                    ...removeAssigneeFromList(state.task,
                        action.data.payload.user_uuid, "rider")
                }, error: null}
        }
        default:
            return state;
    }
}
