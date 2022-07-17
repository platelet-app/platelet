import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { render } from "../../test-utils";
import { GuidedSetup } from "./GuidedSetup";
import * as models from "../../models";
import { DataStore } from "aws-amplify";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import {
    commentVisibility,
    priorities,
    tasksStatus,
    userRoles,
} from "../../apiConsts";

const whoami = new models.User({
    displayName: "test user",
    tenantId: "test-tenant",
});

const preloadedState = {
    guidedSetupOpen: true,
    whoami: { user: whoami },
    tenantId: "test-tenant",
};

describe("GuidedSetup", () => {
    beforeEach(async () => {
        await DataStore.save(whoami);
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        const users = await DataStore.query(models.User);
        const tasks = await DataStore.query(models.Task);
        const comments = await DataStore.query(models.Comment);
        const assignments = await DataStore.query(models.TaskAssignee);
        const locations = await DataStore.query(models.Location);
        await Promise.all(
            [...users, ...tasks, ...comments, ...assignments, ...locations].map(
                (item) => DataStore.delete(item)
            )
        );
    });

    it("renders correctly", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(4);
        });
        expect(querySpy).toHaveBeenCalledWith(
            models.DeliverableType,
            expect.any(Function),
            { sort: expect.any(Function) }
        );
        expect(querySpy).toHaveBeenCalledWith(
            models.Location,
            expect.any(Function)
        );
    });

    test("the tabs switch properly", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
        userEvent.click(screen.getByText(/ITEMS/));
        expect(screen.getByText("What is being delivered?")).toBeVisible();
        userEvent.click(screen.getByText(/PICK-UP/));
        expect(screen.getByText("Where from?")).toBeVisible();
        expect(screen.getByText("Where to?")).toBeVisible();
        userEvent.click(screen.getByText(/NOTES/));
        expect(screen.getByText("What is the priority?")).toBeVisible();
        expect(
            screen.getByText("Who should the notes be visible to?")
        ).toBeVisible();
        userEvent.click(screen.getByText(/CALLER/));
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
    });

    test("moving step by step with Next/Previous", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        expect(screen.queryByText("Previous")).toBeNull();
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
        userEvent.click(screen.getByText("Next"));
        expect(screen.getByText("Where from?")).toBeVisible();
        expect(screen.getByText("Where to?")).toBeVisible();
        userEvent.click(screen.getByText("Next"));
        expect(screen.getByText("What is being delivered?")).toBeVisible();
        userEvent.click(screen.getByText("Next"));
        expect(
            screen.getByText("Who should the notes be visible to?")
        ).toBeVisible();
        expect(screen.getByText("What is the priority?")).toBeVisible();
        expect(screen.queryByText("Next")).toBeNull();
        userEvent.click(screen.getByText("Previous"));
        expect(screen.getByText("What is being delivered?")).toBeVisible();
        userEvent.click(screen.getByText("Previous"));
        expect(screen.getByText("Where from?")).toBeVisible();
        expect(screen.getByText("Where to?")).toBeVisible();
        userEvent.click(screen.getByText("Previous"));
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
    });

    it("assigns the logged in user as a coordinator", async () => {
        const mockWhoami = new models.User({
            displayName: "test user",
        });
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            status: tasksStatus.new,
            establishmentLocation: null,
            requesterContact: {
                name: "",
                telephoneNumber: "",
            },
            tenantId: "test-tenant",
        });

        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: mockWhoami,
            role: userRoles.coordinator,
        });
        await DataStore.save(mockWhoami);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, {
            preloadedState: { ...preloadedState, whoami: { user: mockWhoami } },
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(4);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(9);
        });
        expect(querySpy).toHaveBeenCalledWith(models.User, mockWhoami.id);
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    ...mockTask,
                    id: expect.any(String),
                    timeOfCall: expect.any(String),
                })
            )
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    ...mockAssignment,
                    id: expect.any(String),
                    task: {
                        ...mockTask,
                        id: expect.any(String),
                        timeOfCall: expect.any(String),
                    },
                })
            )
        );
    });

    test("setting the contact details and priority", async () => {
        const mockWhoami = new models.User({
            displayName: "test user",
            tenantId: "test-tenant",
        });
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            establishmentLocation: null,
            priority: priorities.high,
            status: tasksStatus.new,
            requesterContact: {
                name: "Someone Person",
                telephoneNumber: "01234567890",
            },
            tenantId: "test-tenant",
        });

        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: mockWhoami,
            role: userRoles.coordinator,
            tenantId: "test-tenant",
        });
        await DataStore.save(mockWhoami);

        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, {
            preloadedState: { ...preloadedState, whoami: { user: mockWhoami } },
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.type(
            screen.getByRole("textbox", { name: "Name" }),
            mockTask.requesterContact.name
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Telephone" }),
            mockTask.requesterContact.telephoneNumber
        );
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
            mockTask.requesterContact.name
        );
        userEvent.click(screen.getByText(/PRIORITY/));
        userEvent.click(screen.getByText(priorities.high));
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    ...mockTask,
                    id: expect.any(String),
                    timeOfCall: expect.any(String),
                })
            )
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    ...mockAssignment,
                    id: expect.any(String),
                    task: {
                        ...mockTask,
                        id: expect.any(String),
                        timeOfCall: expect.any(String),
                    },
                })
            )
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(9));
    });

    test("adding a comment", async () => {
        const mockComment = new models.Comment({
            body: "This is a comment",
            author: whoami,
            tenantId: "test-tenant",
            visibility: commentVisibility.everyone,
        });

        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/NOTES/));
        userEvent.type(screen.getByRole("textbox"), mockComment.body);
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );

        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(3);
        });

        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(
                3,
                expect.objectContaining({
                    ...mockComment,
                    id: expect.any(String),
                    parentId: expect.any(String),
                })
            )
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(9));
    });

    test("saving the establishment", async () => {
        const mockLocation = await DataStore.save(
            new models.Location({ name: "Test Location", listed: 1 })
        );
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId: "test-tenant",
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.type(
            screen.getByRole("textbox", { name: "Select establishment" }),
            "Test"
        );
        userEvent.click(screen.getByText(mockLocation.name));
        userEvent.click(screen.getByText(/PICK-UP/));
        expect(screen.queryByText("Same as establishment")).toBeNull();
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            timeOfCall: expect.any(String),
            id: expect.any(String),
        });
    });

    test("clear the establishment", async () => {
        const mockLocation = await DataStore.save(
            new models.Location({ name: "Test Location", listed: 1 })
        );
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            establishmentLocation: null,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId: "test-tenant",
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.type(
            screen.getByRole("textbox", { name: "Select establishment" }),
            "Test"
        );
        userEvent.click(screen.getByText(mockLocation.name));
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            timeOfCall: expect.any(String),
            id: expect.any(String),
        });
    });

    test("a custom establishment", async () => {
        const mockLocation = new models.Location({
            name: "Test Location",
            listed: 0,
        });
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId: "test-tenant",
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));

        userEvent.click(
            screen.getByRole("button", { name: "establishment not listed?" })
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "establishment name" }),
            mockLocation.name
        );
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(screen.queryByTestId("confirmation-ok-button")).toBeNull();
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();

        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            establishmentLocation: { ...mockLocation, id: expect.any(String) },
            timeOfCall: expect.any(String),
            id: expect.any(String),
        });
    });

    test("saving the establishment as the pickup", async () => {
        const mockLocation = await DataStore.save(
            new models.Location({ name: "Test Location", listed: 1 })
        );
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: mockLocation,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId: "test-tenant",
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.type(
            screen.getByRole("textbox", { name: "Select establishment" }),
            "Test"
        );
        userEvent.click(screen.getByText(mockLocation.name));
        userEvent.click(
            screen.getByRole("checkbox", { name: "toggle same as pick-up" })
        );
        userEvent.click(screen.getByText(/PICK-UP/));
        expect(screen.getByText("Same as establishment")).toBeInTheDocument();
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        expect(screen.queryByText("CLEAR")).toBeNull();
        expect(
            await screen.findAllByRole("button", {
                name: "Not listed?",
            })
        ).toHaveLength(1);
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            timeOfCall: expect.any(String),
            id: expect.any(String),
        });
    });

    test("auto fill telephone number from establishment", async () => {
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "Test Location",
                contact: { telephoneNumber: "01234567890" },
                listed: 1,
            })
        );
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: {
                name: "",
                telephoneNumber: mockLocation.contact.telephoneNumber,
            },
            tenantId: "test-tenant",
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.type(
            screen.getByRole("textbox", { name: "Select establishment" }),
            "Test"
        );
        userEvent.click(screen.getByText(mockLocation.name));
        expect(screen.getByRole("textbox", { name: "Telephone" })).toHaveValue(
            mockLocation.contact.telephoneNumber
        );
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(2);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            timeOfCall: expect.any(String),
            id: expect.any(String),
        });
    });

    test("adding item data", async () => {
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            establishmentLocation: null,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId: "test-tenant",
        });

        const mockDeliverableType = new models.DeliverableType({
            label: "some item",
            tenantId: "test-tenant",
            disabled: 0,
        });
        const mockDeliverableType2 = new models.DeliverableType({
            label: "another thing",
            tenantId: "test-tenant",
            disabled: 0,
        });
        const mockDeliverable = new models.Deliverable({
            deliverableType: mockDeliverableType,
            task: mockTask,
            count: 3,
            tenantId: "test-tenant",
        });
        const mockDeliverable2 = new models.Deliverable({
            deliverableType: mockDeliverableType2,
            task: mockTask,
            count: 1,
            tenantId: "test-tenant",
        });

        await DataStore.save(mockDeliverableType);
        await DataStore.save(mockDeliverableType2);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/ITEMS/));
        userEvent.click(screen.getByRole("button", { name: "Add some item" }));
        userEvent.click(screen.getByRole("button", { name: "increment" }));
        userEvent.click(screen.getByRole("button", { name: "increment" }));
        userEvent.click(
            screen.getByRole("button", { name: "Add another thing" })
        );
        // account for debounce
        await new Promise((r) => setTimeout(r, 300));
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    ..._.omit(mockTask, "id"),
                    timeOfCall: expect.any(String),
                })
            )
        );
        await waitFor(() =>
            expect(querySpy).toHaveBeenNthCalledWith(5, models.DeliverableType)
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(4);
        });
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                ...mockDeliverable,
                id: expect.any(String),
                task: {
                    ...mockTask,
                    id: expect.any(String),
                    timeOfCall: expect.any(String),
                },
            })
        );
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                ...mockDeliverable2,
                id: expect.any(String),
                task: {
                    ...mockTask,
                    id: expect.any(String),
                    timeOfCall: expect.any(String),
                },
            })
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(10));
    });

    test("clicking the discard button when nothing has been entered", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(8));
    });

    test("clicking the discard button when contact data has been entered", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        const textBox = screen.getByRole("textbox", { name: "Name" });
        userEvent.type(textBox, "Someone Person");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(8));
    });

    test("clicking the discard button when item data has been entered", async () => {
        const mockDeliverableType = new models.DeliverableType({
            label: "Fake Item",
            tenantId: "test-tenant",
            disabled: 0,
        });
        await DataStore.save(mockDeliverableType);
        const querySpy = jest.spyOn(DataStore, "query");

        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/ITEMS/));
        userEvent.click(screen.getByRole("button", { name: "Add Fake Item" }));
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(8));
    });
    test("clicking the discard button when location data has been entered", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/PICK-UP/));
        const enterManuallyButtons = screen.getAllByRole("button", {
            name: "Not listed?",
        });
        userEvent.click(enterManuallyButtons[0]);
        const textBox = screen.getAllByRole("textbox");
        userEvent.type(textBox[0], "data");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(
            () => {
                expect(screen.queryByRole("button", { name: "OK" })).toBeNull();
            },
            { timeout: 2000 }
        );
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(8));
    });
    test("clicking the discard button when note data has been entered", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/NOTES/));
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, "data");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(8));
    });

    it("disables save and discard buttons when posting", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        expect(
            screen.getByRole("button", { name: "Save to dashboard" })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "Discard" })).toBeDisabled();
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(2));
        expect(
            screen.getByRole("button", { name: "Save to dashboard" })
        ).toBeEnabled();
        expect(screen.getByRole("button", { name: "Discard" })).toBeEnabled();
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(9));
    });
});
