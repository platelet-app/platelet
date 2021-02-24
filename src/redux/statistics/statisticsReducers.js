import {getUserStatisticsActions} from "./statisticsActions";

const userStatisticsInitialState = {
    statistics: {
        num_tasks: 0,
        num_all_riders: 0,
        num_deleted: 0,
        num_completed: 0,
        num_picked_up: 0,
        num_active: 0,
        num_unassigned: 0,
        num_rejected: 0,
        num_cancelled: 0,
        patches: {},
        riders: {},
        priorities: {},
        time_active: 0
    },
    error: null
}

export function userStatistics(state = userStatisticsInitialState, action) {
    switch (action.type) {
        case getUserStatisticsActions.success:
            return {statistics: action.data, error: null}
        default:
            return state;
    }
}
