import Control from "../../ApiControl";
import {watchDeleteUser, watchGetUser, watchGetUsers, watchRestoreUser} from "./UsersSagas";
import {testable} from "./UsersSagas.js";
import takeLatest from "redux-saga";
import {
    uploadUserProfilePictureActions,
    deleteUserActions,
    restoreUserActions,
    addUserActions,
    getUsersSuccess,
    getUsersActions,
    getUserFailure,
    getUsersFailure,
    getUserSuccess,
    getUserNotFound,
    deleteUserSuccess,
    restoreUserRequest,
    deleteUserFailure,
    restoreUserSuccess,
    restoreUserNotFound,
    restoreUserFailure
} from "./UsersActions";
import {getUserActions} from "./UsersActions";
import {call, put, select} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {convertListDataToObjects} from "../redux_utilities";
import {displayInfoNotification} from "../notifications/NotificationsActions";

beforeAll(() => {
})

beforeEach(() => {
    fetch.resetMocks();
});



describe("get all users", () => {
    it("watches get all users saga", () => {
        const gen = watchGetUsers();
        //expect(gen.next().value).toEqual(takeLatest(getUserActions.request, jest.fn()));
        gen.next();
        expect(gen.next().done).toEqual(true);
    })
    it("gets all users saga", () => {
        const gen = testable.getUsers();
        expect(gen.next().value).toEqual(select(getApiControl));
        const api = {users: {getUsers: jest.fn()}};
        expect(gen.next(api).value).toEqual(call([api, api.users.getUsers]));
        expect(gen.next([]).value).toEqual(call(convertListDataToObjects, []));
        expect(gen.next({}).value).toEqual(put(getUsersSuccess({})));
        expect(gen.next().done).toEqual(true);
    });
    test("get all users failure", () => {
        const gen = testable.getUsers();
        gen.next();
        expect(gen.throw(new Error()).value).toEqual(put(getUsersFailure(new Error())))
        expect(gen.next().done).toEqual(true);
    });
});

describe("get a user", () => {
    it("watches get user saga", () => {
        const gen = watchGetUser();
        gen.next();
        expect(gen.next().done).toEqual(true);
    })
    it("get a user", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.getUser(action);
        expect(gen.next().value).toEqual(select(getApiControl));
        const api = {users: {getUser: jest.fn()}};
        expect(gen.next(api).value).toEqual(
            call([api, api.users.getUser], action.data.userUUID)
        );
        expect(gen.next({}).value).toEqual(put(getUserSuccess({})));
        expect(gen.next().done).toEqual(true);
    });
    test("get a user failure", () => {
        const gen = testable.getUser();
        gen.next();
        expect(gen.throw(new Error()).value).toEqual(put(getUserFailure(new Error())))
        expect(gen.next().done).toEqual(true);
    });
    test("get a user that doesn't exist", () => {
        const gen = testable.getUser();
        gen.next();
        const error = new Error();
        error.status_code = 404;
        expect(gen.throw(error).value).toEqual(put(getUserNotFound(error)))
        expect(gen.next().value).toEqual(put(getUserFailure(error)));
        expect(gen.next().done).toEqual(true);
    });
});

describe ("delete a user", () => {
    it("watches delete a user", () => {
        const gen = watchDeleteUser();
        gen.next();
        expect(gen.next().done).toEqual(true);
    });
    it("deletes a user", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.deleteUser(action);
        const restoreActions = () => [restoreUserRequest(action.data.userUUID)];
        expect(gen.next().value()).toEqual(restoreActions());
        expect(gen.next(restoreActions).value).toEqual(select(getApiControl));
        const api = {users: {deleteUser: jest.fn()}};
        expect(gen.next(api).value).toEqual(
            call([api, api.users.deleteUser], action.data.userUUID)
        );
        expect(gen.next().value).toEqual(put(deleteUserSuccess(action.data.userUUID)));
        expect(gen.next().value).toEqual(
            put(displayInfoNotification("User deleted", restoreActions))
        );
        expect(gen.next().done).toEqual(true);
    })
    it("deletes a user that doesn't exist", () => {
        const restoreActions = () => [restoreUserRequest(action.data.userUUID)];
        const api = {users: {deleteUser: jest.fn()}};
        const action = {data: {userUUID: ""}}
        const gen = testable.deleteUser(action);
        gen.next();
        gen.next(restoreActions);
        gen.next(api);
        const error = new Error();
        error.status_code = 404;
        // if the user doesn't exist, carry on as if everything is fine since we're trying to delete it anyway
        expect(gen.throw(error).value).toEqual(put(deleteUserSuccess(action.data.userUUID)));
        expect(gen.next().value).toEqual(
            put(displayInfoNotification("User deleted", restoreActions))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("delete a user failure", () => {
        const gen = testable.deleteUser();
        gen.next();
        const error = new Error();
        expect(gen.throw(error).value).toEqual(put(deleteUserFailure(error)))
    });
});

describe ("restore a user", () => {
    it("watches restore a user", () => {
        const gen = watchRestoreUser();
        gen.next();
        expect(gen.next().done).toEqual(true);
    });
    test("restore a user", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.restoreUser(action);
        const api = {users: {
            restoreUser: jest.fn(),
            getUser: jest.fn()
        }};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(
            call([api, api.users.restoreUser], action.data.userUUID)
        );
        expect(gen.next(api).value).toEqual(
            call([api, api.users.getUser], action.data.userUUID)
        );
        expect(gen.next({}).value).toEqual(
            put(restoreUserSuccess({}))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("restore user failure", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.restoreUser(action);
        gen.next();
        const error = new Error();
        expect(gen.throw(error).value).toEqual(
            put(restoreUserFailure(error))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("restore a non-existent user", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.restoreUser(action);
        gen.next();
        const error = new Error();
        error.status_code = 404;
        expect(gen.throw(error).value).toEqual(
            put(restoreUserNotFound(error))
        );
        expect(gen.next(error).value).toEqual(
            put(restoreUserFailure(error))
        );
        expect(gen.next().done).toEqual(true);
    });
});
