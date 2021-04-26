import fs from "fs";
import path from "path";
import _ from "lodash"
import * as usersReducers from "./UsersReducers"
import {
    addUserActions,
    deleteUserActions, getUserActions, getUserFailure,
    getUsersActions,
    restoreUserActions,
    updateUserActions
} from "./UsersActions";
import {convertListDataToObjects} from "../redux_utilities";
import {initialUserState} from "./UsersReducers";

const rawdata = fs.readFileSync(path.resolve(__dirname, "../tests/testData.json"));
const testData = convertListDataToObjects(JSON.parse(rawdata)['users']);


describe("all users reducer", () => {
    it("returns initial users state", () => {
            expect(usersReducers.users(undefined, {})).toEqual({
                    users: {},
                    error: null
                }
            );
        });
    it("adds all users to state", () => {
        const action = {
            data: testData,
            type: getUsersActions.success
        }
        expect(usersReducers.users(undefined, action)).toEqual({
                users: testData,
                error: null
            }
        );
    });
    test("failure to get all users", () => {
        const error = new Error();
        const action = {
            error,
            type: getUsersActions.failure
        }
        expect(usersReducers.users(undefined, action)).toEqual({
                users: {},
                error: error
            }
        );
    });
    it("adds a new user", () => {
        const data = {uuid: "something", username: "some name"};
        const action = {
            data,
            type: addUserActions.success
        };
        expect(usersReducers.users({users: testData, error: null}, action)).toEqual(
            {
                users: {...testData, [data.uuid]: data},
                error: null
            }
        )
    });
    it("restore a deleted user", () => {
        const data = {uuid: "something", username: "some name"};
        const action = {
            data,
            type: restoreUserActions.success
        };
        expect(usersReducers.users({users: testData, error: null}, action)).toEqual(
            {
                users: {...testData, [data.uuid]: data},
                error: null
            }
        )
    });
    it("deletes a user", () => {
        const data = {userUUID: testData[Object.keys(testData)[0]].uuid};
        const action = {
            data,
            type: deleteUserActions.success
        };
        const expected = {users: _.omit(testData, data.userUUID), error: null}
        expect(usersReducers.users({users: testData, error: null}, action)).toEqual(
            expected
        );
    });
    it("updates a user", () => {
        const payload = {username: "some new username"};
        const data = {payload, userUUID: testData[Object.keys(testData)[0]].uuid};
        const action = {
            data,
            payload,
            type: updateUserActions.success
        };
        const expectedUsers =  {...testData, [data.userUUID]: {...testData[data.userUUID], ...payload}};
        expect(usersReducers.users({users: testData, error: null}, action)).toEqual(
            {
                users: expectedUsers,
                error: null
            }
        )
    })
});

describe("singular user reducer", () => {
    it("returns initial user state", () => {
        expect(usersReducers.user(undefined, {})).toEqual(initialUserState);
    });
    it("puts a user into state", () => {
        const data = testData[Object.keys(testData)[0]];
        const action = {type: getUserActions.success, data};
        expect(usersReducers.user(undefined, action)).toEqual({user: data, error: null});
    });
    it("updates a single user", () => {
        const state = {user: testData[Object.keys(testData)[0]], error: null};
        const data = {payload: {username: "some new username"}};
        const action = {type: updateUserActions.success, data};
        expect(usersReducers.user(state, action)).toEqual(
            {user:{...state.user, ...data.payload}, error: null}
        );
    });
    test("state after a get user failure", () => {
        const error = new Error();
        const action = {type: getUserActions.failure, error};
        expect(usersReducers.user(undefined, action)).toEqual({...initialUserState, error});


    })
});
