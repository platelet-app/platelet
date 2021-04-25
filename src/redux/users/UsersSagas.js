import { call, put, takeLatest, select} from 'redux-saga/effects'
import {
    getUserSuccess,
    getUsersSuccess,
    updateUserSuccess,
    deleteUserSuccess,
    restoreUserSuccess,
    getUsersFailure,
    getUserFailure,
    updateUserFailure,
    deleteUserFailure,
    restoreUserFailure,
    clearForceResetPasswordStatus,
    restoreUserRequest,
    uploadUserProfilePictureSuccess,
    uploadUserProfilePictureFailure,
    getUserNotFound,
    getUsersActions,
    getUserActions,
    updateUserActions,
    updateUserPasswordActions,
    uploadUserProfilePictureActions,
    deleteUserActions,
    restoreUserActions,
    addUserActions,
    restoreUserNotFound,
} from "./UsersActions";
import {getApiControl} from "../Api"
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {convertListDataToObjects} from "../redux_utilities";

function* getUsers() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.getUsers]);
        const converted = yield call(convertListDataToObjects, result);
        yield put(getUsersSuccess(converted))
    } catch (error) {
        yield put(getUsersFailure(error))
    }
}

function* getUser(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.getUser], action.data.userUUID);
        yield put(getUserSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(getUserNotFound(error))
            }
        }
        yield put(getUserFailure(error))
    }
}

export function* watchGetUsers() {
    yield takeLatest(getUsersActions.request, getUsers)
}

export function* watchGetUser() {
    yield takeLatest(getUserActions.request, getUser)
}

function* updateUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.updateUser], action.data.userUUID, action.data.payload);
        yield put(updateUserSuccess(action.data))
    } catch (error) {
        yield put(updateUserFailure(error))
    }
}

export function* watchUpdateUser() {
    yield takeLatest(updateUserActions.request, updateUser)
}

function* updateUserPassword(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.updateUser], action.data.userUUID, action.data.payload);
        yield put(updateUserSuccess(action.data))
        yield put(clearForceResetPasswordStatus())
    } catch (error) {
        yield put(updateUserFailure(error))
    }
}

export function* watchUpdateUserPassword() {
    yield takeLatest(updateUserPasswordActions.request, updateUserPassword)
}

function* uploadUserProfilePicture(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.uploadProfilePicture], action.data.userUUID, action.data.payload);
        yield put(uploadUserProfilePictureSuccess(action.data))
    } catch (error) {
        yield put(uploadUserProfilePictureFailure(error))
    }
}

export function* watchUploadUserProfilePicture() {
    yield takeLatest(uploadUserProfilePictureActions.request, uploadUserProfilePicture)
}

function* deleteUser(action) {
    try {
        const restoreActions = yield () => [restoreUserRequest(action.data.userUUID)];
        const api = yield select(getApiControl);
        try {
            yield call([api, api.users.deleteUser], action.data.userUUID);
        } catch (error) {
            if (!error.status_code || error.status_code !== 404) {
                // if we have any error other than a 404, then put a failure, else carry on
                yield put(deleteUserFailure(error))
                return;
            }
        }
        yield put(deleteUserSuccess(action.data.userUUID));
        yield put(displayInfoNotification("User deleted", restoreActions));
    } catch (error) {
        yield put(deleteUserFailure(error))
    }
}

export function* watchDeleteUser() {
    yield takeLatest(deleteUserActions.request, deleteUser)
}

function* restoreUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.restoreUser], action.data.userUUID);
        const result = yield call([api, api.users.getUser], action.data.userUUID);
        yield put(restoreUserSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(restoreUserNotFound(error));
            }
        }
        yield put(restoreUserFailure(error))
    }
}

export function* watchRestoreUser() {
    yield takeLatest(restoreUserActions.request, restoreUser)
}

function* addUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.createUser], action.data.userUUID, action.data.payload);
        yield put(updateUserSuccess(action.data))
    } catch (error) {
        yield put(updateUserFailure(error))
    }
}

export function* watchAddUser() {
    yield takeLatest(addUserActions.request, addUser)
}

export const testable = {
    getUsers,
    getUser,
    addUser,
    restoreUser,
    deleteUser,
    updateUser,
    updateUserPassword,
    uploadUserProfilePicture
}
