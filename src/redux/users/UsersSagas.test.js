import {
    watchAddUser,
    watchDeleteUser,
    watchGetUser,
    watchGetUsers,
    watchRestoreUser,
    watchUpdateUser,
    watchUpdateUserPassword, watchUploadUserProfilePicture
} from "./UsersSagas";
import {testable} from "./UsersSagas.js";
import * as userActions from "./UsersActions"
import {call, put, select} from "redux-saga/effects";
import {getApiControl} from "../Api";
import {convertListDataToObjects} from "../redux_utilities";
import {displayInfoNotification} from "../notifications/NotificationsActions";
import sagaTestingErrors from "../testing/errorConsts";

const {notFoundError, forbiddenError, plainError} = sagaTestingErrors;

beforeAll(() => {
})

beforeEach(() => {
});

describe("add a user", () => {
    it("watch add a new user", () => {
        const gen = watchAddUser();
        gen.next();
        expect(gen.next().done).toEqual(true);
    })
    test("adding a new user", () => {
        const action = {data: {payload: {}}}
        const gen = testable.addUser(action);
        const api = {users: {createUser: jest.fn()}};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(
            call([api, api.users.createUser], action.data.payload)
        );
        expect(gen.next().value).toEqual(put(userActions.addUserSuccess(action.data)));
        expect(gen.next().done).toEqual(true);
});
    test("adding a new user failure", () => {
        const action = {data: {payload: {}}}
        const gen = testable.addUser(action);
        gen.next();
        expect(gen.throw(plainError).value).toEqual(put(userActions.addUserFailure(plainError)));
        expect(gen.next().done).toEqual(true);
    });
})

