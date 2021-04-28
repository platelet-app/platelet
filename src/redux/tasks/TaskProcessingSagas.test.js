import {testable} from "./TaskProcessingSagas"
import * as taskActions from "./TasksActions"
import {call, put, select, takeEvery} from "redux-saga/effects";
import {determineTaskType, findExistingTaskParent} from "../../utilities";
import {taskCategoryActionFunctions} from "./TasksActions";
import {getTasksSelector} from "../Api";
import {initialTasksState} from "./TasksReducers";
import _ from "lodash";
import {taskGroupSort} from "./task_redux_utilities";
import {unsubscribeFromUUID} from "../sockets/SocketActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";

describe("saga take a new tasks group, sorts it and puts it back into state", () => {
    test("watch sort and send to state", () => {
        const gen = testable.watchSortAndSendToState();
        expect(gen.next().value).toEqual(takeEvery(taskActions.SORT_AND_SEND_TO_STATE, testable.sortAndSendToState))
        expect(gen.next().done).toEqual(true);
    });
    it("takes a tasks group and dispatches it to the tasks reducer", () => {
        const action = {taskGroup: {
            "someUUID": {
                uuid: "someUUID"
            }
            }}
        const data = {
            tasksNew: {
                1: action.taskGroup
            },
            tasksActive: {
                1: action.taskGroup
            },
            tasksPickedUp: {
                1: action.taskGroup
            },
            tasksDelivered: {
                1: action.taskGroup
            },
            tasksRejected: {
                1: action.taskGroup
            },
            tasksCancelled: {
                1: action.taskGroup
            },
        }
        const gen = testable.sortAndSendToState(action)
        expect(gen.next().value).toEqual(
            call(determineTaskType, action.taskGroup)
        );
        for (const [key, value] of Object.entries(data)) {
            expect(gen.next(data).value).toEqual(
                put(taskCategoryActionFunctions[key].add(value))
            )
        }
    });

});
describe("sagas that add a task, after the request has succeeded", () => {
    test("watching add a new task", () => {
        const gen = testable.watchAddTaskSuccess();
        expect(gen.next().value).toEqual(
            takeEvery(taskActions.addTaskActions.success, testable.addTaskSuccess)
        );
        expect(gen.next().done).toEqual(true);

    });
    it("adds new task and sends it to the sort saga", () => {
        const data = {
            "someUUID": {
                uuid: "someUUID"
            }
        };
        const action = {
            type: taskActions.addTaskActions.success, data: data["someUUID"]
        };
        const gen = testable.addTaskSuccess(action);
        expect(gen.next().value).toEqual(
            data
        );
        expect(gen.next(data).value).toEqual(
            put(taskActions.sortAndSendToState(data))
        )
        expect(gen.next().done).toEqual(true);
    });
});

describe("sagas that delete a task, after the request has succeeded", () => {
    const parent = {
        listType: "tasksNew",
        taskGroup: {
            "someUUID": {
                uuid: "someUUID",
            }
        },
        parent_id: 1
    }
    test("delete a task that has no relays", () => {
        const data = "someUUID";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const tasks = initialTasksState;
        const gen  = testable.deleteTaskSuccess(action);
        const beforeDelete = {
            uuid: "someUUID",
            parent_id: 1
        };
        const filteredGroup = {};
        const newList = {};
        const groupValues = [];

        const restoreActions = () => [
            taskActions.restoreTaskRequest(action.data)]
        const groupSorted = {};
        expect(gen.next().value).toEqual(select(getTasksSelector));
        expect(gen.next(tasks).value).toEqual(call(findExistingTaskParent, tasks, action.data));
        expect(gen.next(parent).value).toEqual(parent.taskGroup["someUUID"])
        expect(gen.next(parent).value).toEqual(
            call([Object, Object.values], parent.taskGroup)
        )
        expect(gen.next(groupValues).value).toEqual(
            call([groupValues, groupValues.sort], taskGroupSort)
        )
        expect(gen.next(beforeDelete).value).toEqual(
            put(taskActions.resetGroupRelayUUIDs(beforeDelete.parent_id))
        )
        expect(gen.next().value).toEqual(
            put(unsubscribeFromUUID(action.data))
        );
        expect(gen.next().value()).toEqual(
            restoreActions()
        )
        expect(gen.next(restoreActions).value).toEqual(
            put(displayInfoNotification("Task deleted", restoreActions))
        )

        expect(gen.next(parent).value).toEqual(call(_.omit, parent.taskGroup, action.data));
        expect(gen.next(filteredGroup).value).toEqual(
            call(_.omit, tasks[parent.listType], parent.parentID)
        );
        expect(gen.next(filteredGroup).value).toEqual(
            put(taskCategoryActionFunctions[parent.listType].put(newList))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("delete a task that has relays", () => {
        return
        const data = "someUUID";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const tasks = initialTasksState;
        const gen  = testable.deleteTaskSuccess(action);
        const filteredGroup = {
            "someUUID": {uuid: "someUUID"}
        };
        expect(gen.next().value).toEqual(select(getTasksSelector));
        expect(gen.next(tasks).value).toEqual(call(findExistingTaskParent, tasks, action.data));
        expect(gen.next(parent).value).toEqual(
            call(_.omit, parent.taskGroup, action.data)
        );
        expect(gen.next(filteredGroup).value).toEqual(
            put(taskActions.sortAndSendToState(filteredGroup))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("delete a task that cannot be found", () => {
        const data = "someUUID";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const gen  = testable.deleteTaskSuccess(action);
        const beforeDelete = undefined;
        gen.next();
        gen.next();
        gen.next(parent);
        gen.next(beforeDelete);

        expect(gen.next(parent).done).toEqual(true);
    });

})
