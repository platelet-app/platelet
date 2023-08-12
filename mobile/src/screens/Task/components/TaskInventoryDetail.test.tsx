import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { render, waitFor, screen } from "../../../test-utils";
import TaskInventoryDetail from "./TaskInventoryDetail";

const tenantId = "tenantId";
const dateCreated = new Date().toISOString().split("T")[0];

describe("TaskInventoryDetail", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(screen.queryByTestId("task-inventory-skeleton")).toBeNull();
        });
    };
    beforeAll(async () => {
        jest.useFakeTimers();
    });
    it("shows inventory and updates", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                dateCreated,
                status: models.TaskStatus.ACTIVE,
            })
        );
        const delt1 = await DataStore.save(
            new models.DeliverableType({
                tenantId,
                label: "Test Deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
            })
        );
        const delt2 = await DataStore.save(
            new models.DeliverableType({
                tenantId,
                label: "Another Deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
            })
        );
        const delt3 = await DataStore.save(
            new models.DeliverableType({
                tenantId,
                label: "New Deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
            })
        );
        const firstDeliverable = await DataStore.save(
            new models.Deliverable({
                tenantId,
                task: task,
                deliverableType: delt1,
                count: 4,
                unit: models.DeliverableUnit.ITEM,
            })
        );
        await DataStore.save(
            new models.Deliverable({
                tenantId,
                task: task,
                deliverableType: delt2,
                count: 6,
                unit: models.DeliverableUnit.BOX,
            })
        );
        render(<TaskInventoryDetail taskId={task.id} />);
        screen.getByTestId("task-inventory-skeleton");
        await finishLoading();
        screen.getByText("Test Deliverable");
        screen.getByText("4 x ITEM");
        screen.getByText("Another Deliverable");
        screen.getByText("6 x BOX");
        await DataStore.save(
            models.Deliverable.copyOf(firstDeliverable, (updated) => {
                updated.count = 10;
                updated.unit = models.DeliverableUnit.NONE;
            })
        );
        await waitFor(
            () => {
                screen.getByText("10 x NONE");
            },
            { timeout: 5000 }
        );
        await DataStore.save(
            new models.Deliverable({
                tenantId,
                task: task,
                deliverableType: delt3,
                count: 1,
                unit: models.DeliverableUnit.GRAM,
            })
        );
        await waitFor(
            () => {
                screen.getByText("1 x GRAM");
            },
            { timeout: 5000 }
        );
        screen.getByText("New Deliverable");
    });
    it("empty inventory", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                dateCreated,
                status: models.TaskStatus.ACTIVE,
            })
        );
        render(<TaskInventoryDetail taskId={task.id} />);
        await finishLoading();
        screen.getByText("No items.");
    });
    test("show the inventory error", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                dateCreated,
                status: models.TaskStatus.ACTIVE,
            })
        );
        jest.spyOn(DataStore, "observeQuery").mockImplementationOnce(() => {
            throw new Error("error");
        });
        render(<TaskInventoryDetail taskId={task.id} />);
        await finishLoading();
        screen.getByText("Sorry, something went wrong");
    });
});
