import React from "react";
import TaskActions from "./TaskActions";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import { tasksStatus, userRoles } from "../../../apiConsts";

describe("TaskActions", () => {
    const RealDate = Date;
    const isoDate = "2021-11-29T23:24:58.987Z";

    function mockDate() {
        global.Date = class extends RealDate {
            constructor() {
                super();
                return new RealDate(isoDate);
            }
        };
    }

    afterEach(async () => {
        global.Date = RealDate;
    });
    beforeEach(async () => {
        jest.restoreAllMocks();
        mockDate();
    });
    it("renders", async () => {
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={"test"} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    test("all buttons are disabled when isFetching state is set", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={"test"} />);
        expect(
            screen.getByRole("button", { name: "Picked up" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Cancelled" })
        ).toBeDisabled();
        expect(screen.getByRole("button", { name: "Rejected" })).toBeDisabled();
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
    });

    test("picked up is disabled when there are no assignees", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        const preloadedState = {
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        expect(button).toBeDisabled();
    });

    it("clicks the picked up button", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: userRoles.rider,
        });
        const preloadedState = {
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(screen.getByText(/Set the picked up time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        // expect button to be toggled
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
        const buttonDroppedOff = await screen.findByRole("button", {
            name: "Delivered",
        });
        expect(buttonDroppedOff).toBeEnabled();
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timePickedUp: isoDate,
                status: tasksStatus.pickedUp,
            });
        });
    });

    test("delivered button is disabled without timePickedUp set", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("clicks the delivered button when timePickedUp is set and there are assignees", async () => {
        const mockTask = new models.Task({ timePickedUp: isoDate });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: userRoles.rider,
        });
        const preloadedState = {
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const spy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(screen.getByText(/Set the delivered time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        // expect the mock function to have been called with a Date object
        // expect button to be toggled
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeDroppedOff: isoDate,
                status: tasksStatus.droppedOff,
            });
        });
    });

    it("clicks the rider home button", async () => {
        const mockTask = new models.Task({
            timePickedUp: isoDate,
            timeDroppedOff: isoDate,
        });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: userRoles.rider,
        });
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const preloadedState = {
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const spy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Rider home" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(screen.getByText(/Set the rider home time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        // expect the mock function to have been called with a Date object
        // expect button to be toggled
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeRiderHome: isoDate,
                status: tasksStatus.completed,
            });
        });
    });

    test("rider home button is disabled", async () => {
        const mockTask = new models.Task({
            timePickedUp: isoDate,
            timeDroppedOff: null,
        });
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Rider home" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("clicks the cancelled button", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Cancelled" });
        userEvent.click(button);
        expect(screen.getByText(/Set the cancelled time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeCancelled: isoDate,
                status: tasksStatus.cancelled,
            });
        });
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
        expect(
            await screen.findByRole("button", { name: "Cancelled" })
        ).toBeEnabled();
        expect(screen.getByRole("button", { name: "Rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Picked up" })
        ).toBeDisabled();
    });

    it("clicks the rejected button", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Rejected" });
        userEvent.click(button);
        expect(screen.getByText(/Set the rejected time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeRejected: isoDate,
                status: tasksStatus.rejected,
            });
        });
        // expect button to be toggled
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
        expect(
            await screen.findByRole("button", { name: "Rejected" })
        ).toBeEnabled();
        expect(
            screen.getByRole("button", { name: "Cancelled" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Picked up" })
        ).toBeDisabled();
    });

    test("rejected and cancelled are disabled when timePickedUp and timeDroppedOff is set", async () => {
        const mockTask = new models.Task({
            timeDroppedOff: new Date().toISOString(),
            timePickedUp: new Date().toISOString(),
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />);

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByRole("button", { name: "Rejected" })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Cancelled" })
        ).toBeDisabled();
    });

    test("delivered is disabled if rider home is set", async () => {
        const mockTask = new models.Task({
            timeDroppedOff: new Date().toISOString(),
            timeRiderHome: new Date().toISOString(),
        });
        await DataStore.save(mockTask);
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: userRoles.rider,
        });
        await DataStore.save(mockAssignment);
        const preloadedState = {
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(
            screen.getByRole("button", { name: "Delivered" })
        ).toBeDisabled();
    });

    test("untoggle timePickedUp", async () => {
        const mockTask = new models.Task({ timePickedUp: isoDate });
        await DataStore.save(mockTask);
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: userRoles.rider,
        });
        await DataStore.save(mockAssignment);
        const preloadedState = {
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(
            screen.getByText(/Clear the picked up time/)
        ).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timePickedUp: null,
                status: tasksStatus.active,
            });
        });
    });

    test("untoggle timeDroppedOff", async () => {
        const mockTask = new models.Task({
            timePickedUp: new Date().toISOString(),
            timeDroppedOff: new Date().toISOString(),
        });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: userRoles.rider,
        });
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const preloadedState = {
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(
            screen.getByText(/Clear the delivered time/)
        ).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        // expect the mock function to have been called with null
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeDroppedOff: null,
                status: tasksStatus.pickedUp,
            });
        });
    });

    test("untoggle timeCancelled", async () => {
        console.log();
        const mockTask = new models.Task({
            timeCancelled: isoDate,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Cancelled" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(
            screen.getByText(/Clear the cancelled time/)
        ).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        // expect the mock function to have been called with null
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeCancelled: null,
                status: tasksStatus.new,
            });
        });
    });

    test("untoggle timeRejected", async () => {
        const mockTask = new models.Task({
            timeRejected: isoDate,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Rejected" });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(screen.getByText(/Clear the rejected time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        // expect the mock function to have been called with null
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeRejected: null,
                status: tasksStatus.new,
            });
        });
    });

    test.skip("observer is unsubscribed on unmount", async () => {
        const mockTask = new models.Task({
            timePickedUp: new Date().toISOString(),
        });
        const unsubscribe = jest.fn();
        const observerSpy = jest
            .spyOn(DataStore.observe, "subscribe")
            .mockImplementation(() => ({ unsubscribe }));
        const querySpy = jest.spyOn(DataStore, "query");
        const { component } = render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(1);
        });
        jest.clearAllMocks();
    });

    test("observer updates component on task update", async () => {
        const mockTask = new models.Task({
            timePickedUp: new Date().toISOString(),
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const observerSpy = jest.spyOn(DataStore, "observe");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(observerSpy).toHaveBeenCalledTimes(1);
        });
        await DataStore.save(
            models.Task.copyOf(
                mockTask,
                (updated) => (updated.timeDroppedOff = new Date().toISOString())
            )
        );
        const button = screen.getByRole("button", { name: "Delivered" });
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
    });

    test("observer updates component on task deleted", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const observerSpy = jest.spyOn(DataStore, "observe");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(observerSpy).toHaveBeenCalledTimes(1);
        });
        await DataStore.delete(mockTask);
        const buttons = screen.getAllByRole("button");
        // expect all buttons to be disabled
        buttons.forEach((button) => {
            expect(button).toBeDisabled();
        });
    });

    test("multiple actions", async () => {
        const mockTask = new models.Task({ status: tasksStatus.active });
        const fakeAssignee = new models.User({
            roles: [userRoles.rider, userRoles.user],
            displayName: "test",
        });
        const fakeAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: userRoles.rider,
        });
        const preloadedState = {
            taskAssigneesReducer: {
                items: [fakeAssignment],
                ready: true,
                isSynced: true,
            },
        };
        await DataStore.save(mockTask);
        await DataStore.save(fakeAssignee);
        await DataStore.save(fakeAssignment);
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const saveSpy = jest.spyOn(DataStore, "save");
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
        userEvent.click(button);
        expect(screen.getByText(/Set the picked up time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        // expect button to be toggled
        await waitFor(() => {
            expect(button).toHaveAttribute("aria-pressed", "true");
        });
        const buttonDroppedOff = await screen.findByRole("button", {
            name: "Delivered",
        });
        await waitFor(() => {
            expect(buttonDroppedOff).toBeEnabled();
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timePickedUp: isoDate,
                status: tasksStatus.pickedUp,
            });
        });
        userEvent.click(buttonDroppedOff);
        const okButton2 = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton2);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(2, {
                ...mockTask,
                timePickedUp: isoDate,
                timeDroppedOff: isoDate,
                status: tasksStatus.droppedOff,
            });
        });
        const buttonRiderHome = await screen.findByRole("button", {
            name: "Rider home",
        });
        await waitFor(() => {
            expect(buttonRiderHome).toBeEnabled();
        });
        userEvent.click(buttonRiderHome);
        const okButton3 = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton3);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(3, {
                ...mockTask,
                timePickedUp: isoDate,
                timeDroppedOff: isoDate,
                timeRiderHome: isoDate,
                status: tasksStatus.completed,
            });
        });
        const result = await DataStore.query(models.Task, mockTask.id);
        expect(result.status).toBe(tasksStatus.completed);
    });
});
