import {
    getActionsRecordActions,
    getActionsRecordRequest,
    getTasksActionsRecordActions,
    getTasksActionsRecordRequest
} from "./ActionsRecordActions";

describe("get actions record request", () => {
    it("returns an action for requesting action records", () => {
        const uuid = "someUUID";
        expect(getActionsRecordRequest(uuid)).toEqual(
            {type: getActionsRecordActions.request, data: {uuid}}
        )
    });
    it("returns an action for requesting action records", () => {
        const userUUID = "someUUID";
        expect(getTasksActionsRecordRequest(userUUID)).toEqual(
            {type: getTasksActionsRecordActions.request, data: {userUUID}}
        )
    });
});
