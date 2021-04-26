import {
    getUserActions,
    getUserRequest,
    deleteUserRequest,
    getUsersActions,
    getUsersRequest,
    deleteUserActions,
    restoreUserRequest,
    restoreUserActions,
    updateUserRequest,
    updateUserActions,
    updateUserPasswordActions, updateUserPasswordRequest
} from "./UsersActions";

describe("test user request actions", () => {
    it("returns action for a get user request", () => {
        const userUUID = "someUUID";
        expect(getUserRequest(userUUID)).toEqual(
            {type: getUserActions.request, data: {userUUID}}
        );
    });
    it("returns action for a get all users request", () => {
        expect(getUsersRequest()).toEqual(
            {type: getUsersActions.request}
        );
    });
    it("returns action for a delete user request", () => {
        const userUUID = "someUUID";
        expect(deleteUserRequest(userUUID)).toEqual(
            {type: deleteUserActions.request, data: {userUUID}}
        );
    });
    it("returns action for a restore user request", () => {
        const userUUID = "someUUID";
        expect(restoreUserRequest(userUUID)).toEqual(
            {type: restoreUserActions.request, data: {userUUID}}
        );
    });
    it("returns action for an update user request", () => {
        const data = {userUUID: "someUUID", payload: {username: "aa"}};
        expect(updateUserRequest(data.userUUID, data.payload)).toEqual(
            {type: updateUserActions.request, data}
        );
    });
    it("returns action for a change user password request", () => {
        const userUUID = "someUUID";
        const password = "a";
        expect(updateUserPasswordRequest(userUUID, password)).toEqual(
            {type: updateUserPasswordActions.request, data: {userUUID, payload: {password}}}
        )
    })
});
