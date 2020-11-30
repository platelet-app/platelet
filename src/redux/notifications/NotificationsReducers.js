import {DISPLAY_INFO_NOTIFICATION} from "./NotificationsActions";

export function infoNotifications(state = null, action) {
    switch (action.type) {
        case DISPLAY_INFO_NOTIFICATION:
            const {message, restoreActions, viewLink} = action;
            const options = {variant: "info", autoHideDuration: 8000};
            return { message, viewLink, restoreActions, options };
        default:
            return state;
    }
}
