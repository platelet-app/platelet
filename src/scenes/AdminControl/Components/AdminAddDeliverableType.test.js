import React from "react";
import AdminAddDeliverableType from "./AdminAddDeliverableType";
import { render } from "../../../test-utils";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import {
    deliverableIcons,
    deliverableUnits,
    userRoles,
} from "../../../apiConsts";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _ from "lodash";

jest.mock("aws-amplify");

const preloadedState = {
    whoami: {
        user: new models.User({ roles: [userRoles.user, userRoles.admin] }),
    },
    loadingReducer: {
        GET_WHOAMI: false,
    },
    tenantId: "tenant-id",
};

describe("AdminAddDeliverableType", () => {
    it("renders without crashing", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<AdminAddDeliverableType />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.DeliverableType
            )
        );
        expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
    });

    test("add and remove a deliverable tag", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        const mockNewDeliverable = new models.DeliverableType({
            label: "test",
            icon: deliverableIcons.other,
            defaultUnit: deliverableUnits.none,
            tags: [],
            disabled: 0,
        });
        render(<AdminAddDeliverableType />, { preloadedState });
        await waitFor(() => expect(amplify.DataStore.query).toHaveBeenCalled());
        userEvent.type(
            screen.getByRole("textbox", { name: "Label" }),
            mockNewDeliverable.label
        );

        const tagBox = screen.getByRole("combobox");
        userEvent.type(tagBox, "tag1");
        userEvent.type(screen.getByRole("combobox"), "{enter}");
        expect(screen.getByText("tag1")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("CancelIcon"));
        expect(screen.queryByText("tag1")).toBeNull();
        userEvent.click(
            screen.getByRole("button", { name: "Add deliverable type" })
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining(_.omit(mockNewDeliverable, "id"))
            )
        );
    });

    test("tag suggestions in combobox", async () => {
        const mockDeliverableTypes = [
            new models.DeliverableType({
                label: "deliverable-type-1",
                tags: ["tag-1", "tag-2"],
            }),
            new models.DeliverableType({
                label: "deliverable-type-2",
                tags: ["tag-3", "tag-4"],
            }),
            new models.DeliverableType({
                label: "deliverable-type-3",
                tags: ["tag-1", "tag-2"],
            }),
            new models.DeliverableType({
                label: "deliverable-type-4",
                tags: ["tag-3", "tag-4"],
            }),
        ];
        amplify.DataStore.query.mockResolvedValue(mockDeliverableTypes);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<AdminAddDeliverableType />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.DeliverableType
            )
        );
        userEvent.type(screen.getByRole("combobox"), "t");
        expect(screen.getByText("tag-1")).toBeInTheDocument();
        expect(screen.getByText("tag-2")).toBeInTheDocument();
        expect(screen.getByText("tag-3")).toBeInTheDocument();
        expect(screen.getByText("tag-4")).toBeInTheDocument();
    });
    test("add a deliverable type", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        const mockNewDeliverable = new models.DeliverableType({
            label: "test",
            icon: deliverableIcons.bug,
            defaultUnit: deliverableUnits.item,
            tags: ["tag1", "tag2"],
            disabled: 0,
        });
        render(<AdminAddDeliverableType />, { preloadedState });
        await waitFor(() => expect(amplify.DataStore.query).toHaveBeenCalled());

        userEvent.type(
            screen.getByRole("textbox", { name: "Label" }),
            mockNewDeliverable.label
        );
        userEvent.click(screen.getByRole("button", { name: "Bug icon" }));
        expect(screen.getByRole("button", { name: "Bug icon" })).toBeDisabled();
        userEvent.click(screen.getByText("NONE"));
        for (const entry of Object.values(deliverableUnits)) {
            expect(screen.queryAllByText(entry)).not.toBeNull();
        }
        userEvent.click(screen.getByText("ITEM"));
        const tagBox = screen.getByRole("combobox");
        userEvent.type(tagBox, mockNewDeliverable.tags[0]);
        userEvent.type(screen.getByRole("combobox"), "{enter}");
        // work around the forced rerender
        const tagBox2 = screen.getByRole("combobox");
        userEvent.type(tagBox2, mockNewDeliverable.tags[1]);
        userEvent.type(tagBox2, ",");
        for (const t of mockNewDeliverable.tags) {
            expect(screen.getByText(t)).toBeInTheDocument();
        }

        userEvent.click(
            screen.getByRole("button", { name: "Add deliverable type" })
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining(_.omit(mockNewDeliverable, "id"))
            )
        );
        expect(screen.getByRole("textbox", { name: "Label" })).toHaveValue("");
        expect(
            screen.getByRole("button", { name: "Other icon" })
        ).toBeDisabled();
    });
    test("forbidden if you don't have ADMIN role", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<AdminAddDeliverableType />, {
            preloadedState: {
                ...preloadedState,
                whoami: { user: new models.User({ roles: [userRoles.user] }) },
            },
        });
        expect(screen.queryByText("Add deliverable type")).toBeNull();
        expect(
            screen.getByText("You don't have permission to view this page.")
        ).toBeInTheDocument();
    });
});
