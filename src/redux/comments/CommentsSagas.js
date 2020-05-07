import {throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    ADD_COMMENT_REQUEST,
    addCommentSuccess,
    UPDATE_COMMENT_REQUEST,
    updateCommentSuccess,
    GET_COMMENTS_REQUEST,
    getCommentsSuccess,
    UPDATE_SIDEBAR_COMMENT_REQUEST,
    updateSidebarCommentSuccess,
    ADD_SIDEBAR_COMMENT_REQUEST,
    addSidebarCommentSuccess,
    GET_SIDEBAR_COMMENTS_REQUEST,
    getSidebarCommentsSuccess,
    commentsNotFound,
    getCommentsFailure,
    getCommentsForbidden,
    addSidebarCommentFailure,
    updateSidebarCommentFailure,
    sidebarCommentsNotFound,
    getSidebarCommentsForbidden,
    getSidebarCommentsFailure,
    addCommentFailure,
    updateCommentFailure,
    deleteCommentSuccess,
    DELETE_COMMENT_REQUEST,
    deleteCommentFailure,
    restoreCommentSuccess,
    restoreCommentFailure,
    RESTORE_COMMENT_REQUEST,
    deleteSidebarCommentSuccess,
    deleteSidebarCommentFailure,
    restoreSidebarCommentSuccess,
    restoreSidebarCommentFailure,
    RESTORE_SIDEBAR_COMMENT_REQUEST, DELETE_SIDEBAR_COMMENT_REQUEST
} from "./CommentsActions"

import {getApiControl} from "../Api";
import {
    DELETE_SESSION_REQUEST,
    deleteSessionFailure,
    deleteSessionSuccess, RESTORE_SESSION_REQUEST,
    restoreSessionSuccess
} from "../sessions/SessionsActions";

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
    yield takeEvery(ADD_COMMENT_REQUEST, postNewComment)
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
    yield takeEvery(UPDATE_COMMENT_REQUEST, updateComment)
}

export function* getComments(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.comments.getComments], action.data);
        yield put(getCommentsSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(commentsNotFound())
            }
        } else if (error.response.status === 403) {
            yield put(getCommentsForbidden(error))
        } else {
            yield put(getCommentsFailure(error))

        }
    }
}

export function* watchGetComments() {
    yield takeLatest(GET_COMMENTS_REQUEST, getComments)
}

export function* postNewSidebarComment(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.comments.createComment], action.data);
        const comment = {...action.data, "uuid": result.uuid};
        yield put(addSidebarCommentSuccess(comment))
    } catch (error) {
        yield put(addSidebarCommentFailure(error))
    }
}

function* deleteComment(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.comments.deleteComment], action.data);
        yield put(deleteCommentSuccess(action.data))
    } catch (error) {
        yield put(deleteCommentFailure(error));
    }
}

export function* watchDeleteComment() {
    yield takeEvery(DELETE_COMMENT_REQUEST, deleteComment)
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
    yield takeEvery(RESTORE_COMMENT_REQUEST, restoreComment)
}

export function* watchPostNewSidebarComment() {
    yield takeEvery(ADD_SIDEBAR_COMMENT_REQUEST, postNewSidebarComment)
}

export function* updateSidebarComment(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.comments.updateComment], action.data.commentUUID, action.data.payload);
        yield put(updateSidebarCommentSuccess(action.data))
    } catch (error) {
        yield put(updateSidebarCommentFailure(error))
    }
}

export function* watchUpdateSidebarComment() {
    yield takeEvery(UPDATE_SIDEBAR_COMMENT_REQUEST, updateSidebarComment)
}

export function* getSidebarComments(action) {
    try {
        const api = yield select(getApiControl);
        const result = yield call([api, api.comments.getComments], action.data);
        yield put(getSidebarCommentsSuccess(result))
    } catch (error) {
        if (error.name === "HttpError") {
            if (error.response.status === 404) {
                yield put(sidebarCommentsNotFound())
            }
        } else if (error.response.status === 403) {
            yield put(getSidebarCommentsForbidden(error))
        } else {
            yield put(getSidebarCommentsFailure(error))

        }
    }
}

export function* watchGetSidebarComments() {
    yield takeLatest(GET_SIDEBAR_COMMENTS_REQUEST, getSidebarComments)
}
function* deleteSidebarComment(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.comments.deleteComment], action.data);
        yield put(deleteSidebarCommentSuccess(action.data))
    } catch (error) {
        yield put(deleteSidebarCommentFailure(error));
    }
}

export function* watchDeleteSidebarComment() {
    yield takeEvery(DELETE_SIDEBAR_COMMENT_REQUEST, deleteSidebarComment)
}

function* restoreSidebarComment(action) {
    try {
        const api = yield select(getApiControl);
        yield call([api, api.comments.restoreComment], action.data);
        const result = yield call([api, api.comments.getComment], action.data);
        yield put(restoreSidebarCommentSuccess(result))
    } catch (error) {
        yield put(restoreSidebarCommentFailure(error));
    }
}

export function* watchRestoreSidebarComment() {
    yield takeEvery(RESTORE_SIDEBAR_COMMENT_REQUEST, restoreSidebarComment)
}
