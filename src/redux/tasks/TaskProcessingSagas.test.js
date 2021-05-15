import {testable} from "./TaskProcessingSagas"
import * as taskActions from "./TasksActions"
import {all, call, put, select, takeEvery} from "redux-saga/effects";
import {determineTaskType, encodeUUID, findExistingTaskParent} from "../../utilities";
import {sortAndSendToState, taskCategoryActionFunctions} from "./TasksActions";
import {getTasksSelector, getUsersSelector} from "../Api";
import {initialTasksState} from "./TasksReducers";
import _ from "lodash";
import {taskGroupSort} from "./task_redux_utilities";
import {subscribeToUUID, unsubscribeFromUUID} from "../sockets/SocketActions";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import {expectSaga, testSaga} from "redux-saga-test-plan";
import * as restoreFactories from "./TaskRestoreFactoryFunctions";
import {setTaskDropoffDestinationRequest} from "../taskDestinations/TaskDestinationsActions";
import * as taskAssigneesActions from "../taskAssignees/TaskAssigneesActions";

jest.mock('./TaskRestoreFactoryFunctions')

describe("saga take a new tasks group, sorts it and puts it back into state", () => {
    test("watch sort and send to state", () => {
        const gen = testable.watchSortAndSendToState();
        expect(gen.next().value).toEqual(takeEvery(taskActions.SORT_AND_SEND_TO_STATE, testable.sortAndSendToState))
        expect(gen.next().done).toEqual(true);
    });
    it("takes a tasks group and dispatches it to the tasks reducer", () => {
        const action = {
            taskGroup: {
                "someUUID": {
                    uuid: "someUUID"
                }
            }
        }
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
    test("watch for add a new task actions", () => {
        testSaga(testable.watchAddTaskSuccess)
            .next()
            .all([
                takeEvery(taskActions.addTaskActions.success, testable.addTaskSuccess),
                takeEvery(taskActions.ADD_TASK_FROM_SOCKET, testable.addTaskSuccess)
            ])
            .next()
            .isDone()

    })
    it("adds new task and sends it to the sort saga", () => {
        const data = {
            "someUUID": {
                uuid: "someUUID"
            }
        };
        const action = {
            type: taskActions.addTaskActions.success,
            data: {payload: data["someUUID"], autoAssign: {role: "coordinator", uuid: "someUser"}}
        };
        return expectSaga(testable.addTaskSuccess, action)
            .provide([
                [select(getUsersSelector), {
                    someUser: {uuid: "someUser"}
                }]
            ])
            .put(taskActions.sortAndSendToState(data))
            .put(taskAssigneesActions.addTaskAssignedCoordinatorSuccess({
                    taskUUID: "someUUID",
                    payload: {
                        user: {uuid: "someUser"}
                    }
                }

            ))
            .put(subscribeToUUID("someUUID"))
            .run()
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
    test("watch for delete actions", () => {
        testSaga(testable.watchDeleteTaskSuccess)
            .next()
            .all([
                takeEvery(taskActions.deleteTaskActions.success, testable.deleteTaskSuccess),
                takeEvery(taskActions.DELETE_TASK_FROM_SOCKET, testable.deleteTaskSuccess)
            ])
            .next()
            .isDone()

    });
    test("delete a task that has no relays", () => {
        const data = "someUUID";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const existingTask = {
            someUUID: {
                uuid: "someUUID",
                parent_id: 1
            }
        }
        restoreFactories.actionDeleteWithRelaysRestoreFactory.mockReturnValue(jest.fn())
        return expectSaga(testable.deleteTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {
                        1: existingTask,
                    }
                }
                ]
            ])
            .put(unsubscribeFromUUID(action.data))
            .put(taskActions.resetGroupRelayUUIDs(1))
            .put(displayInfoNotification("Task deleted", restoreFactories.actionDeleteRestoreFactory(action, "someUUID")))
            .put(taskActions.taskCategoryActionFunctions["tasksNew"].put({}))
            .run()

    });
    test("delete a task that has relays but no locations", () => {
        const data = "someUUID2";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const existingTask = {
            "someUUID": {uuid: "someUUID", parent_id: 1},
            "someUUID2": {uuid: "someUUID2", parent_id: 1, relay_previous_uuid: "someUUID"}
        };
        restoreFactories.actionDeleteWithRelaysRestoreFactory.mockReturnValue(jest.fn())
        return expectSaga(testable.deleteTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {
                        1: existingTask,
                    }
                }
                ]
            ])
            .put(unsubscribeFromUUID(action.data))
            .put(displayInfoNotification("Task deleted", restoreFactories.actionDeleteWithRelaysRestoreFactory(action, "someUUID")))
            .put(taskActions.sortAndSendToState({"someUUID": existingTask['someUUID']}))
            .put(taskActions.resetGroupRelayUUIDs(1))
            .run()

    });
    test("delete a task that has relays and locations", () => {
        const data = "someUUID2";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const existingTask = {
            "someUUID": {
                uuid: "someUUID",
                parent_id: 1,
                pickup_location: {uuid: "someLocation"},
                dropoff_location: {uuid: "someLocation2"}
            },
            "someUUID2": {
                uuid: "someUUID2",
                parent_id: 1,
                relay_previous_uuid: "someUUID",
                pickup_location: {uuid: "someLocation3"},
                dropoff_location: {uuid: "someLocation4"}
            },
        };
        restoreFactories.actionDeleteWithRelaysRestoreFactory.mockReturnValue(jest.fn())
        return expectSaga(testable.deleteTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {
                        1: existingTask,
                    }
                }
                ]
            ])
            .put(setTaskDropoffDestinationRequest(
                existingTask.someUUID2.relay_previous_uuid,
                existingTask.someUUID2.dropoff_location.uuid
            ))
            .put(unsubscribeFromUUID(action.data))
            .put(displayInfoNotification("Task deleted", restoreFactories.actionDeleteWithRelaysRestoreFactory(action, "someUUID")))
            .put(taskActions.sortAndSendToState({"someUUID": existingTask['someUUID']}))
            .put(taskActions.resetGroupRelayUUIDs(1))
            .run()

    });
    test("delete a task that cannot be found", () => {
        const data = "someUUID";
        const action = {
            type: taskActions.deleteTaskActions.success, data
        };
        const gen = testable.deleteTaskSuccess(action);
        const beforeDelete = undefined;
        gen.next();
        gen.next();
        gen.next(parent);
        gen.next(beforeDelete);

        expect(gen.next(parent).done).toEqual(true);
    });
});

