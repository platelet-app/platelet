import { DataStore } from "aws-amplify";
import { render } from "../../../test-utils";
import * as models from "../../../models";
import TaskHandoversList from "./TaskHandoversList";
import { screen, waitFor } from "@testing-library/react";

const tenantId = "tenantId";

const preloadedState = {
    tenantId,
};

describe("TaskHandoversList", () => {
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
            expect(querySpy).toHaveBeenCalledWith(models.Handover);
        });
        expect(screen.getByText(mockLocation.line1)).toBeInTheDocument();
    });
});
