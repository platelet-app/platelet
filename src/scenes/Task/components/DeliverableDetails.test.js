import React from "react";
import { screen, waitFor } from "@testing-library/react";
import _ from "lodash";
import { render } from "../../../test-utils";
import DeliverableDetails from "./DeliverableDetails";
import * as amplify from "aws-amplify";
import userEvent from "@testing-library/user-event";
import { deliverableUnits } from "../../../apiConsts";
import * as models from "../../../models";

jest.mock("aws-amplify");

const preloadedState = { tenantId: "tenant-id" };

const mockData = [
    new models.DeliverableType({
        label: "Sample",
        icon: "BUG",
        defaultUnit: "ITEM",
        tags: ["sample"],
        tenantId: "tenant-id",
    }),
    new models.DeliverableType({
        label: "Covid sample",
        icon: "BUG",
        defaultUnit: "ITEM",
        tags: ["sample"],
        tenantId: "tenant-id",
    }),
    new models.DeliverableType({
        label: "Document",
        icon: "DOCUMENT",
        tags: ["other"],
        defaultUnit: "ITEM",
        tenantId: "tenant-id",
    }),
    new models.DeliverableType({
        label: "Milk",
        icon: "CHILD",
        tags: ["other"],
        defaultUnit: "LITRE",
        tenantId: "tenant-id",
    }),
    new models.DeliverableType({
        label: "Equipment",
        icon: "EQUIPMENT",
        tags: ["tag1", "tag2"],
        defaultUnit: "ITEM",
        tenantId: "tenant-id",
    }),
    new models.DeliverableType({
        label: "Other",
        tags: ["tag2", "tag3"],
        icon: "OTHER",
        tenantId: "tenant-id",
    }),
];

const fakeTask = new models.Task({
    tenantId: "tenant-id",
});
const mockDeliverables = _.range(0, 10).map((i) => {
    return new models.Deliverable({
        deliverableType: _.sample(mockData),
        count: i + 1,
        orderInGrid: i,
        task: fakeTask,
        unit: i === 0 ? deliverableUnits.item : _.sample(deliverableUnits),
        tenantId: "tenant-id",
    });
});

const unsubscribe = jest.fn();

describe("DeliverableDetails", () => {
    it("renders", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(mockData);
        render(<DeliverableDetails />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });

    it("renders available items in edit mode", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValue(mockData);
        render(<DeliverableDetails />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        const items = await screen.findAllByRole("button", { name: /Add / });
        expect(items).toHaveLength(5);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalled();
        });
        userEvent.click(screen.getByRole("link", { name: "More..." }));
        const itemsMore = await screen.findAllByRole("button", {
            name: /Add /,
        });
        expect(itemsMore).toHaveLength(6);
    });

    it("adds an item", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });

        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(mockData)
            .mockResolvedValueOnce(mockData[0])
            .mockResolvedValue(fakeTask);
        amplify.DataStore.save.mockResolvedValueOnce(
            new models.Deliverable({ deliverableType: mockData[0], count: 1 })
        );
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: `Add ${mockData[0].label}` })
        );
        const decrement = await screen.findByRole("button", {
            name: "decrement",
        });
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1);
        });
        expect(decrement).toBeInTheDocument();
        expect(decrement).toBeDisabled();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
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
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockDeliverables[0]])
            .mockResolvedValueOnce(mockData)
            .mockResolvedValue(mockDeliverables[0]);
        amplify.DataStore.save
            .mockResolvedValueOnce({
                ...mockDeliverables[0],
                count: 2,
            })
            .mockResolvedValue({
                ...mockDeliverables[0],
                count: 1,
            });

        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        const increment = screen.getByRole("button", {
            name: "increment",
        });
        expect(increment).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: /increment/ }));
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledWith({
                ...mockDeliverables[0],
                count: 2,
            });
        });
        expect(screen.getByText("2")).toBeInTheDocument();
        const decrement = await screen.findByRole("button", {
            name: "decrement",
        });
        userEvent.click(decrement);
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledWith({
                ...mockDeliverables[0],
                count: 1,
            });
        });
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(decrement).toBeDisabled();
    });

    it("deletes an item", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockDeliverables[0]])
            .mockResolvedValueOnce(mockData)
            .mockResolvedValue(mockDeliverables[0]);
        amplify.DataStore.delete.mockResolvedValueOnce({});
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "delete" }));
        await waitFor(() => {
            expect(amplify.DataStore.delete).toHaveBeenCalledTimes(1);
        });
        expect(amplify.DataStore.delete).toHaveBeenCalledWith(
            mockDeliverables[0]
        );
        expect(screen.queryByRole("button", { name: "delete" })).toBeNull();
    });

    test("add then increment an item multiple times", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(mockData)
            .mockResolvedValueOnce(mockData[0])
            .mockResolvedValueOnce(fakeTask)
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce(fakeTask);

        amplify.DataStore.save
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce({
                ...mockDeliverables[0],
                count: mockDeliverables[0].count + 1,
            });

        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: `Add ${mockData[0].label}` })
        );
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                1,
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
        const increments = screen.getAllByRole("button", {
            name: "increment",
        });
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        userEvent.click(increments[0]);
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(2, {
                ...mockDeliverables[0],
                count: mockDeliverables[0].count + 5,
            });
        });
        expect(
            screen.getByText(mockDeliverables[0].count + 5)
        ).toBeInTheDocument();
    });

    test("filter the available deliverables by tags", async () => {
        const tagsReducer = (previousValue, currentValue = []) => {
            const filtered = currentValue.filter(
                (t) => !previousValue.includes(t)
            );
            return [...previousValue, ...filtered];
        };
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValue(mockData);
        const existingTags = Object.values(mockData).map(
            (deliverableType) => deliverableType.tags
        );
        const tagsUnique = existingTags.reduce(tagsReducer, []);
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.Deliverable
            );
        });

        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.DeliverableType,
                amplify.Predicates.ALL,
                expect.objectContaining({})
            );
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
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockDeliverables[0]])
            .mockResolvedValueOnce(mockData)
            .mockResolvedValue(mockDeliverables[0]);
        amplify.DataStore.save.mockResolvedValue({
            ...mockDeliverables[0],
            unit: deliverableUnits.none,
        });
        render(<DeliverableDetails taskId={fakeTask.id} />, { preloadedState });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", {
                name: `${mockDeliverables[0].unit}. Click to change`,
            })
        );
        userEvent.click(
            screen.getByRole("button", {
                name: mockDeliverables[0].unit,
            })
        );
        const unitMenuItems = await screen.findAllByRole("option");
        expect(unitMenuItems).toHaveLength(
            Object.values(deliverableUnits).length
        );
        userEvent.click(unitMenuItems[0]);
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1);
        });
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...mockDeliverables[0],
            unit: deliverableUnits.none,
        });
        const unitButtonUpdated = await screen.findByRole("button", {
            name: "NONE. Click to change",
        });
        expect(unitButtonUpdated).toBeInTheDocument();
    });
});
