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

const mockData = [
    new models.DeliverableType({
        label: "Sample",
        icon: "BUG",
        defaultUnit: "ITEM",
    }),
    new models.DeliverableType({
        label: "Covid sample",
        icon: "BUG",
        defaultUnit: "ITEM",
    }),
    new models.DeliverableType({
        label: "Document",
        icon: "DOCUMENT",
        defaultUnit: "ITEM",
    }),
    new models.DeliverableType({
        label: "Milk",
        icon: "CHILD",
        defaultUnit: "LITRE",
    }),
    new models.DeliverableType({
        label: "Equipment",
        icon: "EQUIPMENT",
        defaultUnit: "ITEM",
    }),
    new models.DeliverableType({
        label: "Other",
        icon: "OTHER",
    }),
];

const fakeTask = new models.Task({});
const mockDeliverables = _.range(0, 10).map((i) => {
    return new models.Deliverable({
        deliverableType: _.sample(mockData),
        count: i + 1,
        orderInGrid: i,
        task: fakeTask,
        unit: i === 0 ? deliverableUnits.item : _.sample(deliverableUnits),
    });
});

const unsubscribe = jest.fn();

describe("DeliverableDetails", () => {
    it("renders", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(mockData);
        render(<DeliverableDetails />);
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
        render(<DeliverableDetails />);
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
        render(<DeliverableDetails taskId="test" />);
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

        render(<DeliverableDetails taskId={fakeTask.id} />);
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
        render(<DeliverableDetails taskId={fakeTask.id} />);
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

    test.only("quickly increment multiple items", async () => {
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce([mockDeliverables[0], mockDeliverables[1]])
            .mockResolvedValueOnce(mockData)
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce(mockDeliverables[1])
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce(mockDeliverables[1])
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce(mockDeliverables[1])
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce(mockDeliverables[1])
            .mockResolvedValueOnce(mockDeliverables[0])
            .mockResolvedValueOnce(mockDeliverables[1]);

        amplify.DataStore.save
            .mockResolvedValueOnce({
                ...mockDeliverables[0],
                count: mockDeliverables[0].count + 5,
            })
            .mockResolvedValueOnce({
                ...mockDeliverables[1],
                count: mockDeliverables[1].count + 5,
            });

        render(<DeliverableDetails taskId={fakeTask.id} />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        const increments = screen.getAllByRole("button", {
            name: "increment",
        });
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        userEvent.click(increments[0]);
        userEvent.click(increments[1]);
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledWith({
                ...mockDeliverables[0],
                count: mockDeliverables[0].count + 10,
            });
        });
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledWith({
                ...mockDeliverables[1],
                count: mockDeliverables[1].count + 10,
            });
        });
        expect(
            screen.getByText(mockDeliverables[0].count + 10)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockDeliverables[1].count + 10)
        ).toBeInTheDocument();
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
        render(<DeliverableDetails taskId={fakeTask.id} />);
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