describe("sagas that restore a deleted task after the request has completed", () => {
    const data = {
        parent_id: 1,
        uuid: "someUUID"
    };
    const action = {
        type: taskActions.restoreTaskActions.success,
        data
    };
    it("watches for a restore action", () => {
        testSaga(testable.watchRestoreTaskSuccess)
            .next()
            .all([
                takeEvery(taskActions.restoreTaskActions.success, testable.restoreTaskSuccess),
                takeEvery(taskActions.RESTORE_TASK_FROM_SOCKET, testable.restoreTaskSuccess),
            ])
            .next()
            .isDone()
    });
    it("restores a task to state with no existing group", () => {
        return expectSaga(testable.restoreTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {}
                }]
            ])
            .put(taskActions.sortAndSendToState({[data.uuid]: data}))
            .run();
    });
    it("restores a task to state with an existing group", () => {
        const existingTask = {
            someUUID2: {
                uuid: "someUUID2",
                parent_id: 1
            }
        }
        return expectSaga(testable.restoreTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {
                        1: existingTask,
                    }
                }
                ]
            ])
            .put(taskActions.sortAndSendToState({[data.uuid]: data, ...existingTask}))
            .run();
    });
});

describe("sagas that add a new task relay after the request has completed", () => {
    const data = {
        payload: {
            parent_id: 1,
            uuid: "someUUID2",
            relay_previous_uuid: "someUUID1"
        },
        autoAssign: {
            role: "coordinator",
            uuid: "someUser"
        }
    };
    const data2 = {
        payload: {
            parent_id: 1,
            uuid: "someUUID1",
        }

    }
    const action = {type: taskActions.addTaskRelayActions.success, data}
    it("watches for an add relay success action", () => {
        testSaga(testable.watchAddTaskRelaySuccess)
            .next()
            .all([
                takeEvery(taskActions.addTaskRelayActions.success, testable.addTaskRelaySuccess),
                takeEvery(taskActions.ADD_TASK_RELAY_FROM_SOCKET, testable.addTaskRelaySuccess),
            ])
            .next()
            .isDone()
    });
    it("sends a new task relay to state", () => {
        return expectSaga(testable.addTaskRelaySuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {1: {[data2.payload.uuid]: data2.payload}}
                }],
                [select(getUsersSelector), {
                    someUser: {uuid: "someUser"}
                }]
            ])

            .put(subscribeToUUID(data.payload.uuid))
            .put(taskActions.sortAndSendToState({
                [data.payload.uuid]: data.payload,
                [data2.payload.uuid]: data2.payload
            }))
            .put(taskAssigneesActions.addTaskAssignedCoordinatorSuccess({
                taskUUID: data.payload.uuid,
                payload: {
                    user: {uuid: "someUser"}
                }
            }))
            .run()

    });
    it("add new task relay for a parent that isn't in state", () => {
        return expectSaga(testable.addTaskRelaySuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {2: {[data2.uuid]: data2}}
                }]
            ])
            .run()
    });
});

