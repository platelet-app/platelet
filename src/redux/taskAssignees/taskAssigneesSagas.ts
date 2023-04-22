import * as actions from "./taskAssigneesActions";
import { takeLatest } from "@redux-saga/core/effects";
import _ from "lodash";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import dataStoreNestedWorkAroundMapper from "./dataStoreNestedWorkAroundMapper";
import LocalPredicates from "../../utilities/predicates";

function listener() {
    return eventChannel((emitter) => {
        let observer = { unsubscribe: () => {} };
        function restartObserver() {
            observer.unsubscribe();
            observer = DataStore.observeQuery(
                models.TaskAssignee,
                LocalPredicates.unarchived,
                { sort: (s) => s.createdAt("DESCENDING") }
            ).subscribe((result) => {
                emitter(result);
            });
        }

        const debouncedRestartObserver = _.debounce(restartObserver, 1000, {
            trailing: true,
        });

        const userObserver = DataStore.observe(models.User).subscribe(
            (result) => {
                if (result.opType === "UPDATE") {
                    debouncedRestartObserver();
                }
            }
        );
        const taskObserver = DataStore.observe(
            models.Task,
            LocalPredicates.unarchived
        ).subscribe((result) => {
            if (result.opType === "UPDATE") {
                debouncedRestartObserver();
            }
        });

        restartObserver();

        return () => {
            observer.unsubscribe();
            userObserver.unsubscribe();
            taskObserver.unsubscribe();
        };
    });
}

function* initializeTaskAssigneesObserver(): Generator<any, any, any> {
    const channel = yield call(listener);
    try {
        while (true) {
            const result = yield take(channel);
            // DataStore bug workaround for issue #9682 on github
            const fixed = yield call(
                dataStoreNestedWorkAroundMapper,
                result.items
            );
            console.log(fixed);
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
