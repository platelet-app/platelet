export const DISPLAY_INFO_NOTIFICATION = 'DISPLAY_INFO_NOTIFICATION';

export function displayInfoNotification(message, restoreAction, viewLink) {
    return { type: DISPLAY_INFO_NOTIFICATION, message, restoreAction, viewLink };
}