describe("sagas that take a task and put it into state, replacing the existing one", () => {
    const data = {
        uuid: "someUUID",
        patch: "North",
        parent_id: 1
    }
    const data2 = {
        uuid: "someUUID",
        patch: "West",
        parent_id: 1
    }
    const action = {
        type: taskActions.putTaskActions.success,
        data
    }
    it("watches for put actions", () => {
        testSaga(testable.watchPutTaskSuccess)
            .next()
            .all([
                takeEvery(taskActions.putTaskActions.success, testable.putTaskSuccess),
                takeEvery(taskActions.PUT_TASK_FROM_SOCKET, testable.putTaskSuccess)
            ])
            .next()
            .isDone()
    });
    it("put a task into state", () => {
        return expectSaga(testable.putTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {1: {[data.uuid]: data2}}
                }]])
            .put(taskActions.sortAndSendToState({[data.uuid]: data}))
            .run()
    })
    it("put a task into state that doesn't already exist", () => {
        return expectSaga(testable.putTaskSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {}
                }]])
            .put(taskActions.sortAndSendToState({[data.uuid]: data}))
            .run()
    })
})

describe("putting a task into state after successful request to update time cancelled or rejected", () => {
    test("watch for time cancelled/rejected actions", () => {
        testSaga(testable.watchUpdateTaskTimeCancelledTimeRejectedSuccess)
            .next()
            .all([
                takeEvery(taskActions.updateTaskCancelledTimeActions.success, testable.updateTaskTimeCancelledTimeRejectedSuccess),
                takeEvery(taskActions.updateTaskRejectedTimeActions.success, testable.updateTaskTimeCancelledTimeRejectedSuccess),
                takeEvery(taskActions.UPDATE_TASK_TIME_CANCELLED_FROM_SOCKET, testable.updateTaskTimeCancelledTimeRejectedSuccess),
                takeEvery(taskActions.UPDATE_TASK_TIME_REJECTED_FROM_SOCKET, testable.updateTaskTimeCancelledTimeRejectedSuccess),
            ])
            .next()
            .isDone()
    });
    it("updates the task state with cancelled time and sends a notification", () => {
        const action = {
            type: taskActions.updateTaskCancelledTimeActions.success,
            data: {taskUUID: "someUUID", payload: {time_cancelled: new Date().toISOString()}}
        };
        const viewLink = `/task/${encodeUUID(action.data.taskUUID)}`
        restoreFactories.actionTimeCancelledRestoreFactory.mockReturnValue(jest.fn())
        return expectSaga(testable.updateTaskTimeCancelledTimeRejectedSuccess, action)
            .provide([
                [select(getTasksSelector), {
                    tasksNew: {
                        1: {
                            someUUID: {
                                time_cancelled: null,
                                parent_id: 1
                            }
                        }
                    }
                }]])
            .put(displayInfoNotification("Task marked cancelled", restoreFactories.actionTimeCancelledRestoreFactory(action), viewLink))
            .put(sortAndSendToState({someUUID: {...action.data.payload, parent_id: 1}}))
            .put(taskActions.resetGroupRelayUUIDs(1))
            .run()


    })
})
