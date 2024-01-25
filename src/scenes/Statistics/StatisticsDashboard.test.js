import React from "react";
import * as models from "../../models";
import { DataStore } from "aws-amplify/";
import StatisticsDashboard from "./StatisticsDashboard";
import { render, screen } from "../../test-utils";
import { API } from "aws-amplify";
import * as APITypes from "../../API";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const tenantId = "tenantId";

let preloadedState = {
    tenantId,
};

describe("StatisticsDashboard", () => {
    const isoDate = "2021-11-29T23:24:58.987Z";
    beforeEach(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date(isoDate));
    });
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });
    it("displays statistics for the current user", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.ADMIN, models.Role.COORDINATOR],
            })
        );
        preloadedState = { ...preloadedState, whoami: { user: mockWhoami } };
        const mockTask = {
            id: "someId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: mockWhoami.id,
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
        const notMyMockTask = {
            id: "anotherId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Not My Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: "someOtherId",
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };

        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [mockTask, notMyMockTask],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<StatisticsDashboard />, { preloadedState });
        expect(await screen.findByText("Rider Name")).toBeInTheDocument();
        expect(screen.queryByText("Coordinator Name")).toBeNull();
        expect(screen.queryByText("Not My Rider Name")).toBeNull();
        expect(graphqlSpy.mock.calls).toMatchSnapshot();
    });
    it("get further pages from graphql", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.ADMIN, models.Role.COORDINATOR],
            })
        );
        preloadedState = { ...preloadedState, whoami: { user: mockWhoami } };
        const mockTask = {
            id: "someId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: mockWhoami.id,
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
        const mockTaskSecond = {
            id: "anotherId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Someone Person",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: mockWhoami.id,
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };

        const graphqlSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [mockTask],
                        nextToken: "something",
                        startedAt: 1620000000000,
                    },
                },
            })
            .mockResolvedValue({
                data: {
                    listTasksByTenantId: {
                        items: [mockTaskSecond],
                        nextToken: null,
                        startedAt: 1620000000000,
                    },
                },
            });
        render(<StatisticsDashboard />, { preloadedState });
        expect(await screen.findByText("Rider Name")).toBeInTheDocument();
        expect(await screen.findByText("Someone Person")).toBeInTheDocument();
        expect(graphqlSpy.mock.calls).toMatchSnapshot();
    });
    it("displays statistics for another user as admin", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.ADMIN, models.Role.COORDINATOR],
            })
        );
        const anotherCoordinator = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "anotherCoordinator",
                roles: [models.Role.COORDINATOR],
                disabled: 0,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        preloadedState = { ...preloadedState, whoami: { user: mockWhoami } };
        const mockTask = {
            id: "someId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: mockWhoami.id,
                            displayName: "Coordinator Name",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
        const notMyMockTask = {
            id: "anotherId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: new Date().toISOString(),
            assignees: {
                items: [
                    {
                        role: models.Role.RIDER,
                        assignee: {
                            id: "someId",
                            displayName: "Not My Rider Name",
                        },
                    },
                    {
                        role: models.Role.COORDINATOR,
                        assignee: {
                            id: anotherCoordinator.id,
                            displayName: anotherCoordinator.displayName,
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };

        jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [mockTask, notMyMockTask],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<StatisticsDashboard />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.type(screen.getByRole("combobox"), "anotherCoordinator");
        userEvent.click(await screen.findByText("anotherCoordinator"));
        expect(
            await screen.findByText("Not My Rider Name")
        ).toBeInTheDocument();
        expect(screen.queryByText("Rider Name")).toBeNull();
    });
    it("change the days", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.ADMIN, models.Role.COORDINATOR],
            })
        );
        preloadedState = { ...preloadedState, whoami: { user: mockWhoami } };

        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<StatisticsDashboard />, { preloadedState });
        const button7Days = screen.getByRole("button", {
            name: "One week",
        });
        expect(button7Days).toHaveAttribute("aria-disabled");
        await waitFor(() => {
            expect(button7Days).not.toHaveAttribute("aria-disabled");
        });
        userEvent.click(button7Days);
        expect(button7Days).toHaveAttribute("aria-disabled");
        await waitFor(() => {
            expect(button7Days).not.toHaveAttribute("aria-disabled");
        });
        expect(graphqlSpy.mock.calls).toMatchSnapshot();
    });
    it("non-admin can't select user", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.COORDINATOR],
            })
        );
        preloadedState = { ...preloadedState, whoami: { user: mockWhoami } };

        jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<StatisticsDashboard />, { preloadedState });
        expect(screen.queryByRole("combobox")).toBeNull();
    });
});
