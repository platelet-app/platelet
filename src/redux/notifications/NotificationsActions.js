export const DISPLAY_INFO_NOTIFICATION = 'DISPLAY_INFO_NOTIFICATION';
export const DISPLAY_WARNING_NOTIFICATION = 'DISPLAY_WARNING_NOTIFICATION';
export const DISPLAY_ERROR_NOTIFICATION = 'DISPLAY_ERROR_NOTIFICATION';

export function displayInfoNotification(message, restoreActions, viewLink) {
    return { type: DISPLAY_INFO_NOTIFICATION, message, restoreActions, viewLink };
}

export function displayWarningNotification(message, restoreActions, viewLink) {
    return { type: DISPLAY_WARNING_NOTIFICATION, message, restoreActions, viewLink };
}

export function displayErrorNotification(message, restoreActions, viewLink) {
    return { type: DISPLAY_ERROR_NOTIFICATION, message, restoreActions, viewLink };
}
