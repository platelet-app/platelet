import {
    DISPLAY_ERROR_NOTIFICATION,
    DISPLAY_INFO_NOTIFICATION,
    DISPLAY_WARNING_NOTIFICATION,
} from "./NotificationsActions";

export function notification(state = null, action) {
    switch (action.type) {
        case DISPLAY_INFO_NOTIFICATION: {
            const { message, restoreCallback, viewLink } = action;
            const options = { variant: "info", autoHideDuration: 8000 };
            return { message, viewLink, restoreCallback, options };
        }
        case DISPLAY_WARNING_NOTIFICATION: {
            const { message, restoreCallback, viewLink } = action;
            const options = { variant: "warning", autoHideDuration: 8000 };
            return { message, viewLink, restoreCallback, options };
        }
        case DISPLAY_ERROR_NOTIFICATION: {
            const { message, restoreCallback, viewLink } = action;
            const options = { variant: "error", autoHideDuration: 8000 };
            return { message, viewLink, restoreCallback, options };
        }
        default:
            return state;
    }
}
