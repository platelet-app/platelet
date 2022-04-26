import * as actions from "./taskAssigneesActions";
import { takeLatest } from "@redux-saga/core/effects";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import dataStoreNestedWorkAroundMapper from "./dataStoreNestedWorkAroundMapper";

function listener() {
    return eventChannel((emitter) => {
        let observer = DataStore.observeQuery(models.TaskAssignee, () => {}, {
            sort: (s) => s.createdAt("desc"),
        }).subscribe((result) => {
            emitter(result);
        });

        const userObserver = DataStore.observe(models.User).subscribe(
            (result) => {
                if (result.opType === "UPDATE") {
                    observer.unsubscribe();
                    observer = DataStore.observeQuery(
                        models.TaskAssignee,
                        () => {},
                        {
                            sort: (s) => s.createdAt("desc"),
                        }
                    ).subscribe((result) => {
                        emitter(result);
                    });
                }
            }
        );

        return () => {
            observer.unsubscribe();
            userObserver.unsubscribe();
        };
    });
}

function* initializeTaskAssigneesObserver() {
    const channel = yield call(listener);
    try {
        while (true) {
            const result = yield take(channel);
            // DataStore bug workaround for issue #9682 on github
            const fixed = yield call(
                dataStoreNestedWorkAroundMapper,
                result.items
            );
            yield put(
                actions.setTaskAssignees({
                    ...result,
                    items: fixed,
                    ready: true,
                })
            );
        }
    } finally {
        console.log("stopping task assignees observer");
        channel.close();
    }
}

export function* watchInitializeTaskAssigneesObserver() {
    yield takeLatest(
        actions.INIT_TASK_ASSIGNEES,
        initializeTaskAssigneesObserver
    );
}
