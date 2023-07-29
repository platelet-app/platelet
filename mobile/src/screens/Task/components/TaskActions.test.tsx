import TaskActions from "./TaskActions";
import { render, fireEvent, waitFor, screen } from "../../../test-utils";

import { DataStore } from "aws-amplify";
import * as models from "../../../models";
const dateCreated = new Date().toISOString().split("T")[0];
const tenantId = "test-tenant-id";

describe("TaskActions", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Cancelled" })
            ).toBeEnabled();
        });
    };
    beforeEach(async () => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        await DataStore.clear();
    });
    test("render with a task", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        render(<TaskActions taskId={task.id} />);
        await finishLoading();
    });
});
