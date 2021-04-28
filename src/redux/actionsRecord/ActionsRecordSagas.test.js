import {testable} from "./ActionsRecordSagas"
import {call, put, select} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {sortByCreatedTime} from "../../utilities";
import * as actionRecordActions from "./ActionsRecordActions";
import sagaTestingErrors from "../testing/errorConsts";

const {notFoundError, forbiddenError, plainError} = sagaTestingErrors;

describe("get actions records saga for an object", () => {
    it("watches for a get actions records dispatch", () => {
        const gen = testable.watchGetActionsRecord();
        gen.next();
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get actions record request", () => {
        const data = {uuid: "someUUID"}
        const result = [];
        const sorted = [];
        const action = {type: actionRecordActions.getActionsRecordActions.request, data }
        const gen = testable.getActionsRecord(action)
        const api = {log: {getRecords: jest.fn(() => [])}};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(call([api, api.log.getRecords], action.data.uuid, "newest"));
        expect(gen.next(result).value).toEqual(call(sortByCreatedTime, result));
        expect(gen.next(sorted).value).toEqual(put(actionRecordActions.getActionsRecordSuccess(sorted)));
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get actions record not found error", () => {
        const data = {uuid: "someUUID"}
        const action = {type: actionRecordActions.getActionsRecordActions.request, data }
        const gen = testable.getActionsRecord(action)
        gen.next();
        expect(gen.throw(notFoundError).value).toEqual(
            put(actionRecordActions.getActionsRecordNotFound(notFoundError))
        );
        expect(gen.next().value).toEqual(
            put(actionRecordActions.getActionsRecordFailure(notFoundError))
        )
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get actions record forbidden error", () => {
        const data = {uuid: "someUUID"};
        const action = {type: actionRecordActions.getActionsRecordActions.request, data };
        const gen = testable.getActionsRecord(action);
        gen.next();
        expect(gen.throw(forbiddenError).value).toEqual(
            put(actionRecordActions.getActionsRecordForbidden(forbiddenError))
        );
        expect(gen.next().value).toEqual(
            put(actionRecordActions.getActionsRecordFailure(forbiddenError))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get actions record generic error", () => {
        const data = {uuid: "someUUID"};
        const action = {type: actionRecordActions.getActionsRecordActions.request, data }
        const gen = testable.getActionsRecord(action)
        gen.next();
        expect(gen.throw(plainError).value).toEqual(
            put(actionRecordActions.getActionsRecordFailure(plainError))
        );
        expect(gen.next().done).toEqual(true);
    });
})

describe("get recent associated tasks actions for a user", () => {
    it("watches for a get tasks actions records dispatch", () => {
        const gen = testable.watchGetTasksActionsRecord();
        gen.next();
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get tasks actions record request", () => {
        const data = {userUUID: "someUUID"}
        const result = [];
        const action = {type: actionRecordActions.getTasksActionsRecordActions.request, data }
        const gen = testable.getTasksActionsRecord(action)
        const api = {log: {getTasksRecords: jest.fn(() => [])}};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(call([api, api.log.getTasksRecords], action.data.userUUID, "newest"));
        expect(gen.next(result).value).toEqual(put(actionRecordActions.getTasksActionsRecordSuccess(result)));
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get tasks actions record not found error", () => {
        const data = {userUUID: "someUUID"}
        const action = {type: actionRecordActions.getTasksActionsRecordActions.request, data }
        const gen = testable.getTasksActionsRecord(action)
        gen.next();
        expect(gen.throw(notFoundError).value).toEqual(
            put(actionRecordActions.getTasksActionsRecordNotFound(notFoundError))
        );
        expect(gen.next().value).toEqual(
            put(actionRecordActions.getTasksActionsRecordFailure(notFoundError))
        )
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get tasks actions record forbidden error", () => {
        const data = {userUUID: "someUUID"};
        const action = {type: actionRecordActions.getTasksActionsRecordActions.request, data }
        const gen = testable.getTasksActionsRecord(action)
        gen.next();
        expect(gen.throw(forbiddenError).value).toEqual(
            put(actionRecordActions.getTasksActionsRecordForbidden(forbiddenError))
        );
        expect(gen.next().value).toEqual(
            put(actionRecordActions.getTasksActionsRecordFailure(forbiddenError))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("saga for a get tasks actions record generic error", () => {
        const data = {userUUID: "someUUID"};
        const action = {type: actionRecordActions.getTasksActionsRecordActions.request, data }
        const gen = testable.getTasksActionsRecord(action)
        gen.next();
        expect(gen.throw(plainError).value).toEqual(
            put(actionRecordActions.getTasksActionsRecordFailure(plainError))
        );
        expect(gen.next().done).toEqual(true);
    });
})