describe("get all users", () => {
    it("watches get all users saga", () => {
        const gen = watchGetUsers();
        //expect(gen.next().value).toEqual(takeLatest(getUserActions.request, jest.fn()));
        gen.next();
        expect(gen.next().done).toEqual(true);
    })
    test("getting all users saga", () => {
        const gen = testable.getUsers();
        expect(gen.next().value).toEqual(select(getApiControl));
        const api = {users: {getUsers: jest.fn()}};
        expect(gen.next(api).value).toEqual(call([api, api.users.getUsers]));
        expect(gen.next([]).value).toEqual(call(convertListDataToObjects, []));
        expect(gen.next({}).value).toEqual(put(userActions.getUsersSuccess({})));
        expect(gen.next().done).toEqual(true);
    });
    test("get all users failure", () => {
        const gen = testable.getUsers();
        gen.next();
        expect(gen.throw(plainError).value).toEqual(put(userActions.getUsersFailure(plainError)))
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
        expect(gen.next({}).value).toEqual(put(userActions.getUserSuccess({})));
        expect(gen.next().done).toEqual(true);
    });
    test("get a user failure", () => {
        const gen = testable.getUser();
        gen.next();
        expect(gen.throw(plainError).value).toEqual(put(userActions.getUserFailure(plainError)))
        expect(gen.next().done).toEqual(true);
    });
    test("get a user that doesn't exist", () => {
        const gen = testable.getUser();
        gen.next();
        expect(gen.throw(notFoundError).value).toEqual(put(userActions.getUserNotFound(notFoundError)))
        expect(gen.next().value).toEqual(put(userActions.getUserFailure(notFoundError)));
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
        const restoreActions = () => [userActions.restoreUserRequest(action.data.userUUID)];
        expect(gen.next().value()).toEqual(restoreActions());
        expect(gen.next(restoreActions).value).toEqual(select(getApiControl));
        const api = {users: {deleteUser: jest.fn()}};
        expect(gen.next(api).value).toEqual(
            call([api, api.users.deleteUser], action.data.userUUID)
        );
        expect(gen.next().value).toEqual(put(userActions.deleteUserSuccess(action.data)));
        expect(gen.next().value).toEqual(
            put(displayInfoNotification("User deleted", restoreActions))
        );
        expect(gen.next().done).toEqual(true);
    })
    it("deletes a user that doesn't exist", () => {
        const restoreActions = () => [userActions.restoreUserRequest(action.data.userUUID)];
        const api = {users: {deleteUser: jest.fn()}};
        const action = {data: {userUUID: ""}}
        const gen = testable.deleteUser(action);
        gen.next();
        gen.next(restoreActions);
        gen.next(api);
        // if the user doesn't exist, carry on as if everything is fine since we're trying to delete it anyway
        expect(gen.throw(notFoundError).value).toEqual(put(userActions.deleteUserSuccess(action.data)));
        expect(gen.next().value).toEqual(
            put(displayInfoNotification("User deleted", restoreActions))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("delete a user failure", () => {
        const gen = testable.deleteUser();
        gen.next();
        expect(gen.throw(plainError).value).toEqual(put(userActions.deleteUserFailure(plainError)))
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
            put(userActions.restoreUserSuccess({}))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("restore user failure", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.restoreUser(action);
        gen.next();
        expect(gen.throw(plainError).value).toEqual(
            put(userActions.restoreUserFailure(plainError))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("restore a non-existent user", () => {
        const action = {data: {userUUID: ""}}
        const gen = testable.restoreUser(action);
        gen.next();
        expect(gen.throw(notFoundError).value).toEqual(
            put(userActions.restoreUserNotFound(notFoundError))
        );
        expect(gen.next(notFoundError).value).toEqual(
            put(userActions.restoreUserFailure(notFoundError))
        );
        expect(gen.next().done).toEqual(true);
    });
});

describe("update a user", () => {
    it("watches update a user", () => {
        const gen = watchUpdateUser();
        gen.next();
        expect(gen.next().done).toEqual(true);
    });
    it("updates a user", () => {
        const action = {data: {payload: {}, userUUID: ""}}
        const gen = testable.updateUser(action);
        const api = {users: {
                updateUser: jest.fn()
            }};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(
            call([api, api.users.updateUser], action.data.userUUID, action.data.payload)
        )
        expect(gen.next().value).toEqual(put(userActions.updateUserSuccess(action.data)))
        expect(gen.next().done).toEqual(true);
    });
    test("update a user that doesn't exist", () => {
        const action = {data: {payload: {}, userUUID: ""}}
        const gen = testable.updateUser(action);
        gen.next();
        expect(gen.throw(notFoundError).value).toEqual(put(userActions.updateUserNotFound(notFoundError)));
        expect(gen.next(notFoundError).value).toEqual(put(userActions.updateUserFailure(notFoundError)));
        expect(gen.next().done).toEqual(true);
    });
    test("update a user failure", () => {
        const action = {data: {payload: {}, userUUID: ""}}
        const gen = testable.updateUser(action);
        gen.next();
        expect(gen.throw(plainError).value).toEqual(put(userActions.updateUserFailure(plainError)));
        expect(gen.next().done).toEqual(true);
    });
});

describe("update a user's password", () => {
    it("watches update a user's password", () => {
        const gen = watchUpdateUserPassword();
        gen.next();
        expect(gen.next().done).toEqual(true);
    });
    it("updates a user's password", () => {
        const action = {data: {payload: {password: ""}, userUUID: ""}}
        const gen = testable.updateUserPassword(action);
        const api = {users: {
                updateUser: jest.fn()
            }};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(
            call([api, api.users.updateUser], action.data.userUUID, action.data.payload)
        )
        expect(gen.next().value).toEqual(put(userActions.updateUserPasswordSuccess(action.data)))
        expect(gen.next().value).toEqual(put(userActions.clearForceResetPasswordStatus()));
        expect(gen.next().done).toEqual(true);
    });
    test("update a user's password for a user that doesn't exist", () => {
        const action = {data: {payload: {password: ""}, userUUID: ""}}
        const gen = testable.updateUserPassword(action);
        gen.next();
        expect(gen.throw(notFoundError).value).toEqual(put(userActions.updateUserPasswordNotFound(notFoundError)));
        expect(gen.next(notFoundError).value).toEqual(put(userActions.updateUserPasswordFailure(notFoundError)));
        expect(gen.next().done).toEqual(true);
    });
    test("update a user's password failure", () => {
        const action = {data: {payload: {password: ""}, userUUID: ""}}
        const gen = testable.updateUserPassword(action);
        gen.next();
        expect(gen.throw(plainError).value).toEqual(put(userActions.updateUserPasswordFailure(plainError)));
        expect(gen.next().done).toEqual(true);
    });
});

describe("upload a user profile picture", () => {
    it("watches upload profile picture", () => {
        const gen = watchUploadUserProfilePicture();
        gen.next()
        expect(gen.next().done).toEqual(true);
    });
    it("uploads a user profile picture", () => {
        const action = {data: {payload: {image_data: ""}, userUUID: ""}}
        const gen = testable.uploadUserProfilePicture(action);
        const api = {users: {
                uploadProfilePicture: jest.fn()
            }};
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.next(api).value).toEqual(
            call([api, api.users.uploadProfilePicture], action.data.userUUID, action.data.payload)
        )
        expect(gen.next().value).toEqual(
            put(userActions.uploadUserProfilePictureSuccess(action.data))
        )
        expect(gen.next().done).toEqual(true);
    })
    test("uploading a profile picture for a user that does not exist", () => {
        const action = {data: {payload: {image_data: ""}, userUUID: ""}}
        const gen = testable.uploadUserProfilePicture(action);
        expect(gen.next().value).toEqual(select(getApiControl));
        expect(gen.throw(notFoundError).value).toEqual(
            put(userActions.uploadUserProfilePictureNotFound(notFoundError))
        );
        expect(gen.next().value).toEqual(
            put(userActions.uploadUserProfilePictureFailure(notFoundError))
        );
        expect(gen.next().done).toEqual(true);
    });
    test("uploading a profile picture for a user failure", () => {
        const action = {data: {payload: {image_data: ""}, userUUID: ""}}
        const gen = testable.uploadUserProfilePicture(action);
        gen.next();
        expect(gen.throw(plainError).value).toEqual(
            put(userActions.uploadUserProfilePictureFailure(plainError))
        );
        expect(gen.next().done).toEqual(true);
    })
});
