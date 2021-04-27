import * as taskActions from "./TasksActions";
const taskUUID = "someUUID"

describe("test task request actions", () => {
    it("returns action for an add task request", () => {
        const payload = {
            uuid: "someuuid"
        };
        const data = {payload, autoAssign: {role: "rider", uuid: "someRiderUUID"}}
        expect(taskActions.addTaskRequest(payload, "rider", "someRiderUUID")).toEqual(
            {type: taskActions.addTaskActions.request, data}
        );
    });
    it("returns action for an add task relay request", () => {
        const data = {relayPrevious: "prevUUID", autoAssign: {role: "rider", uuid: "someRiderUUID"}}
        expect(taskActions.addTaskRelayRequest(data.relayPrevious, data.autoAssign.role, data.autoAssign.uuid)).toEqual(
            {type: taskActions.addTaskRelayActions.request, data}
        )
    });
    it("returns action for a delete task request", () => {
        expect(taskActions.deleteTaskRequest(taskUUID)).toEqual(
            {type: taskActions.deleteTaskActions.request, data: {taskUUID}}
        )
    });
    it("returns action for a restore task request", () => {
        expect(taskActions.restoreTaskRequest(taskUUID)).toEqual(
            {type: taskActions.restoreTaskActions.request, data: {taskUUID}}
        )
    });
    it("returns action for an update task requester contact request", () => {
        const payload = {requester_contact: {
            name: "some name"
            }}
        expect(taskActions.updateTaskRequesterContactRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskRequesterContactActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task time picked up", () => {
        const payload = {time_picked_up: new Date().toISOString()}
        expect(taskActions.updateTaskPickupTimeRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskPickupTimeActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task time dropped off", () => {
        const payload = {time_dropped_off: new Date().toISOString()}
        expect(taskActions.updateTaskDropoffTimeRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskDropoffTimeActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task time cancelled", () => {
        const payload = {time_cancelled: new Date().toISOString()}
        expect(taskActions.updateTaskCancelledTimeRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskCancelledTimeActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task time rejected", () => {
        const payload = {time_rejected: new Date().toISOString()}
        expect(taskActions.updateTaskRejectedTimeRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskRejectedTimeActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task priority", () => {
        const payload = {priority_id: 1}
        expect(taskActions.updateTaskPriorityRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskPriorityActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task patch", () => {
        const payload = {patch_id: 1}
        expect(taskActions.updateTaskPatchRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskPatchActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for a general update task request", () => {
        const payload = {patch_id: 1}
        expect(taskActions.updateTaskRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for an update task time of call", () => {
        const payload = {time_of_call: new Date().toISOString()}
        expect(taskActions.updateTaskTimeOfCallRequest(taskUUID, payload)).toEqual(
            { type: taskActions.updateTaskTimeOfCallActions.request, data: {taskUUID, payload} }
        )
    });
    it("returns action for a get tasks request", () => {
        const data = {userUUID: "someUUID", page: 1, role: "coordinator"};
        expect(taskActions.getAllTasksRequest(data.userUUID, data.page, data.role)).toEqual(
            { type: taskActions.getTasksActions.request, data }
        )
    });
    it("returns action for a put tasks request", () => {
        const payload = {uuid: "someUUID"}
        expect(taskActions.putTaskRequest(taskUUID, payload)).toEqual(
            { type: taskActions.putTaskActions.request, data: {taskUUID, payload} }
        )
    });
});
