import TaskHistoryTaskDialog from "./TaskHistoryTaskDialog";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import * as APITypes from "../../../API";
import * as models from "../../../models";
import { API, DataStore } from "aws-amplify";
import userEvent from "@testing-library/user-event";

const tenantId = "tenantId";

let preloadedState = {
    tenantId,
};

describe("TaskHistoryTaskDialog", () => {
    let mockTask = {};
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
            timeOfCall: "2021-05-01T13:00:00.000Z",
            createdBy: mockWhoami,
            createdAt: "2021-05-01T12:30:00.000Z",
            dateCreated: "2021-05-01",
            timePickedUp: "2021-05-01T13:30:00.000Z",
            timePickedUpSenderName: "pickup name",
            timeDroppedOffRecipientName: "dropoff name",
            timeDroppedOff: "2021-05-01T14:30:00.000Z",
            requesterContact: {
                name: "requester name",
                telephoneNumber: "01234567800",
            },
            timeRiderHome: "2021-05-01T15:30:00.000Z",
            timeCancelled: "2021-05-01T16:30:00.000Z",
            timeRejected: "2021-05-01T17:30:00.000Z",
            riderResponsibility: "someRiderResponsibility",
            priority: APITypes.Priority.HIGH,
            status: APITypes.TaskStatus.COMPLETED,
            assignees: {
                items: [
                    {
                        id: "someAssigneeId",
                        createdAt: "2021-05-01T18:00:00.000Z",
                        assignee: {
                            displayName: "some assignee",
                            profilePicture: {
                                key: "someKey",
                            },
                        },
                    },
                    {
                        id: "someAssigneeId2",
                        createdAt: "2021-05-01T18:15:00.000Z",
                        _deleted: true,
                        assignee: {
                            displayName: "deleted assignee",
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
                        id: "someDeliverableId",
                        count: 1,
                        createdAt: "2021-05-01T18:30:00.000Z",
                        deliverableType: {
                            label: "someDeliverable",
                            icon: APITypes.DeliverableTypeIcon.BUG,
                        },
                    },
                    {
                        id: "anotherDeliverableId",
                        count: 1,
                        _deleted: true,
                        createdAt: "2021-05-01T18:45:00.000Z",
                        deliverableType: {
                            label: "deleted deliverable",
                            icon: APITypes.DeliverableTypeIcon.BUG,
                        },
                    },
                ],
            },
            comments: {
                items: [
                    {
                        id: "someCommentId",
                        createdAt: "2021-05-01T19:30:00.000Z",
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        body: "woo",
                        author: {
                            displayName: "Someone Person",
                            id: mockWhoami.id,
                        },
                    },
                    {
                        id: "anotherCommentId",
                        body: "stuff and things",
                        createdAt: "2021-05-01T20:30:00.000Z",
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        author: {
                            displayName: "Another Person",
                            id: "someUserId",
                        },
                    },
                    {
                        id: "anotherCommentIddddddd",
                        body: "deleted comment",
                        _deleted: true,
                        createdAt: "2021-05-01T20:45:00.000Z",
                        visibility: APITypes.CommentVisibility.EVERYONE,
                        author: {
                            displayName: "Another Person",
                            id: "someUserId",
                        },
                    },
                ],
            },
            _version: 1,
            _deleted: null,
            _lastChangedAt: 1620000000000,
        };
    });

    it("renders", async () => {
        render(<TaskHistoryTaskDialog />);
        await waitFor(() => {
            expect(
                screen.queryByTestId("task-history-dialog-fetching")
            ).toBeNull();
        });
    });

    it("shows task details", async () => {
        API.graphql = jest.fn().mockResolvedValue({
            data: {
                getTask: mockTask,
            },
        });
        render(<TaskHistoryTaskDialog taskId="someId" />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(
                screen.queryByTestId("task-history-dialog-fetching")
            ).toBeNull();
        });
        expect(screen.getByText(APITypes.Priority.HIGH)).toBeInTheDocument();
        expect(screen.getByText("someRiderResponsibility")).toBeInTheDocument();
        expect(screen.getByText("01/05/2021, 13:00")).toBeInTheDocument();
        expect(screen.getByText("01234567800")).toBeInTheDocument();
        expect(screen.getByText("requester name")).toBeInTheDocument();
    });

    it("displays a timeline", async () => {
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                getTask: mockTask,
            },
        });
        render(<TaskHistoryTaskDialog taskId="someId" />);
        await waitFor(() => {
            expect(
                screen.queryByTestId("task-history-dialog-fetching")
            ).toBeNull();
        });
        userEvent.click(screen.getByText("Timeline/Comments"));
        const timeChecks = [
            screen.getByText("13:30"),
            screen.getByText("14:30"),
            screen.getByText("15:30"),
            screen.getByText("16:30"),
            screen.getByText("17:30"),
            screen.getByText("18:00"),
            screen.getByText("18:30"),
            screen.getByText("19:30"),
            screen.getByText("20:30"),
        ];

        let previous = screen.getByText("12:30");
        for (const timeCheck of timeChecks) {
            expect(previous.compareDocumentPosition(timeCheck)).toBe(4);
        }
        expect(screen.getByText("someDisplayName")).toBeInTheDocument();
        expect(screen.getByText("some assignee")).toBeInTheDocument();
        expect(screen.getByText("woo")).toBeInTheDocument();
        expect(screen.getByText("stuff and things")).toBeInTheDocument();
        expect(screen.getByText("Another Person")).toBeInTheDocument();
        expect(screen.getByText("Someone Person")).toBeInTheDocument();
        expect(screen.getByText("someDeliverable x 1")).toBeInTheDocument();
        expect(screen.getByText(/pickup name/)).toBeInTheDocument();
        expect(screen.getByText(/dropoff name/)).toBeInTheDocument();
        expect(screen.queryByText("deleted comment")).toBeNull();
        expect(screen.getByText("deleted deliverable x 1")).toBeInTheDocument();
        expect(screen.getByText("deleted assignee")).toBeInTheDocument();
        const variables = graphqlSpy.mock.calls[0][0].variables;
        expect(variables).toEqual({ id: "someId" });
    });

    test("error handling", async () => {
        jest.spyOn(API, "graphql").mockRejectedValueOnce(
            new Error("some error")
        );
        render(<TaskHistoryTaskDialog taskId="someId" />);
        await waitFor(() => {
            expect(
                screen.queryByTestId("task-history-dialog-fetching")
            ).toBeNull();
        });
        expect(
            screen.getByText("Sorry, something went wrong.")
        ).toBeInTheDocument();
    });
    test("not found", async () => {
        jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                getTask: null,
            },
        });
        render(<TaskHistoryTaskDialog taskId="someId" />);
        await waitFor(() => {
            expect(
                screen.queryByTestId("task-history-dialog-fetching")
            ).toBeNull();
        });
        expect(screen.getByText("Task not found.")).toBeInTheDocument();
    });
});
