export const DISPLAY_INFO_NOTIFICATION = 'DISPLAY_INFO_NOTIFICATION';

export function displayInfoNotification(message, restoreActions, viewLink) {
    return { type: DISPLAY_INFO_NOTIFICATION, message, restoreActions, viewLink };
}
