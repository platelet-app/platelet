import { screen, waitFor } from "@testing-library/react";
import _ from "lodash";
import { render } from "../test-utils";
import DeliverableDetails from "./DeliverableDetails";
import userEvent from "@testing-library/user-event";
import * as models from "../models";
import { DataStore, Predicates } from "aws-amplify";

const preloadedState = {
    tenantId: "tenant-id",
    whoami: {
        user: { displayName: "Test User", roles: [models.Role.COORDINATOR] },
    },
};

const mockData = [
    new models.DeliverableType({
        label: "Sample",
        icon: "BUG",
        defaultUnit: "ITEM",
        tags: ["sample"],
        tenantId: "tenant-id",
        disabled: 0,
    }),
    new models.DeliverableType({
        label: "Covid sample",
        icon: "BUG",
        defaultUnit: "ITEM",
        tags: ["sample"],
        tenantId: "tenant-id",
        disabled: 0,
    }),
    new models.DeliverableType({
        label: "Document",
        icon: "DOCUMENT",
        tags: ["other"],
        defaultUnit: "ITEM",
        tenantId: "tenant-id",
        disabled: 0,
    }),
    new models.DeliverableType({
        label: "Milk",
        icon: "CHILD",
        tags: ["other"],
        defaultUnit: "LITER",
        tenantId: "tenant-id",
        disabled: 0,
    }),
    new models.DeliverableType({
        label: "Equipment",
        icon: "EQUIPMENT",
        tags: ["tag1", "tag2"],
        defaultUnit: "ITEM",
        tenantId: "tenant-id",
        disabled: 0,
    }),
    new models.DeliverableType({
        label: "Other",
        tags: ["tag2", "tag3"],
        icon: "OTHER",
        tenantId: "tenant-id",
        disabled: 0,
    }),
];

const tenantId = "tenant-id";

const fakeTask = new models.Task({
    tenantId,
});
const fakeScheduledTask = new models.ScheduledTask({
    tenantId,
});

async function saveMockAvailableDeliverables() {
    for (const d of mockData) {
        await DataStore.save(d);
    }
}

