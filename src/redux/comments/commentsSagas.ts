import * as actions from "./commentsActions";
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
                models.Comment,
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

        const userObserver = DataStore.observe(models.User).subscribe(
            (result) => {
                if (result.opType === "UPDATE") {
                    debouncedRestartObserver();
                }
            }
        );

        restartObserver();

        return () => {
            observer.unsubscribe();
            userObserver.unsubscribe();
        };
    });
}

function* initializeCommentsObserver(): Generator<any, any, any> {
    const channel = yield call(listener);
    try {
        while (true) {
            const result = yield take(channel);
            console.log(result.items);
            yield put(
                actions.setComments({
                    ...result,
                    ready: true,
                })
            );
        }
    } finally {
        console.log("stopping comments observer");
        channel.close();
    }
}

export function* watchInitializeCommentsObserver() {
    yield takeLatest(actions.INIT_COMMENTS, initializeCommentsObserver);
}
