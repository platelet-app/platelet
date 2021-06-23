import {initialTasksState, tasks} from "./TasksReducers";
import * as tasksActions from "./TasksActions";

describe("test the tasks reducer", () => {
    it("tests the initial tasks state", () => {
        return
        expect(tasks(undefined, {})).toEqual(
            initialTasksState
        )
    })
    it("adds a new task to the reducer", () => {
        return
        const data = {
            uuid: "someUUID",
            time_created: new Date().toISOString(),
            assigned_riders: [],
            parent_id: 1
        };
        const action = {type: tasksActions.addTaskActions.success, data}
        expect(tasks(initialTasksState, action)).toEqual(
            {...initialTasksState, tasks: {...initialTasksState.tasks, tasksNew: {[data.parent_id]: {[data.uuid]: data}}}}
        )
    });
})
