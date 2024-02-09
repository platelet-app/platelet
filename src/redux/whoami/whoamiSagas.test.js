import { API, Auth, DataStore } from "aws-amplify";
import { testFunctions } from "./whoamiSagas";
import { runSaga } from "redux-saga";
import * as awsAmplify from "aws-amplify";
import * as models from "../../models";
import * as whoamiActions from "./whoamiActions";

const fakeUser = {
    cognitoId: "someCognitoId",
    tenantId: "someTenantId",
    id: "someUserId",
};

const fakeCognitoResponse = {
    attributes: {
        sub: "someCognitoId",
    },
};

jest.mock("../../aws-exports", () => ({
    default: {
        aws_appsync_graphqlEndpoint: "https://another.com/graphql",
    },
}));

jest.mock("uuid", () => ({ v4: () => "someUUID" }));

describe("whoamiSagas", () => {
    beforeEach(() => {
        process.env.REACT_APP_DEMO_MODE = "false";
        process.env.REACT_APP_OFFLINE_ONLY = "false";
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    it("get the user data from the API and save the tenantId", async () => {
        const dispatched = [];
        jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(
            fakeCognitoResponse
        );
        jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getIdToken: () => ({ getJwtToken: () => "someToken" }),
        });
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: { getUserByCognitoId: { items: [fakeUser] } },
        });
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(
                '{"aws_appsync_graphqlEndpoint": "https://amazonaws.com/graphq"}'
            );
        const setSpy = jest.spyOn(Storage.prototype, "setItem");
        const syncExpressionSpy = jest.spyOn(awsAmplify, "syncExpression");
        const mockFetchPromise = Promise.resolve({
            json: () =>
                Promise.resolve({
                    data: {
                        getUserByCognitoId: {
                            items: [{ tenantId: "someTenantId" }],
                        },
                    },
                }),
        });
        const fetchSpy = jest
            .spyOn(global, "fetch")
            .mockImplementation(() => mockFetchPromise);

        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();

        expect(dispatched).toMatchSnapshot();
        expect(setSpy).toHaveBeenCalledWith("userTenantId", "someTenantId");
        for (const m of Object.values(models)) {
            if (!m.hasOwnProperty("copyOf")) continue;
            expect(syncExpressionSpy).toHaveBeenCalledWith(
                m,
                expect.any(Function)
            );
        }
        expect(fetchSpy.mock.calls).toMatchSnapshot();
        expect(apiSpy.mock.calls).toMatchSnapshot();
    });
    it("get the user data from the API and save the tenantId but get config from aws-exports", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT = undefined;
        const dispatched = [];
        jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(
            fakeCognitoResponse
        );
        jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getIdToken: () => ({ getJwtToken: () => "someToken" }),
        });
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: { getUserByCognitoId: { items: [fakeUser] } },
        });
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(
                '{"aws_appsync_graphqlEndpoint": "https://amazonaws.com/graphq"}'
            );
        const setSpy = jest.spyOn(Storage.prototype, "setItem");
        const syncExpressionSpy = jest.spyOn(awsAmplify, "syncExpression");
        const mockFetchPromise = Promise.resolve({
            json: () =>
                Promise.resolve({
                    data: {
                        getUserByCognitoId: {
                            items: [{ tenantId: "someTenantId" }],
                        },
                    },
                }),
        });
        const fetchSpy = jest
            .spyOn(global, "fetch")
            .mockImplementation(() => mockFetchPromise);

        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();

        expect(dispatched).toMatchSnapshot();
        expect(setSpy).toHaveBeenCalledWith("userTenantId", "someTenantId");
        for (const m of Object.values(models)) {
            if (!m.hasOwnProperty("copyOf")) continue;
            expect(syncExpressionSpy).toHaveBeenCalledWith(
                m,
                expect.any(Function)
            );
        }
        expect(fetchSpy.mock.calls).toMatchSnapshot();
        expect(apiSpy.mock.calls).toMatchSnapshot();
    });
    it("get the user data from DataStore and the tenantId from localstorage", async () => {
        const dispatched = [];
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "test",
                tenantId: "someTenant",
                cognitoId: "someCognitoId",
            })
        );
        jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(
            fakeCognitoResponse
        );
        jest.spyOn(API, "graphql").mockResolvedValue({
            data: { getUserByCognitoId: { items: [fakeUser] } },
        });
        jest.spyOn(Storage.prototype, "getItem").mockReturnValue(
            "someTenantId"
        );

        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        const setSpy = jest.spyOn(Storage.prototype, "setItem");
        const syncExpressionSpy = jest.spyOn(awsAmplify, "syncExpression");

        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();

        const successAction = dispatched.find(
            (a) => a.type === whoamiActions.GET_WHOAMI_SUCCESS
        );
        expect(successAction.data).toEqual(mockWhoami);
        const initWhoamiObserverAction = dispatched.find(
            (a) => a.type === whoamiActions.INIT_WHOAMI_OBSERVER
        );
        expect(initWhoamiObserverAction).toEqual({
            type: whoamiActions.INIT_WHOAMI_OBSERVER,
            whoamiId: mockWhoami.id,
        });
        const filteredDispatched = dispatched.filter(
            (a) =>
                a.type !== whoamiActions.GET_WHOAMI_SUCCESS &&
                a.type !== whoamiActions.INIT_WHOAMI_OBSERVER
        );
        expect(filteredDispatched).toMatchSnapshot();
        expect(apiSpy).not.toHaveBeenCalled();
        expect(setSpy).not.toHaveBeenCalled();
        for (const m of Object.values(models)) {
            if (!m.hasOwnProperty("copyOf")) continue;
            expect(syncExpressionSpy).toHaveBeenCalledWith(
                m,
                expect.any(Function)
            );
        }
    });
    it("demo mode", async () => {
        process.env.REACT_APP_DEMO_MODE = "true";
        const dispatched = [];
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "test",
                name: "offline",
                tenantId: "someTenant",
                cognitoId: "someCognitoId",
            })
        );
        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();
        const successAction = dispatched.find(
            (a) => a.type === whoamiActions.GET_WHOAMI_SUCCESS
        );
        expect(successAction.data).toEqual(mockWhoami);
        const initWhoamiObserverAction = dispatched.find(
            (a) => a.type === whoamiActions.INIT_WHOAMI_OBSERVER
        );
        expect(initWhoamiObserverAction).toEqual({
            type: whoamiActions.INIT_WHOAMI_OBSERVER,
            whoamiId: mockWhoami.id,
        });
        const filteredDispatched = dispatched.filter(
            (a) =>
                a.type !== whoamiActions.GET_WHOAMI_SUCCESS &&
                a.type !== whoamiActions.INIT_WHOAMI_OBSERVER
        );
        expect(filteredDispatched).toMatchSnapshot();
    });
    it("API failure", async () => {
        const dispatched = [];
        jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(
            fakeCognitoResponse
        );
        jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getIdToken: () => ({ getJwtToken: () => "someToken" }),
        });
        jest.spyOn(global, "fetch").mockRejectedValue(new Error("someError"));
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(
                '{"aws_appsync_graphqlEndpoint": "https://amazonaws.com/graphq"}'
            );
        const setSpy = jest.spyOn(Storage.prototype, "setItem");

        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();

        expect(dispatched).toMatchSnapshot();
        expect(setSpy).not.toHaveBeenCalled();
    });
    it("errors from API", async () => {
        const dispatched = [];
        jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(
            fakeCognitoResponse
        );
        jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getIdToken: () => ({ getJwtToken: () => "someToken" }),
        });

        const mockFetchPromise = Promise.resolve({
            json: () =>
                Promise.resolve({
                    errors: [{ message: "some error from the server" }],
                    data: {
                        getUserByCognitoId: {},
                    },
                }),
        });
        jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(
                '{"aws_appsync_graphqlEndpoint": "https://amazonaws.com/graphq"}'
            );
        const setSpy = jest.spyOn(Storage.prototype, "setItem");

        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();

        expect(dispatched).toMatchSnapshot();
        expect(setSpy).not.toHaveBeenCalled();
    });
    it("can't find the user", async () => {
        const dispatched = [];
        jest.spyOn(Auth, "currentAuthenticatedUser").mockResolvedValue(
            fakeCognitoResponse
        );
        jest.spyOn(Auth, "currentSession").mockResolvedValue({
            getIdToken: () => ({ getJwtToken: () => "someToken" }),
        });
        jest.spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(
                '{"aws_appsync_graphqlEndpoint": "https://amazonaws.com/graphq"}'
            );
        const setSpy = jest.spyOn(Storage.prototype, "setItem");
        const mockFetchPromise = Promise.resolve({
            json: () =>
                Promise.resolve({
                    data: {
                        getUserByCognitoId: {
                            items: [],
                        },
                    },
                }),
        });
        jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);

        await runSaga(
            {
                dispatch: (action) => dispatched.push(action),
                getState: () => ({ state: "test" }),
            },
            testFunctions.getWhoami
        ).toPromise();

        expect(dispatched).toMatchSnapshot();
        expect(setSpy).not.toHaveBeenCalled();
    });
});
