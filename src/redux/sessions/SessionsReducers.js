import {
    ADD_SESSION_COLLABORATOR_SUCCESS,
    ADD_SESSION_SUCCESS, CLEAR_CURRENT_SESSION,
    DELETE_SESSION_REQUEST,
    DELETE_SESSION_SUCCESS,
    GET_SESSION_FAILURE,
    GET_SESSION_NOTFOUND, GET_SESSION_STATISTICS_FAILURE, GET_SESSION_STATISTICS_NOTFOUND,
    GET_SESSION_STATISTICS_SUCCESS,
    GET_SESSION_SUCCESS, GET_SESSIONS_FAILURE,
    GET_SESSIONS_SUCCESS, REFRESH_CURRENT_SESSION_REQUEST, REFRESH_CURRENT_SESSION_SUCCESS,
    RESTORE_SESSION_SUCCESS, SET_CURRENT_SESSION_TIME_ACTIVE_TO_NOW
} from "./SessionsActions";
import update from "immutability-helper";

const initialState = {
    sessions: [],
    error: null
}

export function sessions(state = initialState, action) {
    switch (action.type) {
        case ADD_SESSION_SUCCESS:
            return {
                sessions: [
                    {
                        ...action.data
                    },
                    ...state.sessions
                ], error: null
            };
        case GET_SESSIONS_SUCCESS:
            return {sessions: action.data, error: null};
        case GET_SESSIONS_FAILURE:
            return {...initialState, error: action.error};
        case RESTORE_SESSION_SUCCESS:
            return {sessions: [
                {
                    ...action.data
                },
                ...state.sessions
            ], error: null};
        case DELETE_SESSION_SUCCESS:
            let result_delete = state.sessions.filter(session => session.uuid === action.data);
            if (result_delete.length === 1) {
                const index = state.sessions.indexOf(result_delete[0]);
                return {sessions: update(state.sessions, {$splice: [[index, 1]]}), error: null};
            } else {
                return state;
            }
        default:
            return state
    }
}

const initialSessionState = {
    session: {
        uuid: null,
        last_active: new Date().toISOString(),
        is_owner: false,
        user_uuid: null,
        time_created: null,
        tasks: [],
        comments: [],
        links: {
            self: null,
            collection: null
        },
        collaborators: [],
        task_count: null,
        time_modified: null,
        tasks_etag: ""
    }, error: null
}

export function session(state = initialSessionState, action) {
    switch (action.type) {
        case GET_SESSION_SUCCESS:
            return {session: action.data, error: null};
        case GET_SESSION_FAILURE:
        case GET_SESSION_NOTFOUND:
            return {...initialSessionState, error: action.error};
        case ADD_SESSION_COLLABORATOR_SUCCESS:
            const collaboratorsList = state.session.collaborators
            collaboratorsList.push(action.data.payload.user)
            const finalSession = {...state.session, collaborators: collaboratorsList}
            return {
                session: finalSession,
                error: null
            }
        default:
            return state;
    }
}

export function currentSession(state = initialSessionState, action) {
    switch (action.type) {
        case ADD_SESSION_SUCCESS:
            return {session: action.data, error: null};
        case CLEAR_CURRENT_SESSION:
            return initialSessionState;
        case REFRESH_CURRENT_SESSION_SUCCESS:
            return {session: action.data, error: null};
        case SET_CURRENT_SESSION_TIME_ACTIVE_TO_NOW:
            const time_active = new Date().toISOString();
            return {session: Object.assign(state.session, {time_active}), error: null};
        default:
            return state;
    }
}

const initialStatisticsState = {
    statistics: {
        null_tasks: null,
        null_deleted: null,
        null_completed: null,
        null_picked_up: null,
        null_active: null,
        null_unassigned: null,
        null_rejected: null,
        null_cancelled: null,
        patches: null,
        riders: null,
        priorities: null,
        time_active: null
    },
    error: null

}

export function sessionStatistics(state = initialStatisticsState, action) {
    switch (action.type) {
        case GET_SESSION_STATISTICS_SUCCESS:
            return {statistics: action.data, error: null};
        case GET_SESSION_STATISTICS_FAILURE:
        case GET_SESSION_STATISTICS_NOTFOUND:
            return {statistics: initialStatisticsState, error: action.error};
        default:
            return state
    }
}
