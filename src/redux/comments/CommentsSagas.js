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
    getSidebarCommentsSuccess, commentsNotFound, getCommentsFailure, getCommentsForbidden
} from "./CommentsActions"

import {getApiControl} from "../Api";
import {getVehicleFailure, vehicleNotFound} from "../vehicles/VehiclesActions";

export function* postNewComment(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.comments.createComment], action.data);
    const comment = {...action.data, "uuid": result.uuid};
    yield put(addCommentSuccess(comment))
}

export function* watchPostNewComment() {
    yield takeEvery(ADD_COMMENT_REQUEST, postNewComment)
}

export function* updateComment(action) {
    const api = yield select(getApiControl);
    yield call([api, api.comments.updateComment], action.data.commentUUID, action.data.payload);
    yield put(updateCommentSuccess(action.data))
}

export function* watchUpdateComment() {
    yield throttle(200, UPDATE_COMMENT_REQUEST, updateComment)
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
    const api = yield select(getApiControl);
    const result = yield call([api, api.comments.createComment], action.data);
    const comment = {...action.data, "uuid": result.uuid};
    yield put(addSidebarCommentSuccess(comment))
}

export function* watchPostNewSidebarComment() {
    yield takeEvery(ADD_SIDEBAR_COMMENT_REQUEST, postNewSidebarComment)
}

export function* updateSidebarComment(action) {
    const api = yield select(getApiControl);
    yield call([api, api.comments.updateComment], action.data.commentUUID, action.data.payload);
    yield put(updateSidebarCommentSuccess(action.data))
}

export function* watchUpdateSidebarComment() {
    yield throttle(200, UPDATE_SIDEBAR_COMMENT_REQUEST, updateSidebarComment)
}

export function* getSidebarComments(action) {
    const api = yield select(getApiControl);
    const result = yield call([api, api.comments.getComments], action.data);
    yield put(getSidebarCommentsSuccess(result))
}

export function* watchGetSidebarComments() {
    yield takeLatest(GET_SIDEBAR_COMMENTS_REQUEST, getSidebarComments)
}
