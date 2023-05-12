import ScheduledTaskOverviewSummary from "./ScheduledTaskOverviewSummary";
import { render, screen, waitFor } from "../../../test-utils";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import userEvent from "@testing-library/user-event";

const tenantId = "tenantId";

describe("ScheduledTaskOverviewSummary", () => {
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
    test.only("change the establishment", async () => {
        const mockEstablishment = await DataStore.save(
            new models.Location({
                tenantId,
                name: "mock establishment",
                listed: 1,
            })
        );
        const mockScheduledTask = await DataStore.save(
            new models.ScheduledTask({
                tenantId,
                cronExpression: "0 0 0 1 1 ? 2021",
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <ScheduledTaskOverviewSummary scheduledTask={mockScheduledTask} />
        );
        userEvent.click(
            screen.getByRole("button", { name: "edit establishment" })
        );
        userEvent.type(screen.getByRole("textbox"), "mock");
        userEvent.click(await screen.findByText("mock establishment"));
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockScheduledTask,
                establishmentLocation: mockEstablishment,
            });
        });
    });
});
