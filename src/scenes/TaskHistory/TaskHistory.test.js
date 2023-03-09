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

    beforeAll(async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "someDisplayName",
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
                getTasksByTenantId: {
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
        expect(screen.getByText("pickup name")).toBeInTheDocument();
        expect(
            screen.getByText(
                "pickup ward, pickup line1, pickup town, pickup postcode"
            )
        ).toBeInTheDocument();
        expect(screen.getByText("dropoff name")).toBeInTheDocument();
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
              "endDate": "2021-11-29T23:24:58.987Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
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
                    getTasksByTenantId: {
                        items: [mockTask],
                        nextToken: "someNextToken",
                        startedAt: 1620000000000,
                    },
                },
            })
            .mockResolvedValueOnce({
                data: {
                    getTasksByTenantId: {
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
              "endDate": "2021-11-29T23:24:59.137Z",
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
              "endDate": "2021-11-29",
              "limit": 20,
              "nextToken": "someNextToken",
              "sortDirection": "DESC",
              "startDate": "2000-01-01",
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
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                getTasksByTenantId: {
                    items: [mockTask, secondTask],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        render(<TaskHistory />, { preloadedState });
        await waitFor(() => {
            expect(screen.queryByTestId("task-history-skeleton")).toBeNull();
        });
        expect(await screen.findByText("COMPLETED")).toBeInTheDocument();
        expect(screen.getByText("PICKED UP")).toBeInTheDocument();
        expect(graphqlSpy).toHaveBeenCalledTimes(1);
        const graphqlSpyCallArguments =
            graphqlSpy.mock.calls[0][0]["variables"];
        expect(graphqlSpyCallArguments).toMatchInlineSnapshot(`
            Object {
              "endDate": "2021-11-29T23:24:59.437Z",
              "limit": 20,
              "sortDirection": "DESC",
              "startDate": "2000-01-01T00:00:00.000Z",
              "tenantId": "testTenantId",
            }
        `);
        userEvent.click(
            screen.getByTestId("task-history-sort-direction-select")
        );
        userEvent.click(screen.getByText("Oldest"));
        await waitFor(() => {
            expect(graphqlSpy).toHaveBeenCalledTimes(2);
        });
        const graphqlSpyCallArguments2 =
            graphqlSpy.mock.calls[1][0]["variables"];
        expect(graphqlSpyCallArguments2).toMatchInlineSnapshot();
    });
});
