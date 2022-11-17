import TenantList from "./TenantList";
import Amplify from "aws-amplify";
import { render } from "../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const fakeConfigData = `{"test":"test"}`;

describe("TenantList", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        localStorage.clear();
    });
    it("lists the tenants", async () => {
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
        const amplifySpy = jest.spyOn(Amplify, "configure");
        const setupComplete = jest.fn();
        const localStorageSpy = jest
            .spyOn(Storage.prototype, "getItem")
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
    });

    test("filter the tenants", async () => {
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
