export const DISPLAY_INFO_NOTIFICATION = "DISPLAY_INFO_NOTIFICATION";
export const DISPLAY_WARNING_NOTIFICATION = "DISPLAY_WARNING_NOTIFICATION";
export const DISPLAY_ERROR_NOTIFICATION = "DISPLAY_ERROR_NOTIFICATION";

export function displayInfoNotification(message, restoreCallback, viewLink) {
    return {
        type: DISPLAY_INFO_NOTIFICATION,
        message,
        restoreCallback,
        viewLink,
    };
}

export function displayWarningNotification(message, restoreCallback, viewLink) {
    return {
        type: DISPLAY_WARNING_NOTIFICATION,
        message,
        restoreCallback,
        viewLink,
    };
}

export function displayErrorNotification(message, restoreCallback, viewLink) {
    return {
        type: DISPLAY_ERROR_NOTIFICATION,
        message,
        restoreCallback,
        viewLink,
    };
}
