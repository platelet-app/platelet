import {GET_TASK_SUCCESS, UPDATE_ACTIVE_TASK} from "../activeTask/ActiveTaskActions";

const initialLocationState = {
    address: null,
    contact: {name: null, telephone_number: null},
    protected: true,
    listed: true
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
        case GET_TASK_SUCCESS:
            return {task: action.data, error: null};
        case UPDATE_ACTIVE_TASK:
            return {task: {...state.task, ...action.data.payload}, error: null}
        default:
            return state;
    }
}
