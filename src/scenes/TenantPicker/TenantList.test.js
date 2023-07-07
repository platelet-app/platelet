import TenantList from "./TenantList";
import Amplify from "aws-amplify";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fakeConfigData = `{"test":"test"}`;
const fakeAmplifyConfig = {
    someData: "someValue",
    another: "value",
};

jest.mock(
    "../../aws-exports",
    () => {
        return {
            default: fakeAmplifyConfig,
        };
    },
    { virtual: true }
);

describe("TenantList", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        localStorage.clear();
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });
    it("lists the tenants", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        const fakeItems = [
            { id: 1, name: "Tenant 1" },
            { id: 2, name: "Tenant 2" },
        ];
        const querySpy = jest.spyOn(global, "fetch").mockResolvedValue({
            json: () =>
                Promise.resolve({
                    data: { listTenants: { items: fakeItems } },
                }),
        });
        render(<TenantList />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(screen.getByText("Tenant 1")).toBeInTheDocument();
        expect(screen.getByText("Tenant 2")).toBeInTheDocument();
    });

    it("failure while listing the tenants", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        const querySpy = jest
            .spyOn(global, "fetch")
            .mockRejectedValue(new Error());
        render(<TenantList />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(
            screen.getByText(
                "There was an error while retrieving the available teams."
            )
        ).toBeInTheDocument();
    });

    test("clicking and configuring a tenant", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        const fakeItems = [
            { id: "someId", name: "Tenant 1" },
            { id: "someId2", name: "Tenant 2" },
        ];
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const querySpy = jest
            .spyOn(global, "fetch")
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        data: { listTenants: { items: fakeItems } },
                    }),
            })
            .mockResolvedValueOnce(
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            data: {
                                getTenant: {
                                    id: "someId",
                                    name: "Tenant 1",
                                    config: fakeConfigData,
                                    version: "1",
                                },
                            },
                        }),
                })
            );
        const setupComplete = jest.fn();
        const localStorageSpy = jest.spyOn(Storage.prototype, "setItem");
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        const tenantItem = screen.getByText("Tenant 1");
        expect(tenantItem).toBeInTheDocument();
        userEvent.click(tenantItem);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const parsedConfig = JSON.parse(fakeConfigData);
        await waitFor(() => {
            expect(amplifySpy).toHaveBeenCalledWith(parsedConfig);
        });
        expect(localStorageSpy).toHaveBeenCalledWith(
            "amplifyConfig",
            fakeConfigData
        );
        expect(localStorageSpy).toHaveBeenCalledWith("tenantName", "Tenant 1");
        expect(localStorageSpy).toHaveBeenCalledWith("tenantVersion", "1");
        expect(localStorageSpy).toHaveBeenCalledWith("tenantId", "someId");
        expect(setupComplete).toHaveBeenCalled();
    });

    test("configuring with an existing config", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        jest.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        data: { listTenants: { items: [] } },
                    }),
            })
            .mockResolvedValue(
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            data: {
                                getTenant: {
                                    id: "someId",
                                    name: "Tenant 1",
                                    config: fakeConfigData,
                                    version: "1",
                                },
                            },
                        }),
                })
            );
        const localStorageSetSpy = jest.spyOn(Storage.prototype, "setItem");
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const setupComplete = jest.fn();
        const localStorageSpy = jest
            .spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce("1")
            .mockReturnValue(fakeConfigData);
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(localStorageSpy).toHaveBeenCalled();
        });
        const parsedConfig = JSON.parse(fakeConfigData);
        await waitFor(() => {
            expect(amplifySpy).toHaveBeenCalledWith(parsedConfig);
        });
        expect(setupComplete).toHaveBeenCalled();
        expect(localStorageSetSpy).not.toHaveBeenCalledWith(
            "tenantVersion",
            "2"
        );
        expect(localStorageSetSpy).not.toHaveBeenCalledWith(
            "tenantName",
            "Tenant 1"
        );
        expect(localStorageSetSpy).not.toHaveBeenCalledWith(
            "amplifyConfig",
            fakeConfigData
        );
    });

    test("configuring with an existing config, but graphql fails", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        jest.spyOn(global, "fetch").mockRejectedValue(new Error());
        const localStorageSetSpy = jest.spyOn(Storage.prototype, "setItem");
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const setupComplete = jest.fn();
        const localStorageSpy = jest
            .spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce("1")
            .mockReturnValue(fakeConfigData);
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(localStorageSpy).toHaveBeenCalled();
        });
        const parsedConfig = JSON.parse(fakeConfigData);
        await waitFor(() => {
            expect(amplifySpy).toHaveBeenCalledWith(parsedConfig);
        });
        expect(setupComplete).toHaveBeenCalled();
        expect(localStorageSetSpy).not.toHaveBeenCalledWith(
            "tenantVersion",
            "2"
        );
        expect(localStorageSetSpy).not.toHaveBeenCalledWith(
            "tenantName",
            "Tenant 1"
        );
        expect(localStorageSetSpy).not.toHaveBeenCalledWith(
            "amplifyConfig",
            fakeConfigData
        );
    });

    test("configuring with an existing config, but it doesn't exist", async () => {
        const fakeItems = [{ id: "someId", name: "Tenant 1" }];
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        jest.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        data: { listTenants: { items: fakeItems } },
                    }),
            })
            .mockRejectedValueOnce(new Error());
        const localStorageRemoveSpy = jest.spyOn(
            Storage.prototype,
            "removeItem"
        );
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const setupComplete = jest.fn();
        const localStorageSpy = jest
            .spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce("1")
            .mockReturnValue(undefined);
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(localStorageSpy).toHaveBeenCalledTimes(2);
        });
        expect(setupComplete).not.toHaveBeenCalled();
        expect(amplifySpy).not.toHaveBeenCalled();
        expect(localStorageRemoveSpy).toHaveBeenCalledWith("tenantVersion");
        expect(localStorageRemoveSpy).toHaveBeenCalledWith("tenantName");
        expect(localStorageRemoveSpy).toHaveBeenCalledWith("amplifyConfig");
        await waitFor(() => {
            expect(screen.getByText("Tenant 1")).toBeInTheDocument();
        });
    });

    test("update the config when it is out of date", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT =
            "http://localhost:4000/graphql";
        jest.spyOn(global, "fetch")
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        data: { listTenants: { items: [] } },
                    }),
            })
            .mockResolvedValue(
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            data: {
                                getTenant: {
                                    id: "someId",
                                    name: "Tenant 1",
                                    config: fakeConfigData,
                                    version: "2",
                                },
                            },
                        }),
                })
            );
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const setupComplete = jest.fn();
        const localStorageSpy = jest
            .spyOn(Storage.prototype, "getItem")
            .mockReturnValueOnce("someId")
            .mockReturnValueOnce("1")
            .mockReturnValue(fakeConfigData);
        const localStorageSetSpy = jest.spyOn(Storage.prototype, "setItem");
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(localStorageSpy).toHaveBeenCalled();
        });
        const parsedConfig = JSON.parse(fakeConfigData);
        await waitFor(() => {
            expect(amplifySpy).toHaveBeenCalledWith(parsedConfig);
        });
        expect(setupComplete).toHaveBeenCalled();
        expect(localStorageSetSpy).toHaveBeenCalledWith("tenantVersion", "2");
        expect(localStorageSetSpy).toHaveBeenCalledWith(
            "tenantName",
            "Tenant 1"
        );
        expect(localStorageSetSpy).toHaveBeenCalledWith(
            "amplifyConfig",
            fakeConfigData
        );
    });

    test("configuring with an existing config from aws-exports", async () => {
        process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT = "undefined";
        jest.spyOn(global, "fetch").mockResolvedValue({});
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const setupComplete = jest.fn();
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(amplifySpy).toHaveBeenCalledWith(fakeAmplifyConfig);
        });
        expect(setupComplete).toHaveBeenCalled();
    });

    test.skip("filter the tenants", async () => {
        // removed this feature for now
        const fakeItems = [
            { id: "someId", name: "First Tenant" },
            { id: "someId2", name: "Something Else" },
        ];
        const querySpy = jest
            .spyOn(global, "fetch")
            .mockResolvedValueOnce({
                json: () =>
                    Promise.resolve({
                        data: { listTenants: { items: fakeItems } },
                    }),
            })
            .mockResolvedValueOnce(
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            data: {
                                getTenant: {
                                    id: "someId",
                                    name: "Tenant 1",
                                    config: fakeConfigData,
                                    version: "1",
                                },
                            },
                        }),
                })
            );
        const setupComplete = jest.fn();
        render(<TenantList onSetupComplete={setupComplete} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        userEvent.type(
            screen.getByRole("textbox", { name: "Search teams" }),
            "First"
        );
        await waitFor(() => {
            expect(screen.getByText("First Tenant")).toBeInTheDocument();
        });
        expect(screen.queryByText("Something Else")).not.toBeInTheDocument();
    });
});
