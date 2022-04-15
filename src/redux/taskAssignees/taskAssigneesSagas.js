import * as actions from "./taskAssigneesActions";
import { takeLatest } from "@redux-saga/core/effects";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { DataStore } from "aws-amplify";
import * as models from "../../models";

function listener() {
    return eventChannel((emitter) => {
        const observer = DataStore.observe(models.TaskAssignee, () => {}, {
            sort: (s) => s.createdAt("desc"),
        }).subscribe((result) => {
            emitter(result);
        });

        return () => {
            observer.unsubscribe();
        };
    });
}

function* initializeTaskAssigneesObserver() {
    const result = yield DataStore.query(models.TaskAssignee, () => {}, {
        sort: (s) => s.createdAt("desc"),
    });
    yield put(actions.setTaskAssignees({ items: result, ready: true }));
    const channel = yield call(listener);
    try {
        while (true) {
            const { opType, element } = yield take(channel);
            if (opType === "INSERT") {
                const { taskId, assigneeId, ...rest } = element;
                const assignee = yield DataStore.query(models.User, assigneeId);
                const task = yield DataStore.query(models.Task, taskId);
                yield put(
                    actions.insertTaskAssignee({ ...rest, assignee, task })
                );
            } else if (opType === "DELETE") {
                yield put(actions.deleteTaskAssignee(element));
            }
        }
    } finally {
        channel.close();
        console.log("stop task assignees observer");
    }
}

export function* watchInitializeTaskAssigneesObserver() {
    yield takeLatest(
        actions.INIT_TASK_ASSIGNEES,
        initializeTaskAssigneesObserver
    );
}
