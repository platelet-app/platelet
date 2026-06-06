import React from "react";
import { Task } from "@platelet-app/models";
import { DataStore, API } from "aws-amplify";
import { render, screen, waitFor } from "../../../test-utils";
import { TaskTrackingDetails } from "./TaskTrackingDetails";
import userEvent from "@testing-library/user-event";
import { sendTrackingLink } from "@platelet-app/graphql/dist/graphql/mutations";

const tenantId = "tenantId";

describe("TaskTrackingDetails", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    test("show the tracking state", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: true,
            })
        );
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        expect(checkbox).toBeChecked();
    });
    test("show the tracking state when not enabled", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: false,
            })
        );
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        expect(checkbox).not.toBeChecked();
    });
    test("update the state", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: false,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        expect(checkbox).not.toBeChecked();
        userEvent.click(checkbox);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                isBeingTracked: true,
            });
        });
    });
    test("fail to update the state", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: false,
            })
        );
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue("some error");
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        expect(checkbox).not.toBeChecked();
        userEvent.click(checkbox);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                isBeingTracked: true,
            });
        });
        expect(
            await screen.findByText("Sorry, something went wrong.")
        ).toBeInTheDocument();
    });
    test("tracking link disabled when isBeingTracked is false", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: false,
            })
        );
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        expect(
            screen.getByRole("button", { name: "Send link" })
        ).toBeDisabled();
    });
    test("send a tracking link", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: true,
            })
        );
        const saveSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        userEvent.click(screen.getByRole("button", { name: "Send link" }));
        userEvent.type(
            screen.getByRole("textbox", { name: "recipient name" }),
            "some name"
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "recipient email" }),
            "test@example.com"
        );
        userEvent.click(screen.getByRole("button", { name: "Send" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                query: sendTrackingLink,
                variables: {
                    recipientName: "some name",
                    recipientEmail: "test@example.com",
                    taskId: task.id,
                },
            });
        });
        expect(screen.getByText("Link sent!")).toBeInTheDocument();
    });
    test("send a tracking link failure", async () => {
        const task = await DataStore.save(
            new Task({
                tenantId,
                dateCreated: new Date().toISOString().split("T")[0],
                isBeingTracked: true,
            })
        );
        const saveSpy = jest
            .spyOn(API, "graphql")
            .mockRejectedValue("some error");
        render(<TaskTrackingDetails taskId={task.id} />);
        const checkbox = await screen.findByRole("checkbox", {
            name: "Tracked",
        });
        await waitFor(() => {
            expect(checkbox).toBeEnabled();
        });
        userEvent.click(screen.getByRole("button", { name: "Send link" }));
        userEvent.type(
            screen.getByRole("textbox", { name: "recipient name" }),
            "some name"
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "recipient email" }),
            "test@example.com"
        );
        userEvent.click(screen.getByRole("button", { name: "Send" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                query: sendTrackingLink,
                variables: {
                    recipientName: "some name",
                    recipientEmail: "test@example.com",
                    taskId: task.id,
                },
            });
        });
        expect(
            screen.getByText("Sorry, something went wrong.")
        ).toBeInTheDocument();
    });
});
