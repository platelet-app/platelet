import AdminAddScheduledTask from "./AdminAddScheduledTask";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import { DataStore } from "aws-amplify";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

const tenantId = "tenantId";

jest.mock("aws-amplify", () => {
    const Amplify = {
        ...jest.requireActual("aws-amplify"),
        Geo: {
            searchByText: () => Promise.resolve([]),
        },
    };
    return Amplify;
});

describe("AdminAddScheduledTask", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        const users = await DataStore.query(models.User);
        const scheduledTasks = await DataStore.query(models.ScheduledTask);
        const locations = await DataStore.query(models.Location);
        const deliverables = await DataStore.query(models.Deliverable);
        const deliverableTypes = await DataStore.query(models.DeliverableType);
        await Promise.all(
            [
                ...users,
                ...locations,
                ...scheduledTasks,
                ...deliverables,
                ...deliverableTypes,
            ].map((item) => DataStore.delete(item))
        );
    });
    test("add a new scheduled task", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "Test User",
                roles: [models.Role.ADMIN],
                username: "testuser",
                cognitoId: "testuserid",
            })
        );
        const mockListedLocation = await DataStore.save(
            new models.Location({
                tenantId,
                name: "Test Location",
                line1: "Test Line 1",
                line2: "Test Line 2",
                line3: "Test Line 3",
                town: "Test Town",
                county: "Test County",
                postcode: "Test Postcode",
                country: "Test Country",
                listed: 1,
                archived: 0,
            })
        );
        const mockListedLocation2 = await DataStore.save(
            new models.Location({
                tenantId,
                name: "Another Location",
                line1: "Another Line 1",
                line2: "Another Line 2",
                line3: "Another Line 3",
                town: "Another Town",
                county: "Another County",
                postcode: "Another Postcode",
                country: "Another Country",
                listed: 1,
                archived: 0,
            })
        );
        const mockListedLocation3 = await DataStore.save(
            new models.Location({
                tenantId,
                name: "Third Location",
                line1: "Third Line 1",
                line2: "Third Line 2",
                line3: "Third Line 3",
                town: "Third Town",
                county: "Third County",
                postcode: "Third Postcode",
                country: "Third Country",
                listed: 1,
                archived: 0,
            })
        );
        const mockDeliverableType = await DataStore.save(
            new models.DeliverableType({
                label: "Sample",
                defaultUnit: models.DeliverableUnit.ITEM,
                tenantId,
            })
        );
        const mockDeliverableType2 = await DataStore.save(
            new models.DeliverableType({
                label: "Document",
                defaultUnit: models.DeliverableUnit.BOX,
                tenantId,
            })
        );
        const mockScheduledTask = new models.ScheduledTask({
            tenantId,
            requesterContact: {
                name: "Someone Person",
                telephoneNumber: "01234567890",
            },
            establishmentLocation: mockListedLocation,
            pickUpLocation: mockListedLocation2,
            dropOffLocation: mockListedLocation3,
            priority: models.Priority.HIGH,
            cronExpression: "0 18 * * *",
            createdBy: whoami,
        });

        const mockDeliverable = new models.Deliverable({
            tenantId,
            deliverableType: mockDeliverableType,
            orderInGrid: 0,
            unit: models.DeliverableUnit.ITEM,
            scheduledTask: mockScheduledTask,
            count: 2,
        });
        const mockDeliverable2 = new models.Deliverable({
            tenantId,
            orderInGrid: 1,
            deliverableType: mockDeliverableType2,
            unit: models.DeliverableUnit.GRAM,
            scheduledTask: mockScheduledTask,
            count: 1,
        });

        const preloadedState = {
            tenantId,
            whoami: { user: whoami },
        };

        const saveSpy = jest.spyOn(DataStore, "save");

        render(<AdminAddScheduledTask />, { preloadedState });
        const addButton = screen.getByRole("button", {
            name: "Add scheduled task",
        });
        expect(addButton).toBeDisabled();
        userEvent.type(
            screen.getByRole("textbox", { name: "Select establishment" }),
            "Test location"
        );
        userEvent.click(
            await screen.findByRole("option", { name: "Test Location" })
        );
        expect(
            screen.queryByRole("textbox", { name: "Select establishment" })
        ).toBeNull();
        expect(screen.getByText("Test Location")).toBeInTheDocument();
        const nameTextbox = screen.getByRole("textbox", { name: "Name" });
        userEvent.type(nameTextbox, "Someone Person");
        expect(nameTextbox).toHaveValue("Someone Person");
        const telephoneTextbox = screen.getByRole("textbox", {
            name: "Telephone",
        });
        userEvent.type(telephoneTextbox, "01234567890");
        expect(telephoneTextbox).toHaveValue("01234567890");
        userEvent.type(
            screen.getAllByRole("textbox", { name: "Search locations..." })[0],
            "Another Location"
        );
        userEvent.click(
            await screen.findByRole("option", { name: "Another Location" })
        );
        expect(
            screen.getAllByRole("textbox", { name: "Search locations..." })
        ).toHaveLength(1);
        expect(screen.getByText("Another Location")).toBeInTheDocument();
        userEvent.type(
            screen.getAllByRole("textbox", { name: "Search locations..." })[0],
            "Third Location"
        );
        userEvent.click(
            await screen.findByRole("option", { name: "Third Location" })
        );
        expect(
            screen.queryByRole("textbox", { name: "Search locations..." })
        ).toBeNull();
        expect(screen.getByText("Third Location")).toBeInTheDocument();
        // need at least pick up and delivery to be set
        // before enabling the button
        expect(addButton).toBeEnabled();
        expect(screen.getByText("Third Location")).toBeInTheDocument();
        userEvent.click(
            await screen.findByRole("button", { name: "Add Sample" })
        );
        userEvent.click(screen.getByRole("button", { name: "increment" }));
        userEvent.click(screen.getByRole("button", { name: "Add Document" }));
        userEvent.click(
            screen.getByRole("button", { name: "BOX. Click to change" })
        );
        userEvent.click(await screen.findByText("GRAM"));
        userEvent.click(screen.getByText("HIGH"));
        userEvent.click(addButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(3);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockScheduledTask,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable,
            id: expect.any(String),
            scheduledTask: { ...mockScheduledTask, id: expect.any(String) },
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable2,
            id: expect.any(String),
            scheduledTask: { ...mockScheduledTask, id: expect.any(String) },
        });
    });
    test("add a scheduled task with unlisted locations", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "Test User",
                roles: [models.Role.ADMIN],
                username: "testuser",
                cognitoId: "testuserid",
            })
        );
        const mockEstablishmentLocation = new models.Location({
            tenantId,
            name: "Test establishment",
            listed: 0,
        });
        const mockLocation = new models.Location({
            tenantId,
            ward: "Test Ward",
            line1: "Test Line 1",
            town: "Test Town",
            contact: {
                name: "",
                telephoneNumber: "",
                emailAddress: "",
            },
            line2: "",
            name: "",
            postcode: "",
            county: "",
            listed: 0,
        });
        const mockLocation2 = new models.Location({
            tenantId,
            line1: "Another Line 1",
            town: "Another Town",
            contact: {
                name: "",
                telephoneNumber: "",
                emailAddress: "",
            },
            line2: "",
            postcode: "",
            name: "",
            ward: "",
            county: "",
            listed: 0,
        });
        const mockScheduledTask = new models.ScheduledTask({
            tenantId,
            establishmentLocation: mockEstablishmentLocation,
            pickUpLocation: mockLocation,
            dropOffLocation: mockLocation2,
            cronExpression: "0 18 * * *",
            priority: null,
            requesterContact: {
                name: "",
                telephoneNumber: "",
            },
            createdBy: whoami,
        });
        const preloadedState = {
            tenantId,
            whoami: { user: whoami },
        };

        const saveSpy = jest.spyOn(DataStore, "save");
        render(<AdminAddScheduledTask />, { preloadedState });
        userEvent.click(
            screen.getByRole("button", {
                name: "establishment not listed?",
            })
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "establishment name" }),
            `${mockEstablishmentLocation.name}`
        );
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(
            screen.queryByRole("button", {
                name: "establishment not listed?",
            })
        ).toBeNull();
        userEvent.click(
            screen.getByRole("button", {
                name: "pick-up not listed?",
            })
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Ward" }),
            `${mockLocation.ward}`
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Line one" }),
            `${mockLocation.line1}`
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Town" }),
            `${mockLocation.town}`
        );
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(
            screen.queryByRole("button", {
                name: "pick-up not listed?",
            })
        ).toBeNull();
        userEvent.click(
            screen.getByRole("button", {
                name: "deliver not listed?",
            })
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Line one" }),
            `${mockLocation2.line1}`
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Town" }),
            `${mockLocation2.town}`
        );
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(
            screen.queryByRole("button", { name: "deliver not listed?" })
        ).toBeNull();
        userEvent.click(
            screen.getByRole("button", {
                name: "Add scheduled task",
            })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(4);
        });
        console.log(saveSpy.mock.calls);
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockEstablishmentLocation,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockLocation2,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenNthCalledWith(4, {
            ...mockScheduledTask,
            establishmentLocation: {
                ...mockEstablishmentLocation,
                id: expect.any(String),
            },
            pickUpLocation: {
                ...mockLocation,
                id: expect.any(String),
            },
            dropOffLocation: {
                ...mockLocation2,
                id: expect.any(String),
            },
            id: expect.any(String),
        });
    });
    test("add scheduled task failure", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "Test User",
                roles: [models.Role.ADMIN],
                username: "testuser",
                cognitoId: "testuserid",
            })
        );
        const mockListedLocation2 = await DataStore.save(
            new models.Location({
                tenantId,
                name: "Another Location",
                line1: "Another Line 1",
                line2: "Another Line 2",
                line3: "Another Line 3",
                town: "Another Town",
                county: "Another County",
                postcode: "Another Postcode",
                country: "Another Country",
                listed: 1,
                archived: 0,
            })
        );
        const mockListedLocation3 = await DataStore.save(
            new models.Location({
                tenantId,
                name: "Third Location",
                line1: "Third Line 1",
                line2: "Third Line 2",
                line3: "Third Line 3",
                town: "Third Town",
                county: "Third County",
                postcode: "Third Postcode",
                country: "Third Country",
                listed: 1,
                archived: 0,
            })
        );
        new models.ScheduledTask({
            tenantId,
            requesterContact: {
                name: "",
                telephoneNumber: "",
            },
            pickUpLocation: mockListedLocation2,
            dropOffLocation: mockListedLocation3,
            cronExpression: "0 18 * * *",
            createdBy: whoami,
        });

        const preloadedState = {
            tenantId,
            whoami: { user: whoami },
        };

        jest.spyOn(DataStore, "save").mockRejectedValue(
            new Error("test error")
        );

        render(<AdminAddScheduledTask />, { preloadedState });
        userEvent.type(
            screen.getAllByRole("textbox", { name: "Search locations..." })[0],
            "Another Location"
        );
        userEvent.click(
            await screen.findByRole("option", { name: "Another Location" })
        );
        expect(
            screen.getAllByRole("textbox", { name: "Search locations..." })
        ).toHaveLength(1);
        expect(screen.getByText("Another Location")).toBeInTheDocument();
        userEvent.type(
            screen.getAllByRole("textbox", { name: "Search locations..." })[0],
            "Third Location"
        );
        userEvent.click(
            await screen.findByRole("option", { name: "Third Location" })
        );
        expect(
            screen.queryByRole("textbox", { name: "Search locations..." })
        ).toBeNull();
        userEvent.click(
            screen.getByRole("button", { name: "Add scheduled task" })
        );
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
        expect(screen.getByText("Another Location")).toBeInTheDocument();
        expect(screen.getByText("Third Location")).toBeInTheDocument();
    });
    test("don't show if not an admin", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "Test User",
                roles: [models.Role.USER],
                username: "testuser",
                cognitoId: "testuserid",
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };

        render(<AdminAddScheduledTask />, { preloadedState });
        expect(
            screen.getByText("You don't have permission to view this page.")
        ).toBeInTheDocument();
    });
});
