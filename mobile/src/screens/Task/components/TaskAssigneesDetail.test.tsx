import { render, screen, waitFor } from "../../../test-utils";
import { DataStore } from "aws-amplify";
import TaskAssigneesDetail from "./TaskAssigneesDetail";
import * as models from "../../../models";

const dateCreated = new Date().toISOString().split("T")[0];
const tenantId = "test-tenant-id";

describe("TaskAssigneesDetail", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(screen.queryByTestId("task-assignees-skeleton")).toBeNull();
        });
    };
    beforeAll(async () => {
        jest.useFakeTimers();
    });
    beforeEach(async () => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        await DataStore.clear();
    });
    it("shows the assignees for a task and responds to changes", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const assignee = await DataStore.save(
            new models.User({
                tenantId,
                name: "test-user",
                displayName: "Test User",
                username: "test-user",
                cognitoId: "test-cognito-id",
                roles: [models.Role.RIDER],
            })
        );
        const assignee2 = await DataStore.save(
            new models.User({
                tenantId,
                name: "test-user2",
                displayName: "Coord user",
                username: "test-user2",
                cognitoId: "test-cognito-id2",
                roles: [models.Role.COORDINATOR],
            })
        );

        const taskAssignee = await DataStore.save(
            new models.TaskAssignee({
                tenantId,
                task,
                assignee,
                role: models.Role.RIDER,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                tenantId,
                task,
                assignee: assignee2,
                role: models.Role.COORDINATOR,
            })
        );
        const lastUser = await DataStore.save(
            new models.User({
                tenantId,
                name: "test-user3",
                displayName: "Last User",
                username: "test-user3",
                cognitoId: "test-cognito-id3",
                roles: [models.Role.RIDER],
            })
        );

        render(<TaskAssigneesDetail taskId={task.id} />);
        screen.getByTestId("task-assignees-skeleton");
        await finishLoading();
        await screen.findByText("Test User");
        screen.getByText("Coord user");
        await DataStore.delete(taskAssignee);
        // this is broken still until the amplify bug is fixed
        //await waitFor(() => {
        //    expect(screen.queryByText("Test User")).toBeNull();
        //});
        await DataStore.save(
            new models.TaskAssignee({
                tenantId,
                task,
                assignee: lastUser,
                role: models.Role.RIDER,
            })
        );
        await waitFor(
            () => {
                screen.getByText("Last User");
            },
            { timeout: 5000 }
        );
    });
    it("task assignees error", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
            })
        );
        const assignee = await DataStore.save(
            new models.User({
                tenantId,
                name: "test-user",
                displayName: "Test User",
                username: "test-user",
                cognitoId: "test-cognito-id",
                roles: [models.Role.RIDER],
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                tenantId,
                task,
                assignee,
                role: models.Role.RIDER,
            })
        );
        jest.spyOn(DataStore, "observeQuery").mockImplementationOnce(() => {
            throw new Error("error");
        });
        render(<TaskAssigneesDetail taskId={task.id} />);
        await finishLoading();
        await screen.findByText("Sorry, something went wrong");
    });
});
