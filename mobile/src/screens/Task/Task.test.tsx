import { DataStore } from "aws-amplify";
import Task from "./Task";
import { render, screen } from "../../test-utils";
import * as models from "../../models";
const dateCreated = new Date().toISOString().split("T")[0];

const tenantId = "test-tenant-id";

describe("Task", () => {
    beforeAll(async () => {
        jest.useFakeTimers();
    });

    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    afterEach(async () => {
        await DataStore.clear();
    });

    test("show a task", async () => {
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const route = { params: { taskId: task.id } };
        const navigation = { setOptions: jest.fn() };
        render(<Task route={route} navigation={navigation} />);
        await screen.findByText("LOW");
    });
    test("task not found", async () => {
        const route = { params: { taskId: "fakeId" } };
        const navigation = { setOptions: jest.fn() };
        render(<Task route={route} navigation={navigation} />);
        await screen.findByText("Not Found");
    });
    test("task error", async () => {
        const route = { params: { taskId: "fakeId" } };
        const navigation = { setOptions: jest.fn() };
        jest.spyOn(DataStore, "query").mockImplementationOnce(() => {
            throw new Error("error");
        });
        render(<Task route={route} navigation={navigation} />);
        await screen.findByText("Sorry, something went wrong");
    });
});
