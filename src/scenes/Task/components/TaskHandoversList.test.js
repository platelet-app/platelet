import { DataStore } from "aws-amplify";
import { render } from "../../../test-utils";
import * as models from "../../../models";
import TaskHandoversList from "./TaskHandoversList";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const tenantId = "tenantId";

const preloadedState = {
    tenantId,
};

describe("TaskHandoversList", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        const existingHandovers = await DataStore.query(models.Handover);
        const existingTasks = await DataStore.query(models.Task);
        const existingUsers = await DataStore.query(models.User);
        await Promise.all(
            [...existingUsers, ...existingTasks, ...existingHandovers].map(
                (i) => DataStore.delete(i)
            )
        );
    });
    it("should display the handovers", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                tenantId,
            })
        );
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "Test Location",
                line1: "Test Line 1",
                tenantId,
            })
        );
        const mockLocation2 = await DataStore.save(
            new models.Location({
                name: "Test Location",
                line1: "Test Line 2",
                tenantId,
            })
        );
        await DataStore.save(
            new models.Handover({
                task: mockTask,
                handoverLocation: mockLocation,
                tenantId,
            })
        );
        await DataStore.save(
            new models.Handover({
                task: mockTask,
                handoverLocation: mockLocation2,
                tenantId,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskHandoversList taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Handover);
        });
        expect(screen.getByText(mockLocation.line1)).toBeInTheDocument();
        expect(screen.getByText(mockLocation2.line1)).toBeInTheDocument();
    });

    it("add a new handover", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                tenantId,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskHandoversList taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        userEvent.click(screen.getByRole("button", { name: "Add handover" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                id: expect.any(String),
                task: mockTask,
                tenantId,
            });
        });
        expect(
            await screen.findByRole("combobox", { name: "Search locations..." })
        ).toBeInTheDocument();
    });

    test("the observer reacts to new handovers", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                tenantId,
            })
        );
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "Test Location",
                line1: "Test Line 1",
                tenantId,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskHandoversList taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        await DataStore.save(
            new models.Handover({
                task: mockTask,
                handoverLocation: mockLocation,
            })
        );
        expect(await screen.findByText(mockLocation.line1)).toBeInTheDocument();
    });

    test("the observer reacts to updated handovers", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                tenantId,
            })
        );
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "Test Location",
                line1: "Test Line 1",
                tenantId,
            })
        );
        const mockHandover = await DataStore.save(
            new models.Handover({
                task: mockTask,
                tenantId,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskHandoversList taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(
            await screen.findByRole("combobox", { name: "Search locations..." })
        ).toBeInTheDocument();
        await DataStore.save(
            models.Handover.copyOf(mockHandover, (updated) => {
                updated.handoverLocation = mockLocation;
            })
        );
        expect(await screen.findByText(mockLocation.line1)).toBeInTheDocument();
    });

    test("the observer reacts to deleted handovers", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                tenantId,
            })
        );
        const mockLocation = await DataStore.save(
            new models.Location({
                name: "Test Location",
                line1: "Test Line 1",
                tenantId,
            })
        );
        const mockHandover = await DataStore.save(
            new models.Handover({
                task: mockTask,
                handoverLocation: mockLocation,
                tenantId,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskHandoversList taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(await screen.findByText(mockLocation.line1)).toBeInTheDocument();
        await DataStore.delete(mockHandover);
        await waitFor(() => {
            expect(screen.queryByText(mockLocation.line1)).toBeNull();
        });
    });

    test("failure to get handovers", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                tenantId,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        querySpy.mockRejectedValueOnce("Test error");
        render(<TaskHandoversList taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        expect(
            await screen.findByText("Something went wrong.")
        ).toBeInTheDocument();
    });
});
