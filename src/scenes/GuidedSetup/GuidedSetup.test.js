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

const tenantId = "tenantId";

const whoami = new models.User({
    displayName: "test user",
    tenantId,
});

const preloadedState = {
    guidedSetupOpen: true,
    whoami: { user: whoami },
    tenantId,
};

describe("GuidedSetup", () => {
    const RealDate = Date;
    const isoDate = "2021-11-29T23:24:58.987Z";
    const dateString = "2021-11-29";
    const timeStrings = { timeOfCall: isoDate, dateCreated: dateString };

    function mockDate() {
        global.Date = class extends RealDate {
            constructor() {
                super();
                return new RealDate(isoDate);
            }
        };
    }

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

    beforeEach(async () => {
        await DataStore.save(whoami);
        mockDate();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        global.Date = RealDate;
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
            createdBy: mockWhoami,
            status: tasksStatus.new,
            establishmentLocation: null,
            requesterContact: {
                name: "",
                telephoneNumber: "",
            },
            tenantId,
        });

        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: mockWhoami,
            role: userRoles.coordinator,
            tenantId,
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
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                ...timeStrings,
                id: expect.any(String),
            })
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(2, {
                ...mockAssignment,
                id: expect.any(String),
                task: {
                    ...mockTask,
                    ...timeStrings,
                    id: expect.any(String),
                },
            })
        );
    });

    test("setting the contact details and priority", async () => {
        const mockWhoami = new models.User({
            displayName: "test user",
            tenantId,
        });
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            establishmentLocation: null,
            createdBy: mockWhoami,
            priority: priorities.high,
            status: tasksStatus.new,
            requesterContact: {
                name: "Someone Person",
                telephoneNumber: "01234567890",
            },
            tenantId,
        });

        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: mockWhoami,
            role: userRoles.coordinator,
            tenantId,
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
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                id: expect.any(String),
                ...timeStrings,
            })
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(2, {
                ...mockAssignment,
                id: expect.any(String),
                task: {
                    ...mockTask,
                    id: expect.any(String),
                    ...timeStrings,
                },
            })
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(9));
    });

    test("adding a comment", async () => {
        const mockComment = new models.Comment({
            body: "This is a comment",
            author: whoami,
            tenantId,
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
            expect(saveSpy).toHaveBeenNthCalledWith(3, {
                ...mockComment,
                id: expect.any(String),
                parentId: expect.any(String),
            })
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(9));
    });

    test("saving the establishment", async () => {
        const mockLocation = await DataStore.save(
            new models.Location({ name: "Test Location", listed: 1, tenantId })
        );
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            createdBy: whoami,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId,
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
            ...timeStrings,
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
            createdBy: whoami,
            priority: null,
            establishmentLocation: null,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId,
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
            ...timeStrings,
            id: expect.any(String),
        });
    });

    test("expand the custom pick up and drop off addresses", async () => {
        const addressFields = [
            "Ward",
            "Line one",
            "Line two",
            "Town",
            "County",
            "Country",
            "Postcode",
        ];

        const contactFields = ["Name", "Telephone"];

        const collapsedShowFields = ["Line one", "Town", "Postcode"];
        const collapsedShowContactFields = ["Name", "Telephone"];

        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/PICK-UP/));
        userEvent.click(
            screen.getByRole("button", {
                name: "pick-up not listed?",
            })
        );
        addressFields
            .filter((l) => !collapsedShowFields.includes(l))
            .forEach((field) => {
                expect(
                    screen.queryByRole("textbox", { name: field })
                ).toBeNull();
            });
        contactFields
            .filter((l) => !collapsedShowContactFields.includes(l))
            .forEach((field) => {
                expect(
                    screen.queryByRole("textbox", { name: field })
                ).toBeNull();
            });
        collapsedShowFields.forEach((field) => {
            expect(
                screen.getByRole("textbox", { name: field })
            ).toBeInTheDocument();
        });
        collapsedShowContactFields.forEach((field) => {
            expect(
                screen.getByRole("textbox", { name: field })
            ).toBeInTheDocument();
        });

        userEvent.click(screen.getByText(/Expand/));

        addressFields.forEach((field) => {
            expect(
                screen.getByRole("textbox", { name: field })
            ).toBeInTheDocument();
        });
        contactFields.forEach((field) => {
            expect(
                screen.getByRole("textbox", { name: field })
            ).toBeInTheDocument();
        });
    });

    test("custom pick up and delivery locations", async () => {
        const mockTask = new models.Task({
            createdBy: whoami,
            establishmentLocation: null,
            priority: null,
            status: models.TaskStatus.NEW,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId,
        });
        const mockLocation = new models.Location({
            listed: 0,
            line1: "Test Line 1",
            contact: {
                emailAddress: "",
                name: "Test Name",
                telephoneNumber: "01234567890",
            },
            county: "Test County",
            line2: "Test Line 2",
            postcode: "TE1 1ST",
            town: "Test Town",
            ward: "Test Ward",
            name: "",
            tenantId,
        });
        const mockLocation2 = new models.Location({
            listed: 0,
            line1: "Another Test Line 1",
            contact: {
                emailAddress: "",
                name: "Another Test Name",
                telephoneNumber: "09876543210",
            },
            county: "Another Test County",
            line2: "Another Test Line 2",
            postcode: "TE2 2ST",
            town: "Another Test Town",
            ward: "Another Test Ward",
            name: "",
            tenantId,
        });
        const addressFields = {
            ward: "Ward",
            line1: "Line one",
            line2: "Line two",
            town: "Town",
            county: "County",
            country: "Country",
            postcode: "Postcode",
        };
        const contactFields = {
            name: "Name",
            telephoneNumber: "Telephone",
        };

        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        userEvent.click(screen.getByText(/PICK-UP/));
        userEvent.click(
            screen.getByRole("button", {
                name: "pick-up not listed?",
            })
        );
        userEvent.click(screen.getByText("Expand to see more"));

        Object.entries(addressFields).forEach(([key, label]) => {
            userEvent.type(
                screen.getByRole("textbox", { name: label }),
                mockLocation[key]
            );
        });
        Object.entries(contactFields).forEach(([key, label]) => {
            userEvent.type(
                screen.getByRole("textbox", { name: label }),
                mockLocation.contact[key]
            );
        });
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(
            () => {
                expect(screen.queryByRole("button", { name: "OK" })).toBeNull();
            },
            { timeout: 10000 }
        );
        userEvent.click(
            screen.getByRole("button", {
                name: "delivery not listed?",
            })
        );
        userEvent.click(screen.getAllByText(/Expand/)[1]);

        Object.entries(addressFields).forEach(([key, label]) => {
            userEvent.type(
                screen.getByRole("textbox", { name: label }),
                mockLocation2[key]
            );
        });
        Object.entries(contactFields).forEach(([key, label]) => {
            userEvent.type(
                screen.getByRole("textbox", { name: label }),
                mockLocation2.contact[key]
            );
        });
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(
            () => {
                expect(screen.queryByRole("button", { name: "OK" })).toBeNull();
            },
            { timeout: 10000 }
        );
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(4);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation2,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            ...timeStrings,
            id: expect.any(String),
            pickUpLocation: {
                ...mockLocation,
                id: expect.any(String),
            },
            dropOffLocation: {
                ...mockLocation2,
                id: expect.any(String),
            },
        });
    }, 40000);

    test("a custom establishment", async () => {
        const mockLocation = new models.Location({
            name: "Test Location",
            listed: 0,
            tenantId,
        });
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            createdBy: whoami,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId,
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
            expect(saveSpy).toHaveBeenCalledTimes(3);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            establishmentLocation: { ...mockLocation, id: expect.any(String) },
            ...timeStrings,
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
            createdBy: whoami,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId,
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
                name: /not listed?/,
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
            ...timeStrings,
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
            createdBy: whoami,
            priority: null,
            establishmentLocation: mockLocation,
            status: tasksStatus.new,
            requesterContact: {
                name: "",
                telephoneNumber: mockLocation.contact.telephoneNumber,
            },
            tenantId,
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
            ...timeStrings,
            id: expect.any(String),
        });
    });

    test("adding item data", async () => {
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            createdBy: whoami,
            priority: null,
            establishmentLocation: null,
            status: tasksStatus.new,
            requesterContact: { name: "", telephoneNumber: "" },
            tenantId,
        });

        const mockDeliverableType = new models.DeliverableType({
            label: "some item",
            tenantId,
            disabled: 0,
            defaultUnit: models.DeliverableUnit.ITEM,
        });
        const mockDeliverableType2 = new models.DeliverableType({
            label: "another thing",
            tenantId,
            disabled: 0,
            defaultUnit: models.DeliverableUnit.GRAM,
        });
        const mockDeliverable = new models.Deliverable({
            deliverableType: mockDeliverableType,
            task: mockTask,
            count: 3,
            tenantId,
            unit: models.DeliverableUnit.ITEM,
        });
        const mockDeliverable2 = new models.Deliverable({
            deliverableType: mockDeliverableType2,
            task: mockTask,
            count: 1,
            tenantId,
            unit: models.DeliverableUnit.GRAM,
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
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                id: expect.any(String),
                ...timeStrings,
            })
        );
        await waitFor(() =>
            expect(querySpy).toHaveBeenNthCalledWith(6, models.DeliverableType)
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(4);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable,
            id: expect.any(String),
            task: {
                ...mockTask,
                id: expect.any(String),
                ...timeStrings,
            },
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable2,
            id: expect.any(String),
            task: {
                ...mockTask,
                id: expect.any(String),
                ...timeStrings,
            },
        });
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
            tenantId,
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
            name: /not listed?/,
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

    test("change the time of call", async () => {
        const mockWhoami = new models.User({
            displayName: "test user",
        });
        const mockTask = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            createdBy: mockWhoami,
            status: tasksStatus.new,
            establishmentLocation: null,
            requesterContact: {
                name: "",
                telephoneNumber: "",
            },
            tenantId,
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
        const textBox = screen.getByRole("textbox", {
            name: "Time of call",
        });
        expect(textBox).toHaveValue("11/29/2021 23:24");
        userEvent.type(textBox, "{backspace}");
        userEvent.type(textBox, "{backspace}");
        userEvent.type(textBox, "00");
        expect(textBox).toHaveValue("11/29/2021 23:00");
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(9);
        });
        expect(querySpy).toHaveBeenCalledWith(models.User, mockWhoami.id);
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                ...timeStrings,
                timeOfCall: "2021-11-29T23:00:00.000Z",
                id: expect.any(String),
            })
        );
    });

    test("disable save button when time of call is empty", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        const saveButton = screen.getByRole("button", {
            name: "Save to dashboard",
        });
        const textBox = screen.getByRole("textbox", {
            name: "Time of call",
        });
        expect(textBox).toBeEnabled();
        expect(saveButton).toBeEnabled();
        userEvent.type(textBox, "{backspace}");
        userEvent.type(textBox, "{backspace}");
        userEvent.type(textBox, "{backspace}");
        userEvent.clear(textBox);
        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        });
    });

    test.skip("disable save button when time of call is invalid", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        const saveButton = screen.getByRole("button", {
            name: "Save to dashboard",
        });
        const textBox = screen.getByRole("textbox", {
            name: "Time of call",
        });
        userEvent.click(textBox);
        expect(textBox).toBeEnabled();
        expect(saveButton).toBeEnabled();
        userEvent.type(textBox, "{backspace}");
        userEvent.type(textBox, "{backspace}");
        userEvent.type(textBox, "{backspace}");
        // this very clearly is an invalid date
        // and when using the browser the button is disabled with this exact string
        // but the test still shows the button as enabled
        expect(textBox).toHaveValue("11/29/2021 2");
        await waitFor(() => {
            expect(saveButton).toBeDisabled();
        });
    });
});
