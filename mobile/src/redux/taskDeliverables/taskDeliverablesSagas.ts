import * as actions from "./taskDeliverablesActions";
import { takeLatest } from "@redux-saga/core/effects";
import _ from "lodash";
import { call, take, put } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { DataStore, Predicates } from "aws-amplify";
import * as models from "../../models";

function listener() {
    return eventChannel((emitter) => {
        let observer = { unsubscribe: () => {} };
        function restartObserver() {
            observer.unsubscribe();
            observer = DataStore.observeQuery(
                models.Deliverable,
                Predicates.ALL,
                { sort: (s) => s.createdAt("DESCENDING") }
            ).subscribe(async (result) => {
                const items = await Promise.all(
                    result.items.map(async (item) => {
                        const task = await item.task;
                        const scheduledTask = await item.scheduledTask;
                        const deliverableType = await item.deliverableType;
                        return {
                            ...item,
                            task,
                            scheduledTask,
                            deliverableType,
                        };
                    })
                );
                emitter({ ...result, items });
            });
        }

        const debouncedRestartObserver = _.debounce(restartObserver, 1000, {
            trailing: true,
        });

        const deliverableTypeObserver = DataStore.observe(
            models.DeliverableType
        ).subscribe((result) => {
            if (result.opType === "UPDATE") {
                debouncedRestartObserver();
            }
        });

        restartObserver();

        return () => {
            observer.unsubscribe();
            deliverableTypeObserver.unsubscribe();
        };
    });
}

function* initializeTaskDeliverablesObserver(): Generator<any, any, any> {
    const channel = yield call(listener);
    try {
        while (true) {
            const result = yield take(channel);
            yield put(
                actions.setTaskDeliverables({
                    ...result,
                    ready: true,
                })
            );
        }
    } finally {
        console.log("stopping task deliverables observer");
        channel.close();
    }
}

export function* watchInitializeTaskDeliverablesObserver() {
    yield takeLatest(
        actions.INIT_TASK_DELIVERABLES,
        initializeTaskDeliverablesObserver
    );
}
