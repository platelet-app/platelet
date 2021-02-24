import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    addCommentActions,
    updateCommentActions,
    addCommentSuccess,
    updateCommentSuccess,
    getCommentsSuccess,
    getCommentsFailure,
    getCommentsForbidden,
    addCommentFailure,
    updateCommentFailure,
    deleteCommentSuccess,
    deleteCommentFailure,
    restoreCommentSuccess,
    restoreCommentFailure,
    restoreCommentRequest,
    getCommentsNotFound,
    getCommentsActions,
    deleteCommentActions,
    restoreCommentActions
} from "./CommentsActions"

import {getApiControl} from "../Api";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {convertListDataToObjects} from "../redux_utilities";

export function* postNewComment(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.comments.createComment], action.data);
        const comment = {...action.data, "uuid": result.uuid};
        yield put(addCommentSuccess(comment))
    } catch (error) {
        yield put(addCommentFailure(error))
    }
}

export function* watchPostNewComment() {
    yield takeEvery(addCommentActions.request, postNewComment)
}

export function* updateComment(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.comments.updateComment], action.data.commentUUID, action.data.payload);
        yield put(updateCommentSuccess(action.data))
    } catch (error) {
        yield put(updateCommentFailure(error))
    }
}

export function* watchUpdateComment() {
    yield takeEvery(updateCommentActions.request, updateComment)
}

export function* getComments(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.comments.getComments], action.data);
        const converted = yield convertListDataToObjects(result)
        yield put(getCommentsSuccess(converted))
    } catch (error) {
        if (error.status_code) {
            if (error.status_code === 404) {
                yield put(getCommentsNotFound())
            } else if (error.status_code === 403) {
                yield put(getCommentsForbidden(error))
            }
        }
        yield put(getCommentsFailure(error))

    }
}

export function* watchGetComments() {
    yield takeLatest(getCommentsActions.request, getComments)
}


function* deleteComment(action) {
    try {
        const restoreActions = () => [restoreCommentRequest(action.data)];
        const api = yield select(getApiControl);
        yield call([api, api.comments.deleteComment], action.data);
        yield put(deleteCommentSuccess(action.data))
        yield put(displayInfoNotification("Comment deleted", restoreActions))
    } catch (error) {
        yield put(deleteCommentFailure(error));
    }
}

export function* watchDeleteComment() {
    yield takeEvery(deleteCommentActions.request, deleteComment)
}

function* restoreComment(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.comments.restoreComment], action.data);
        const result = yield call([api, api.comments.getComment], action.data);
        yield put(restoreCommentSuccess(result))
    } catch (error) {
        yield put(restoreCommentFailure(error));
    }
}

export function* watchRestoreComment() {
    yield takeEvery(restoreCommentActions.request, restoreComment)
}
