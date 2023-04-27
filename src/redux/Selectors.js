export const getApiControl = (state) => state.apiControl;
export const getTasksSelector = (state) => state.tasks.tasks;
export const getTasksRejectedSelector = (state) =>
    state.tasks.tasks["tasksRejected"];
export const getTasksCancelledSelector = (state) =>
    state.tasks.tasks["tasksCancelled"];
export const getTasksInitialisedStatus = (state) => state.tasks.fetched;
export const getWhoami = (state) => state.whoami.user;
export const tenantIdSelector = (state) => state.tenantId;
export const getRoleView = (state) => state.roleView;
export const getUsersSelector = (state) => state.users.users;
export const getActiveTaskSelector = (state) => state.task.task;
export const getPresetLocations = (state) => state.availableLocations.locations;
export const availableDeliverablesSelector = (state) =>
    state.availableDeliverables.deliverables;
export const deliverablesSelector = (state) => state.deliverables.deliverables;
export const networkStatusSelector = (state) =>
    state.awsHubDataStoreEventsReducer.network;
export const dataStoreReadyStatusSelector = (state) =>
    state.awsHubDataStoreEventsReducer.ready;
export const onChangeTaskSelector = (state) => state.onChangeTask;
export const dashboardTabIndexSelector = (state) => state.dashboardTabIndex;
export const menuIndexSelector = (state) => state.menuIndex;
export const guidedSetupOpenSelector = (state) => state.guidedSetupOpen;
export const dashboardFilterTermSelector = (state) => state.dashboardFilter;
export const dashboardFilteredUserSelector = (state) =>
    state.dashboardFilteredUser;
export const taskAssigneesSelector = (state) => state.taskAssigneesReducer;
export const taskAssigneesReadyStatusSelector = (state) =>
    state.taskAssigneesReducer.ready;
export const taskDeliverablesSelector = (state) =>
    state.taskDeliverablesReducer;
export const taskDeliverablesReadyStatusSelector = (state) =>
    state.taskDeliverablesReducer.ready;
export const commentsSelector = (state) => state.commentsReducer;
export const commentsReadyStatusSelector = (state) =>
    state.commentsReducer.ready;
export const dataStoreModelSyncedStatusSelector = (state) =>
    state.awsHubDataStoreModelsSyncedStatusReducer;
export const selectedItemsSelector = (state) => state.selectionModeReducer;
export const availableSelectionItemsSelector = (state) =>
    state.selectionModeAvailableItemsReducer;
export const selectionActionsPendingSelector = (state) =>
    state.selectionActionsPendingReducer;
export const modalTrackerSelector = (state) => state.modalTrackerReducer;
export const notificationsSelector = (state) => state.notification;
