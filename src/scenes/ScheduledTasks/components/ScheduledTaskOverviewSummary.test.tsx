import ScheduledTaskOverviewSummary from "./ScheduledTaskOverviewSummary";
import { render, screen, waitFor } from "../../../test-utils";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import userEvent from "@testing-library/user-event";

const tenantId = "tenantId";

const preloadedState = {
    tenantId,
};

describe("ScheduledTaskOverviewSummary", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        const deliverableTypes = await DataStore.query(models.DeliverableType);
        const deliverables = await DataStore.query(models.Deliverable);
        const scheduledTasks = await DataStore.query(models.ScheduledTask);
        const users = await DataStore.query(models.User);
        for (const item of [
            ...deliverableTypes,
            ...deliverables,
            ...scheduledTasks,
            ...users,
        ]) {
            await DataStore.delete(item);
        }
    });
    it("shows information about the scheduled task", async () => {
        const mockEstablishment = await DataStore.save(
            new models.Location({
                tenantId,
                name: "mock establishment",
            })
        );
        const mockScheduledTask = await DataStore.save(
            new models.ScheduledTask({
                establishmentLocation: mockEstablishment,
                priority: models.Priority.HIGH,
                tenantId,
                requesterContact: {
                    name: "Test Name",
                    telephoneNumber: "0123456789",
                },
                cronExpression: "0 0 0 1 1 ? 2021",
            })
        );
        render(
            <ScheduledTaskOverviewSummary scheduledTask={mockScheduledTask} />
        );
        expect(screen.getByText("Test Name")).toBeInTheDocument();
        expect(screen.getByText("0123456789")).toBeInTheDocument();
        expect(screen.getByText("HIGH")).toBeInTheDocument();
        expect(screen.getByText("mock establishment")).toBeInTheDocument();
    });
    test("change the establishment", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.ADMIN],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const mockEstablishment = await DataStore.save(
            new models.Location({
                tenantId,
                name: "mock establishment",
                listed: 1,
            })
        );
        const mockUnlistedEstablishment = new models.Location({
            tenantId,
            name: "some other establishment",
            listed: 0,
        });
        const mockScheduledTask = await DataStore.save(
            new models.ScheduledTask({
                tenantId,
                cronExpression: "0 0 0 1 1 ? 2021",
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = { tenantId, whoami: { user: whoami } };
        render(
            <ScheduledTaskOverviewSummary scheduledTask={mockScheduledTask} />,
            { preloadedState }
        );
        userEvent.click(
            screen.getByRole("button", { name: "edit establishment" })
        );
        userEvent.type(screen.getByRole("textbox"), "mock");
        userEvent.click(await screen.findByText("mock"));
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                establishmentLocation: mockEstablishment,
            });
        });
        userEvent.click(
            await screen.findByRole("button", { name: "edit establishment" })
        );
        userEvent.click(
            screen.getByRole("button", { name: "establishment not listed?" })
        );
        userEvent.type(screen.getByRole("textbox"), "some other establishment");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                establishmentLocation: {
                    ...mockUnlistedEstablishment,
                    id: expect.any(String),
                },
            });
        });
    });
    test("change the requester contact details", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.ADMIN],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const mockScheduledTask = await DataStore.save(
            new models.ScheduledTask({
                tenantId,
                cronExpression: "0 0 0 1 1 ? 2021",
                requesterContact: {
                    name: "Test Name",
                    telephoneNumber: "0123456789",
                },
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = { tenantId, whoami: { user: whoami } };
        render(
            <ScheduledTaskOverviewSummary scheduledTask={mockScheduledTask} />,
            { preloadedState }
        );
        userEvent.click(
            screen.getByRole("button", { name: "edit caller details" })
        );
        userEvent.click(screen.getByText("Test Name"));
        const nameBox = screen.getByRole("textbox", { name: "Name" });
        userEvent.clear(nameBox);
        userEvent.type(nameBox, "new name");
        userEvent.type(nameBox, "{enter}");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                requesterContact: {
                    name: "new name",
                    telephoneNumber: "0123456789",
                },
            });
        });
        expect(screen.queryByRole("textbox", { name: "Name" })).toBeNull();
        expect(screen.getByText("new name")).toBeInTheDocument();
        userEvent.click(screen.getByText("0123456789"));
        const telBox = screen.getByRole("textbox", { name: "Telephone" });
        userEvent.clear(telBox);
        userEvent.type(telBox, "9876543210");
        userEvent.type(telBox, "{enter}");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                requesterContact: {
                    name: "new name",
                    telephoneNumber: "9876543210",
                },
            });
        });
    });
    test("change the priority", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                displayName: "name",
                roles: [models.Role.ADMIN],
                username: "username",
                cognitoId: "cognitoId",
            })
        );
        const mockScheduledTask = await DataStore.save(
            new models.ScheduledTask({
                tenantId,
                cronExpression: "0 0 0 1 1 ? 2021",
                requesterContact: {
                    name: "Test Name",
                    telephoneNumber: "0123456789",
                },
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = { tenantId, whoami: { user: whoami } };
        render(
            <ScheduledTaskOverviewSummary scheduledTask={mockScheduledTask} />,
            { preloadedState }
        );
        userEvent.click(screen.getByRole("button", { name: "HIGH" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                priority: models.Priority.HIGH,
            });
        });
        userEvent.click(screen.getByRole("button", { name: "HIGH" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                priority: null,
            });
        });
    });
});
