import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import { screen, render, waitFor } from "../../../test-utils";
import TaskLocationDetail from "./TaskLocationDetail";

const tenantId = "test-tenant-id";
const dateCreated = new Date().toISOString().split("T")[0];

describe("TaskLocationDetail", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(screen.queryByTestId("task-location-skeleton")).toBeNull();
        });
    };
    beforeEach(async () => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        await DataStore.clear();
    });

    test("show the address for a task", async () => {
        const location = await DataStore.save(
            new models.Location({
                tenantId,
                ward: "Ward 1",
                line1: "123 Main St",
                postcode: "12345",
                contact: {
                    name: "John Smith",
                    telephoneNumber: "1234567890",
                },
            })
        );
        render(<TaskLocationDetail title="Pick up" locationId={location.id} />);
        screen.getByTestId("task-location-skeleton");
        await finishLoading();
        await screen.findByText("123 Main St");
        screen.getByText("Pick up");
        screen.getByText("Ward 1");
        screen.getByText("12345");
        screen.getByText("John Smith");
        screen.getByText("1234567890");
    });
    test("show the address error", async () => {
        const location = await DataStore.save(
            new models.Location({
                tenantId,
                ward: "Ward 1",
            })
        );
        jest.spyOn(DataStore, "query").mockImplementationOnce(() => {
            throw new Error("error");
        });
        render(<TaskLocationDetail title="Pick up" locationId={location.id} />);
        await finishLoading();
        await screen.findByText("Sorry, something went wrong");
    });
    test("show the address and observe changes", async () => {
        const location = await DataStore.save(
            new models.Location({
                tenantId,
                ward: "Ward 1",
                line1: "123 Main St",
                postcode: "12345",
                contact: {
                    name: "John Smith",
                    telephoneNumber: "1234567890",
                },
            })
        );
        const { component } = render(
            <TaskLocationDetail title="Pick up" locationId={location.id} />
        );
        await finishLoading();
        await screen.findByText("123 Main St");
        await DataStore.save(
            models.Location.copyOf(location, (updated) => {
                updated.line1 = "456 Main St";
                updated.contact = {
                    name: "Jane Smith",
                    telephoneNumber: "0987654321",
                };
            })
        );
        await screen.findByText("456 Main St");
        expect(screen.queryByText("123 Main St")).toBeNull();
        screen.getByText("Jane Smith");
        screen.getByText("0987654321");
        expect(screen.queryByText("John Smith")).toBeNull();
        expect(screen.queryByText("1234567890")).toBeNull();
        component.rerender(
            <TaskLocationDetail title="Pick up" locationId={null} />
        );
        expect(screen.queryByText("456 Main St")).toBeNull();
        const newLocation = await DataStore.save(
            new models.Location({
                tenantId,
                ward: "Ward 1",
            })
        );
        component.rerender(
            <TaskLocationDetail title="Pick up" locationId={newLocation.id} />
        );
        await screen.findByText("Ward 1");
    });
});
