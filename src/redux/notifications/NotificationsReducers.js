import {DISPLAY_INFO_NOTIFICATION} from "./NotificationsActions";

export function infoNotifications(state = null, action) {
    switch (action.type) {
        case DISPLAY_INFO_NOTIFICATION:
            const {message, restoreAction} = action;
            const options = {variant: "info", autoHideDuration: 8000};
            return { message, restoreAction, options };
        default:
            return state;
    }
}
