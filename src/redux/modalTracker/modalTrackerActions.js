export const APPEND_MODAL = "APPEND_MODAL";
export const REMOVE_MODAL = "REMOVE_MODAL";
export const CLEAR_MODALS = "CLEAR_MODALS";

export function appendModal(modalId) {
    console.log("appendModal", modalId);
    return {
        type: APPEND_MODAL,
        modalId,
    };
}

export function removeModal(modalId) {
    return {
        type: REMOVE_MODAL,
        modalId,
    };
}

export function clearModals() {
    return {
        type: CLEAR_MODALS,
    };
}
