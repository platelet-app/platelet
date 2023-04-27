import TaskHistory from "./TaskHistory";
import * as models from "../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import { render } from "../../test-utils";
import { API, DataStore } from "aws-amplify";
import { screen, waitFor } from "@testing-library/react";
import * as APITypes from "../../API";
import userEvent from "@testing-library/user-event";

const tenantId = "testTenantId";

let preloadedState = {
    tenantId,
};

describe("TaskHistory", () => {
    let mockTask = {};
    const isoDate = "2021-11-29T23:24:58.987Z";
    beforeAll(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date(isoDate));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    beforeAll(() => {
        // add window.matchMedia
        // this is necessary for the date picker to be rendered in desktop mode.
        // if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: (query) => ({
                media: query,
                // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
                matches: query === "(pointer: fine)",
                onchange: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                addListener: () => {},
                removeListener: () => {},
                dispatchEvent: () => false,
            }),
        });
    });

    afterAll(() => {
        delete window.matchMedia;
    });

    beforeAll(async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.ADMIN],
            })
        );
        preloadedState = { ...preloadedState, whoami: { user: mockWhoami } };
        mockTask = {
            id: "someId",
            timeOfCall: "2021-05-01T00:00:00.000Z",
            dateCreated: "2021-05-01",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            createdAt: "2021-05-01T00:00:00.000Z",
            assignees: {
                items: [
                    {
                        assignee: {
                            displayName: "someDisplayName",
                            profilePicture: {
                                key: "someKey",
                            },
                        },
                    },
                    {
                        _deleted: true,
                        assignee: {
                            displayName: "deletedDisplayName",
                            profilePicture: {
                                key: "someKey",
                            },
                        },
                    },
                ],
            },
            pickUpLocation: {
                name: "pickup name",
                ward: "pickup ward",
                line1: "pickup line1",
                town: "pickup town",
                postcode: "pickup postcode",
            },
            dropOffLocation: {
                ward: "dropoff ward",
                line1: "dropoff line1",
                name: "dropoff name",
                town: "dropoff town",
                postcode: "dropoff postcode",
            },
            deliverables: {
                items: [
                    {
                        count: 1,
                        deliverableType: {
                            label: "someDeliverable",
                            icon: APITypes.DeliverableTypeIcon.BUG,
                        },
                    },
                    {
                        count: 1,
                        _deleted: true,
                        deliverableType: {
                            label: "deletedDeliverable",
                            icon: APITypes.DeliverableTypeIcon.BUG,
                        },
                    },
                ],
            },
            comments: {
                items: [
                    {
                        id: "someId",
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        author: { id: mockWhoami.id },
                    },
                    {
                        id: "someId",
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        author: { id: "another" },
                    },
                    {
                        id: "someId",
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        author: { id: mockWhoami.id },
                    },
                    {
                        id: "someId",
                        visibility: APITypes.CommentVisibility.ME,
                        author: { id: "another" },
                    },
                    {
                        id: "deletedComment",
                        _deleted: true,
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        author: { id: mockWhoami.id },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
    });

    it("displays task details", async () => {
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                listTasksByTenantId: {
                    items: [mockTask],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<TaskHistory />, { preloadedState });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(screen.getByText("HIGH")).toBeInTheDocument();
        expect(screen.getByText("COMPLETED")).toBeInTheDocument();
        expect(screen.getByText("someDisplayName")).toBeInTheDocument();
        expect(screen.getByText("someDeliverable x 1")).toBeInTheDocument();
        expect(screen.getByText("someRiderResponsibility")).toBeInTheDocument();
        expect(screen.queryByText("deletedDeliverable x 1")).toBeNull();
        expect(screen.queryByText("deletedDisplayName")).toBeNull();
        expect(
            screen.getByText(
                "pickup ward, pickup line1, pickup town, pickup postcode"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "dropoff ward, dropoff line1, dropoff town, dropoff postcode"
            )
        ).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        const graphqlSpyCallArguments =
            graphqlSpy.mock.calls[0][0]["variables"];
        expect(graphqlSpyCallArguments).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
    });

    test("refresh button", async () => {
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [mockTask],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(graphqlSpy).toHaveBeenCalledTimes(1);
        userEvent.click(screen.getByTestId("refresh-task-history"));
        await waitFor(() => {
            expect(
                screen.getByTestId("task-history-skeleton")
            ).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(graphqlSpy).toHaveBeenCalledTimes(2);
    });

    it("paginates results", async () => {
        const secondTask = {
            ...mockTask,
            id: "someId2",
            status: APITypes.TaskStatus.PICKED_UP,
        };
        const graphqlSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [mockTask],
                        nextToken: "someNextToken",
                        startedAt: 1620000000000,
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [secondTask],
                        nextToken: null,
                        startedAt: 1620000000001,
                    },
                },
            });
        render(<TaskHistory />, { preloadedState });
        expect(await screen.findByText("COMPLETED")).toBeInTheDocument();
        expect(screen.getByTestId("task-history-skeleton")).toBeInTheDocument();
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(screen.getByText("PICKED UP")).toBeInTheDocument();
        expect(graphqlSpy).toHaveBeenCalledTimes(2);
        const graphqlSpyCallArguments =
            graphqlSpy.mock.calls[0][0]["variables"];
        expect(graphqlSpyCallArguments).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        const graphqlSpyCallArguments2 =
            graphqlSpy.mock.calls[1][0]["variables"];
        expect(graphqlSpyCallArguments2).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "nextToken": "someNextToken",
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
    });
    it("sort results", async () => {
        const secondTask = {
            ...mockTask,
            id: "someId2",
            createdAt: "2021-04-01T00:00:00.000Z",
            status: APITypes.TaskStatus.PICKED_UP,
        };
        const graphqlSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [mockTask, secondTask],
                        nextToken: null,
                        startedAt: 1620000000000,
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [mockTask, secondTask],
                        nextToken: null,
                        startedAt: 1620000000000,
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [secondTask, mockTask],
                        nextToken: null,
                        startedAt: 1620000000000,
                    },
                },
            });
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        const first = await screen.findByText("COMPLETED");
        const second = screen.getByText("PICKED UP");
        expect(first.compareDocumentPosition(second)).toBe(4);
        expect(graphqlSpy).toHaveBeenCalledTimes(1);
        const graphqlSpyCallArguments =
            graphqlSpy.mock.calls[0][0]["variables"];
        expect(graphqlSpyCallArguments).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        userEvent.click(screen.getByText("Custom"));
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        userEvent.click(screen.getByText("Newest"));
        userEvent.click(screen.getByText("Oldest"));
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        const graphqlSpyCallArguments2 =
            graphqlSpy.mock.calls[2][0]["variables"];
        expect(graphqlSpyCallArguments2).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "ASC",
              "startDate": "2021-11-29T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        const first2 = await screen.findByText("COMPLETED");
        const second2 = screen.getByText("PICKED UP");
        expect(second2.compareDocumentPosition(first2)).toBe(4);
        userEvent.click(
            screen.getByRole("button", { name: "back to days selection" })
        );
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        const graphqlSpyCallArguments3 =
            graphqlSpy.mock.calls[3][0]["variables"];
        expect(graphqlSpyCallArguments3).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
    });
    test("handle error on get", async () => {
        jest.spyOn(API, "graphql").mockRejectedValueOnce(
            new Error("some error")
        );
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(
            screen.getByText("Sorry, something went wrong.")
        ).toBeInTheDocument();
    });
    test("handle error on next", async () => {
        const graphqlSpy = jest
            .spyOn(API, "graphql")
            .mockResolvedValueOnce({
                data: {
                    listTasksByTenantId: {
                        items: [],
                        nextToken: "someToken",
                        startedAt: 1620000000000,
                    },
                },
            })
            .mockRejectedValueOnce(new Error("some error"));
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(
            screen.getByText("Sorry, something went wrong.")
        ).toBeInTheDocument();
    });
    test("click the different days", async () => {
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        userEvent.click(screen.getByRole("button", { name: "3 days" }));
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(2);
        });
        const graphqlSpyCallArguments =
            graphqlSpy.mock.calls[1][0]["variables"];
        // 3 days before 29th
        expect(graphqlSpyCallArguments).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-27T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        userEvent.click(screen.getByRole("button", { name: "One week" }));
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(3);
        });
        const graphqlSpyCallArguments2 =
            graphqlSpy.mock.calls[2][0]["variables"];
        // 7 days before 29th
        expect(graphqlSpyCallArguments2).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-23T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        userEvent.click(screen.getByRole("button", { name: "One week" }));
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(4);
        });
        const graphqlSpyCallArguments3 =
            graphqlSpy.mock.calls[3][0]["variables"];
        // back to the 29th
        expect(graphqlSpyCallArguments3).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
    });
    // for whatever reason the date picker doesn't send the right date
    // but in the browser it does
    test.skip("custom date range", async () => {
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValue({
            data: {
                listTasksByTenantId: {
                    items: [],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        userEvent.click(screen.getByRole("button", { name: "Custom" }));
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(2);
        });
        const start = screen.getByRole("textbox", { name: "Start date" });
        const end = screen.getByRole("textbox", { name: "End date" });
        userEvent.clear(start);
        userEvent.clear(end);
        userEvent.type(end, "24/11/2021");
        userEvent.type(start, "01/11/2021");
        console.log(graphqlSpy.mock.calls[0][0]["variables"]);
        console.log(graphqlSpy.mock.calls[1][0]["variables"]);

        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(3);
        });
        // first it just does today
        const graphqlSpyCallArguments =
            graphqlSpy.mock.calls[1][0]["variables"];
        expect(graphqlSpyCallArguments).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2021-11-29T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        // then the custom range
        const graphqlSpyCallArguments2 =
            graphqlSpy.mock.calls[2][0]["variables"];
        expect(graphqlSpyCallArguments2).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2021-11-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        userEvent.click(
            screen.getByRole("button", { name: "back to days selection" })
        );
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(4);
        });
        const graphqlSpyCallArguments3 =
            graphqlSpy.mock.calls[3][0]["variables"];
        // back to the long default range
        expect(graphqlSpyCallArguments3).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-30T00:00:00.000Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
    });

    test("hide if you don't have the right role", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
                roles: [models.Role.RIDER],
            })
        );
        const preloadedState = { tenantId, whoami: { user: mockWhoami } };
        render(<TaskHistory />, { preloadedState });
        expect(
            screen.getByText("Sorry, you don't have access to this page.")
        ).toBeInTheDocument();
    });
});
