import React from "react";
import { screen, waitFor } from "@testing-library/react";
import _ from "lodash";
import { render } from "../../../test-utils";
import DeliverableDetails from "./DeliverableDetails";
import userEvent from "@testing-library/user-event";
import { deliverableUnits } from "../../../apiConsts";
import * as models from "../../../models";
import { DataStore, Predicates } from "aws-amplify";

const preloadedState = { tenantId: "tenant-id" };

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
        defaultUnit: "LITRE",
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

const fakeTask = new models.Task({
    tenantId: "tenant-id",
});

let mockDeliverables;

async function saveMockDeliverables() {
    await saveMockAvailableDeliverables();
    const av = await DataStore.query(models.DeliverableType);
    const task = await DataStore.save(fakeTask);
    mockDeliverables = _.range(0, 10).map((i) => {
        return new models.Deliverable({
            deliverableType: _.sample(av),
            count: i + 1,
            orderInGrid: i,
            task,
            unit: i === 0 ? deliverableUnits.item : _.sample(deliverableUnits),
            tenantId: "tenant-id",
        });
    });
    for (const d of mockDeliverables) {
        await DataStore.save(d);
    }
}

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
        render(<DeliverableDetails />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
    });

    it("renders available items in edit mode", async () => {
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        render(<DeliverableDetails />, { preloadedState });
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

    it("adds an item", async () => {
        await saveMockAvailableDeliverables();
        await DataStore.save(fakeTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
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
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining(
                _.omit(
                    new models.Deliverable({
                        deliverableType: mockData[0],
                        task: fakeTask,
                        count: 1,
                        orderInGrid: 0,
                        label: mockData[0].label,
                        unit: mockData[0].defaultUnit,
                    }),
                    "id"
                )
            )
        );
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
                label: mockData[0].label,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
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
                label: mockData[0].label,
                unit: mockData[0].defaultUnit,
                tenantId: "tenant-id",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
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
            tenantId: "tenant-id",
        });
        await saveMockAvailableDeliverables();
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<DeliverableDetails taskId={task.id} />, { preloadedState });
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
            expect(saveSpy).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining(_.omit(mockDeliverable, "id"))
            );
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
            expect(saveSpy).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining(
                    _.omit(
                        {
                            ...mockDeliverable,
                            count: mockDeliverable.count + 5,
                        },
                        "id"
                    )
                )
            );
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
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
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
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", {
                name: `${mockDeliverable.unit}. Click to change`,
            })
        );
        userEvent.click(screen.getByText(deliverableUnits.none));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockDeliverable,
            unit: deliverableUnits.none,
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
        render(<DeliverableDetails taskId={fakeTask.id} />, {
            preloadedState,
        });
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
        render(<DeliverableDetails taskId={fakeTask.id} />, {
            preloadedState,
        });
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
                upd.unit = deliverableUnits.litre;
                upd.count = 20;
            })
        );
        expect(
            await screen.findByText(`${mockDeliverable.deliverableType.label}`)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(`${20} x ${deliverableUnits.litre}`)
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
        render(<DeliverableDetails taskId={fakeTask.id} />, {
            preloadedState,
        });
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
});
