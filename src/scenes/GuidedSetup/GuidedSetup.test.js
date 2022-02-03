import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { render } from "../../test-utils";
import { GuidedSetup } from "./GuidedSetup";
import * as amplify from "aws-amplify";
import * as models from "../../models";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import { tasksStatus } from "../../apiConsts";

jest.mock("aws-amplify");

const preloadedState = {
    guidedSetupOpen: true,
};

describe("GuidedSetup", () => {
    it("renders correctly", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.DeliverableType,
                undefined,
                { sort: expect.any(Function) }
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Location,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                3,
                models.Location,
                expect.any(Function)
            );
        });
    });

    test("the tabs switch properly", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
        expect(screen.getByText("What is the priority?")).toBeVisible();
        userEvent.click(screen.getByText(/ITEMS/));
        expect(screen.getByText("What is being delivered?")).toBeVisible();
        userEvent.click(screen.getByText(/PICK-UP/));
        expect(screen.getByText("Where from?")).toBeVisible();
        expect(screen.getByText("Where to?")).toBeVisible();
        userEvent.click(screen.getByText(/NOTES/));
        expect(
            screen.getByText("Who should the notes be visible to?")
        ).toBeVisible();
        userEvent.click(screen.getByText(/CALLER/));
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
    });

    test("moving step by step with Next/Previous", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        expect(screen.queryByText("Previous")).toBeNull();
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
        expect(screen.getByText("What is the priority?")).toBeVisible();
        userEvent.click(screen.getByText("Next"));
        expect(screen.getByText("What is being delivered?")).toBeVisible();
        userEvent.click(screen.getByText("Next"));
        expect(screen.getByText("Where from?")).toBeVisible();
        expect(screen.getByText("Where to?")).toBeVisible();
        userEvent.click(screen.getByText("Next"));
        expect(
            screen.getByText("Who should the notes be visible to?")
        ).toBeVisible();
        expect(screen.queryByText("Next")).toBeNull();
        userEvent.click(screen.getByText("Previous"));
        expect(screen.getByText("Where from?")).toBeVisible();
        expect(screen.getByText("Where to?")).toBeVisible();
        userEvent.click(screen.getByText("Previous"));
        expect(screen.getByText("What is being delivered?")).toBeVisible();
        userEvent.click(screen.getByText("Previous"));
        expect(
            screen.getByText("What are their contact details?")
        ).toBeVisible();
        expect(screen.getByText("What is the priority?")).toBeVisible();
    });

    test("setting the contact details", async () => {
        const mockData = new models.Task({
            dropOffLocation: null,
            pickUpLocation: null,
            priority: null,
            status: tasksStatus.new,
            requesterContact: {
                name: "Someone Person",
                telephoneNumber: "01234567890",
            },
        });
        amplify.DataStore.query.mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue(mockData);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Name" }),
            mockData.requesterContact.name
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Telephone" }),
            mockData.requesterContact.telephoneNumber
        );
        expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
            mockData.requesterContact.name
        );
        userEvent.click(
            screen.getByRole("button", { name: "Save to dashboard" })
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    ..._.omit(mockData, "id"),
                    timeOfCall: expect.any(String),
                })
            )
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(6)
        );
    });

    test("clicking the discard button when nothing has been entered", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(6)
        );
    });

    test("clicking the discard button when contact data has been entered", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        const textBox = screen.getByRole("textbox", { name: "Name" });
        userEvent.type(textBox, "Someone Person");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(6)
        );
    });

    test("clicking the discard button when item data has been entered", async () => {
        amplify.DataStore.query.mockResolvedValue([
            new models.DeliverableType({ label: "Fake Item" }),
        ]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        userEvent.click(screen.getByText(/ITEMS/));
        userEvent.click(screen.getByRole("button", { name: "Add Fake Item" }));
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(6)
        );
    });
    test("clicking the discard button when location data has been entered", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        userEvent.click(screen.getByText(/PICK-UP/));
        userEvent.click(screen.getAllByText("Ward")[1]);
        const textBox = screen.getByRole("textbox", { name: "" });
        userEvent.type(textBox, "data");
        userEvent.type(textBox, "{enter}");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() =>
            // location search not rendered so 5 calls
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(5)
        );
    });
    test("clicking the discard button when note data has been entered", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<GuidedSetup />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3)
        );
        userEvent.click(screen.getByText(/NOTES/));
        const textBox = screen.getByRole("textbox", { name: "Notes" });
        userEvent.type(textBox, "data");
        userEvent.click(screen.getByRole("button", { name: "Discard" }));
        expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        expect(screen.queryByText(/Are you sure/)).toBeNull();
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(6)
        );
    });
});
