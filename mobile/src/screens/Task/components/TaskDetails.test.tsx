import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import { screen, render, waitFor } from "../../../test-utils";
import TaskDetails from "./TaskDetails";

const tenantId = "test-tenant-id";
const dateCreated = new Date().toISOString().split("T")[0];

describe("TaskDetails", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(screen.queryByTestId("task-details-skeleton")).toBeNull();
        });
    };
    beforeEach(async () => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        await DataStore.clear();
    });
    test("show a task and details", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                timeOfCall: "2021-09-01T21:00:00.000Z",
                riderResponsibility: "something",
                priority: models.Priority.LOW,
            })
        );

        render(<TaskDetails taskId={task.id} />);
        screen.getByTestId("task-details-skeleton");
        await finishLoading();
        await screen.findByText("LOW");
        screen.getByText("something");
        screen.getByText("01/09/2021, 21:00");
    });
    test("show a task error", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                timeOfCall: "2021-09-01T21:00:00.000Z",
                riderResponsibility: "something",
                priority: models.Priority.LOW,
            })
        );
        jest.spyOn(DataStore, "query").mockImplementationOnce(() => {
            throw new Error("error");
        });

        render(<TaskDetails taskId={task.id} />);
        await finishLoading();
        await screen.findByText("Sorry, something went wrong");
    });
});
