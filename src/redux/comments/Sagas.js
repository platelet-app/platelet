import { throttle, call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import {
    ADD_COMMENT_REQUEST,
    addCommentSuccess,
    UPDATE_COMMENT_REQUEST,
    updateCommentSuccess,
    GET_COMMENTS_REQUEST,
    getCommentsSuccess
} from "./Actions"

import { getApiControl } from "../Api";

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
    const api = yield select(getApiControl);
    const result = yield call([api, api.comments.getComments], action.data);
    yield put(getCommentsSuccess(result))
}

export function* watchGetComments() {
    yield takeLatest(GET_COMMENTS_REQUEST, getComments)
}
