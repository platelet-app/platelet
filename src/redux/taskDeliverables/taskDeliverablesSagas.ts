import * as actions from "./taskDeliverablesActions";
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
                models.Deliverable,
                LocalPredicates.unarchived,
                { sort: (s) => s.createdAt("DESCENDING") }
            ).subscribe((result) => {
                console.log(result);
                emitter(result);
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
            // DataStore bug workaround for issue #9682 on github
            const fixed = yield call(
                dataStoreNestedWorkAroundMapper,
                result.items
            );
            yield put(
                actions.setTaskDeliverables({
                    ...result,
                    items: fixed,
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
