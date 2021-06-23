import { call, put, takeLatest, select} from 'redux-saga/effects'
import * as userActions from "./UsersActions"
import {getApiControl} from "../Selectors"
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {convertListDataToObjects} from "../redux_utilities";

function* getUsers() {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.getUsers]);
        const converted = yield call(convertListDataToObjects, result);
        yield put(userActions.getUsersSuccess(converted))
    } catch (error) {
        yield put(userActions.getUsersFailure(error))
    }
}

function* getUser(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.users.getUser], action.data.userUUID);
        yield put(userActions.getUserSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(userActions.getUserNotFound(error))
            }
        }
        yield put(userActions.getUserFailure(error))
    }
}

export function* watchGetUsers() {
    yield takeLatest(userActions.getUsersActions.request, getUsers)
}

export function* watchGetUser() {
    yield takeLatest(userActions.getUserActions.request, getUser)
}

function* updateUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.updateUser], action.data.userUUID, action.data.payload);
        yield put(userActions.updateUserSuccess(action.data))
    } catch (error) {
        if (error.status_code && error.status_code === 404) {
            yield put(userActions.updateUserNotFound(error));
        }
        yield put(userActions.updateUserFailure(error));
    }
}

export function* watchUpdateUser() {
    yield takeLatest(userActions.updateUserActions.request, updateUser)
}

function* updateUserPassword(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.updateUser], action.data.userUUID, action.data.payload);
        yield put(userActions.updateUserPasswordSuccess(action.data));
        yield put(userActions.clearForceResetPasswordStatus());
    } catch (error) {
        if (error.status_code && error.status_code === 404) {
            yield put(userActions.updateUserPasswordNotFound(error));
        }
        yield put(userActions.updateUserPasswordFailure(error));
    }
}

export function* watchUpdateUserPassword() {
    yield takeLatest(userActions.updateUserPasswordActions.request, updateUserPassword)
}

function* uploadUserProfilePicture(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.uploadProfilePicture], action.data.userUUID, action.data.payload);
        yield put(userActions.uploadUserProfilePictureSuccess(action.data))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(userActions.uploadUserProfilePictureNotFound(error));
            }
        }
        yield put(userActions.uploadUserProfilePictureFailure(error))
    }
}

export function* watchUploadUserProfilePicture() {
    yield takeLatest(userActions.uploadUserProfilePictureActions.request, uploadUserProfilePicture)
}

function* deleteUser(action) {
    try {
        const restoreActions = yield () => [userActions.restoreUserRequest(action.data.userUUID)];
        const api = yield select(getApiControl);
        try {
            yield call([api, api.users.deleteUser], action.data.userUUID);
        } catch (error) {
            if (!error.status_code || error.status_code !== 404) {
                // if we have any error other than a 404, then put a failure, else carry on
                yield put(userActions.deleteUserFailure(error))
                return;
            }
        }
        yield put(userActions.deleteUserSuccess(action.data));
        yield put(displayInfoNotification("User deleted", restoreActions));
    } catch (error) {
        yield put(userActions.deleteUserFailure(error))
    }
}

export function* watchDeleteUser() {
    yield takeLatest(userActions.deleteUserActions.request, deleteUser)
}

function* restoreUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.restoreUser], action.data.userUUID);
        const result = yield call([api, api.users.getUser], action.data.userUUID);
        yield put(userActions.restoreUserSuccess(result))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(userActions.restoreUserNotFound(error));
            }
        }
        yield put(userActions.restoreUserFailure(error))
    }
}

export function* watchRestoreUser() {
    yield takeLatest(userActions.restoreUserActions.request, restoreUser)
}

function* addUser(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.users.createUser], action.data.payload);
        yield put(userActions.addUserSuccess(action.data))
    } catch (error) {
        yield put(userActions.addUserFailure(error))
    }
}

export function* watchAddUser() {
    yield takeLatest(userActions.addUserActions.request, addUser)
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