describe("DeliverableDetails", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        const dt = await DataStore.query(models.DeliverableType);
        const ds = await DataStore.query(models.Deliverable);
        const t = await DataStore.query(models.Task);
        for (const item of [...dt, ...ds, ...t]) {
            await DataStore.delete(item);
        }
    });
    it("renders", async () => {
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        render(<DeliverableDetails taskModelType="Task" />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
    });

    it("renders available items in edit mode", async () => {
        await saveMockAvailableDeliverables();
        await DataStore.save(fakeTask);
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const items = await screen.findAllByRole("button", { name: /Add / });
        expect(items).toHaveLength(5);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalled();
        });
        userEvent.click(screen.getByRole("link", { name: "More..." }));
        const itemsMore = await screen.findAllByRole("button", {
            name: /Add /,
        });
        expect(itemsMore).toHaveLength(6);
    });

    it.each`
        modelType
        ${"Task"} | ${"ScheduledTask"}
    `("adds an item", async ({ modelType }) => {
        await saveMockAvailableDeliverables();
        if (modelType === "Task") {
            await DataStore.save(fakeTask);
        } else {
            await DataStore.save(fakeScheduledTask);
        }
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const taskId =
            modelType === "Task" ? fakeTask.id : fakeScheduledTask.id;
        render(
            <DeliverableDetails taskModelType={modelType} taskId={taskId} />,
            {
                preloadedState,
            }
        );
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: `Add ${mockData[0].label}` })
        );
        const decrement = await screen.findByRole("button", {
            name: "decrement",
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(decrement).toBeInTheDocument();
        expect(decrement).toBeDisabled();
        expect(screen.getByText("1")).toBeInTheDocument();
        const mockDeliverable = new models.Deliverable({
            deliverableType: mockData[0],
            task: modelType === "Task" ? fakeTask : undefined,
            scheduledTask:
                modelType === "ScheduledTask" ? fakeScheduledTask : undefined,
            count: 1,
            orderInGrid: 0,
            unit: mockData[0].defaultUnit,
            tenantId,
            tags: mockData[0].tags,
            disabled: 0,
        });

        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable,
            id: expect.any(String),
        });
    });

    it("increments and decrements an item", async () => {
        const task = await DataStore.save(fakeTask);
        await saveMockAvailableDeliverables();
        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: /increment/ }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockDeliverable,
                count: 2,
            });
        });
        expect(screen.getByText("2")).toBeInTheDocument();
        const decrement = await screen.findByRole("button", {
            name: "decrement",
        });
        userEvent.click(decrement);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockDeliverable,
                count: 1,
            });
        });
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(decrement).toBeDisabled();
    });

    it("deletes an item", async () => {
        const task = await DataStore.save(fakeTask);
        await saveMockAvailableDeliverables();
        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            { preloadedState }
        );
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "delete" }));
        await waitFor(() => {
            expect(deleteSpy).toHaveBeenCalledTimes(1);
        });
        expect(deleteSpy).toHaveBeenCalledWith(mockDeliverable);
        expect(screen.queryByRole("button", { name: "delete" })).toBeNull();
    });

    test("add then increment an item multiple times", async () => {
        const task = await DataStore.save(fakeTask);
        const mockDeliverable = new models.Deliverable({
            deliverableType: mockData[0],
            task,
            count: 1,
            orderInGrid: 0,
            unit: mockData[0].defaultUnit,
            tenantId,
            tags: mockData[0].tags,
            disabled: 0,
        });
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<DeliverableDetails taskModelType="Task" taskId={task.id} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: `Add ${mockData[0].label}` })
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockDeliverable,
                id: expect.any(String),
            });
        });
        const increments = screen.getAllByRole("button", {
            name: "increment",
        });
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(2, {
                ...mockDeliverable,
                count: mockDeliverable.count + 5,
                id: expect.any(String),
            });
        });
        expect(screen.getByText(mockDeliverable.count + 5)).toBeInTheDocument();
    });

    test("filter the available deliverables by tags", async () => {
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        const predicateSpy = jest.spyOn(Predicates, "ALL");
        const tagsReducer = (previousValue, currentValue = []) => {
            const filtered = currentValue.filter(
                (t) => !previousValue.includes(t)
            );
            return [...previousValue, ...filtered];
        };
        const existingTags = Object.values(mockData).map(
            (deliverableType) => deliverableType.tags
        );
        const tagsUnique = existingTags.reduce(tagsReducer, []);
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(1, models.Deliverable);
        });

        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.DeliverableType,
                expect.any(Function),
                { sort: expect.any(Function) }
            );
        });
        await waitFor(() => {
            expect(predicateSpy).toHaveBeenCalled();
        });
        userEvent.click(screen.getByText("More..."));
        for (const tag of tagsUnique) {
            expect(screen.getByText(tag)).toBeInTheDocument();
        }
        for (const deliverableType of mockData) {
            expect(screen.getByText(deliverableType.label)).toBeInTheDocument();
        }
        userEvent.click(screen.getByText("sample"));
        for (const deliverableType of mockData.filter((deliverableType) =>
            deliverableType.tags.includes("sample")
        )) {
            expect(screen.getByText(deliverableType.label)).toBeInTheDocument();
        }
        for (const deliverableType of mockData.filter(
            (deliverableType) => !deliverableType.tags.includes("sample")
        )) {
            expect(screen.queryByText(deliverableType.label)).toBeNull();
        }
        userEvent.click(screen.getByText("tag2"));
        for (const deliverableType of mockData.filter((deliverableType) =>
            deliverableType.tags.includes("tag2")
        )) {
            expect(screen.getByText(deliverableType.label)).toBeInTheDocument();
        }
        for (const deliverableType of mockData.filter(
            (deliverableType) => !deliverableType.tags.includes("tag2")
        )) {
            expect(screen.queryByText(deliverableType.label)).toBeNull();
        }
    });

    test("change the unit", async () => {
        const task = await DataStore.save(fakeTask);
        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            { preloadedState }
        );
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", {
                name: `${mockDeliverable.unit}. Click to change`,
            })
        );
        userEvent.click(screen.getByText(models.DeliverableUnit.NONE));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable,
            unit: models.DeliverableUnit.NONE,
        });
        const unitButtonUpdated = await screen.findByRole("button", {
            name: "NONE. Click to change",
        });
        expect(unitButtonUpdated).toBeInTheDocument();
    });

    it("respond to remote changes adding item", async () => {
        const task = await DataStore.save(fakeTask);
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });

        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        expect(
            await screen.findByText(`${mockDeliverable.deliverableType.label}`)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                `${mockDeliverable.count} x ${mockDeliverable.unit}`
            )
        ).toBeInTheDocument();
    });

    it("respond to remote changes editing item", async () => {
        const task = await DataStore.save(fakeTask);
        await saveMockAvailableDeliverables();
        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(
            await screen.findByText(`${mockDeliverable.deliverableType.label}`)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                `${mockDeliverable.count} x ${mockDeliverable.unit}`
            )
        ).toBeInTheDocument();
        await DataStore.save(
            models.Deliverable.copyOf(mockDeliverable, (upd) => {
                upd.unit = models.DeliverableUnit.LITER;
                upd.count = 20;
            })
        );
        expect(
            await screen.findByText(`${mockDeliverable.deliverableType.label}`)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(`${20} x ${models.DeliverableUnit.LITER}`)
        ).toBeInTheDocument();
    });

    it("respond to remote changes removing item", async () => {
        const task = await DataStore.save(fakeTask);
        await saveMockAvailableDeliverables();
        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(
            await screen.findByText(`${mockDeliverable.deliverableType.label}`)
        ).toBeInTheDocument();
        expect(
            screen.queryByText(
                `${mockDeliverable.count} x ${mockDeliverable.unit}`
            )
        ).toBeInTheDocument();
        await DataStore.delete(mockDeliverable);
        await waitFor(() => {
            expect(
                screen.queryByText(`${mockDeliverable.deliverableType.label}`)
            ).toBeNull();
        });
        expect(
            screen.queryByText(
                `${mockDeliverable.count} x ${mockDeliverable.unit}`
            )
        ).toBeNull();
    });

    test("don't allow riders to edit", async () => {
        const task = await DataStore.save(fakeTask);
        const mockAssignee = await DataStore.save(
            new models.User({
                name: "John Doe",
                roles: [models.Role.RIDER],
            })
        );
        const mockAssignment = await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee: mockAssignee,
                role: models.Role.RIDER,
            })
        );
        await saveMockAvailableDeliverables();
        const mockDeliverable = await DataStore.save(
            new models.Deliverable({
                deliverableType: mockData[0],
                task,
                count: 1,
                orderInGrid: 0,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: mockAssignee },
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [mockAssignment],
            },
        };
        render(
            <DeliverableDetails taskModelType="Task" taskId={fakeTask.id} />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(
            await screen.findByText(`${mockDeliverable.deliverableType.label}`)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                `${mockDeliverable.count} x ${mockDeliverable.unit}`
            )
        ).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
    });
});
