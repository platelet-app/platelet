import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../test-utils";
import DeliverableGridSelect from "./DeliverableGridSelect";
import * as amplify from "aws-amplify";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

jest.mock("aws-amplify");
jest.mock("../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

const createdAt = new Date().toISOString();
const mockData = [
    {
        createdAt,
        label: "Sample",
        icon: "BUG",
        defaultUnit: "ITEM",
        id: "42c1f0a7-afe3-4f53-a3c4-04f5af010aad",
    },
    {
        createdAt,
        label: "Covid sample",
        icon: "BUG",
        defaultUnit: "ITEM",
        id: "3275b217-bbd2-41a1-9908-0ca90de927ab",
    },
    {
        createdAt,
        label: "Document",
        icon: "DOCUMENT",
        defaultUnit: "ITEM",
        id: "d4a6b7fd-7093-47d0-a983-78b9eb7355db",
    },
    {
        createdAt,
        label: "Milk",
        icon: "CHILD",
        defaultUnit: "LITRE",
        id: "c7b5aea5-1d96-4c6e-a40d-d21f0885e416",
    },
    {
        createdAt,
        label: "Equipment",
        icon: "EQUIPMENT",
        defaultUnit: "ITEM",
        id: "55a05963-4133-41bf-9acf-ee66ddcbc415",
    },
    {
        createdAt,
        label: "Other",
        icon: "OTHER",
        id: "41cbd602-c319-460e-a5ce-f153d08d41ab",
    },
];

const mockDeliverables = [
    {
        unit: "ITEM",
        count: 1,
        orderInGrid: 0,
        id: "ec4bf222-3388-4c0a-aca1-b2140542001e",
        deliverableType: {
            label: "Equipment",
            icon: "EQUIPMENT",
            defaultUnit: "ITEM",
            id: "55a05963-4133-41bf-9acf-ee66ddcbc415",
        },
    },
    {
        unit: "ITEM",
        count: 3,
        orderInGrid: 1,
        id: "b48f52f3-d495-4e64-af59-eab206b32b8c",
        deliverableType: {
            label: "Document",
            icon: "DOCUMENT",
            defaultUnit: "ITEM",
            id: "d4a6b7fd-7093-47d0-a983-78b9eb7355db",
        },
    },
    {
        unit: "ITEM",
        count: 2,
        orderInGrid: 2,
        id: "f584d716-d719-49f9-9cd5-d018df5eb8cc",
        deliverableType: {
            label: "Sample",
            icon: "BUG",
            defaultUnit: "ITEM",
            id: "42c1f0a7-afe3-4f53-a3c4-04f5af010aad",
        },
    },
    {
        unit: "LITRE",
        count: 3,
        orderInGrid: 3,
        id: "55f641de-e553-482f-97a8-57da55ffebe1",
        deliverableType: {
            label: "Milk",
            icon: "CHILD",
            defaultUnit: "LITRE",
            id: "c7b5aea5-1d96-4c6e-a40d-d21f0885e416",
        },
    },
];

describe("DeliverableGridSelect", () => {
    it("renders", () => {
        amplify.DataStore.query.mockResolvedValue(mockData);
        render(<DeliverableGridSelect />);
    });

    it("renders available items", async () => {
        amplify.DataStore.query.mockResolvedValue(mockData);
        await act(async () => {
            render(<DeliverableGridSelect />);
        });
        const items = await screen.findAllByRole("button");
        expect(items).toHaveLength(5);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalled();
        });
        const moreLink = await screen.findByRole("link");
        await act(async () => {
            userEvent.click(moreLink);
        });
        const itemsMore = await screen.findAllByRole("button");
        expect(itemsMore).toHaveLength(6);
    });

    it("adds an item", async () => {
        const onChange = jest.fn();
        amplify.DataStore.query.mockResolvedValue(mockData);
        await act(async () => {
            render(<DeliverableGridSelect onChange={onChange} />);
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalled();
        });
        const items = await screen.findAllByRole("button");
        expect(items).toHaveLength(5);
        await act(async () => {
            userEvent.click(items[0]);
        });
        expect(
            screen.getByRole("button", { name: /Click to change/ })
        ).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledWith({
            count: 1,
            id: mockData[0].id,
            label: mockData[0].label,
            orderInGrid: 0,
            unit: mockData[0].defaultUnit,
        });
    });

    it("increments and decrements an item", async () => {
        const onChange = jest.fn();
        amplify.DataStore.query.mockResolvedValue(mockData);
        await act(async () => {
            render(<DeliverableGridSelect onChange={onChange} />);
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalled();
        });
        const items = await screen.findAllByRole("button");
        expect(items).toHaveLength(5);
        await act(async () => {
            userEvent.click(items[0]);
        });
        await act(async () => {
            userEvent.click(items[0]);
        });
        expect(
            screen.getByRole("button", { name: /increment/ })
        ).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledWith({
            count: 1,
            id: mockData[0].id,
            label: mockData[0].label,
            orderInGrid: 0,
            unit: mockData[0].defaultUnit,
        });
        await act(async () => {
            userEvent.click(screen.getByRole("button", { name: /increment/ }));
        });
        expect(onChange).toHaveBeenCalledWith({
            count: 2,
            id: mockData[0].id,
        });
        await act(async () => {
            userEvent.click(screen.getByRole("button", { name: /decrement/ }));
        });
        expect(onChange).toHaveBeenCalledWith({
            count: 1,
            id: mockData[0].id,
        });
    });

    it("deletes an item", async () => {
        const onDelete = jest.fn();
        amplify.DataStore.query.mockResolvedValue(mockData);
        await act(async () => {
            render(<DeliverableGridSelect onDelete={onDelete} />);
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalled();
        });
        const items = await screen.findAllByRole("button");
        expect(items).toHaveLength(5);
        await act(async () => {
            userEvent.click(items[0]);
        });
        expect(
            screen.getByRole("button", { name: /delete/ })
        ).toBeInTheDocument();
        await act(async () => {
            userEvent.click(screen.getByRole("button", { name: /delete/ }));
        });
        expect(onDelete).toHaveBeenCalledWith(mockData[0].id);
    });

    test("feeding a list of deliverables into props", async () => {
        amplify.DataStore.query.mockResolvedValue(mockData);
        render(<DeliverableGridSelect deliverables={mockDeliverables} />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalled();
        });
        const items = await screen.findAllByRole("button", {
            name: /decrement/,
        });
        expect(items).toHaveLength(4);
        const defaults = await screen.findAllByRole("button", {
            name: /Add deliverable/,
        });
        expect(defaults).toHaveLength(1);
    });
});
