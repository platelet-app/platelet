import React from "react";
import TaskActions from "./TaskActions";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import moment from "moment";

const whoami = new models.User({
    displayName: "Test User",
    roles: [models.Role.COORDINATOR],
});

const preloadedState = {
    roleView: "ALL",
    whoami: { user: whoami },
};

Object.assign(navigator, {
    clipboard: {
        writeText: () => {},
    },
});

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
            expect(spy).toHaveBeenCalledTimes(3);
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
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
    });

    test("picked up is disabled when there are no assignees", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(3);
        });
        const button = screen.getByRole("button", { name: "Picked up" });
        expect(button).toBeDisabled();
    });

    it("clicks the picked up button", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                role: models.Role.RIDER,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Picked up" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.PICKED_UP,
                timePickedUpSenderName: "",
            });
        });
    });

    it("clicks the picked up button and adds a sender name", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                role: models.Role.RIDER,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Picked up" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
        userEvent.click(button);
        expect(screen.getByText(/Set the picked up time/)).toBeInTheDocument();
        userEvent.type(
            screen.getByRole("textbox", { name: "Sender name" }),
            "someone person"
        );
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                timePickedUp: isoDate,
                status: models.TaskStatus.PICKED_UP,
                timePickedUpSenderName: "someone person",
            });
        });
        // check the tooltip
        userEvent.hover(screen.getByRole("button", { name: "someone person" }));
        await waitFor(() => {
            expect(screen.getByText(/someone person/)).toBeInTheDocument();
        });
    });

    test("delivered button is disabled without timePickedUp set", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />);
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(3);
        });
        const button = screen.getByRole("button", { name: "Delivered" });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("clicks the delivered button when timePickedUp is set and there are assignees", async () => {
        const mockTask = new models.Task({ timePickedUp: isoDate });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Delivered" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.DROPPED_OFF,
                timeDroppedOffRecipientName: "",
            });
        });
    });

    it("clicks the delivered button and adds recipient name", async () => {
        const mockTask = new models.Task({ timePickedUp: isoDate });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Delivered" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
        userEvent.click(button);
        expect(screen.getByText(/Set the delivered time/)).toBeInTheDocument();
        userEvent.type(
            screen.getByRole("textbox", { name: "Recipient name" }),
            "someone person"
        );
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                timeDroppedOff: isoDate,
                status: models.TaskStatus.DROPPED_OFF,
                timeDroppedOffRecipientName: "someone person",
            });
        });
        // check the tooltip
        userEvent.hover(screen.getByRole("button", { name: "someone person" }));
        await waitFor(() => {
            expect(screen.getByText(/someone person/)).toBeInTheDocument();
        });
    });

    test.skip("copy recipient and sender names to clipboard", async () => {
        const mockTask = new models.Task({
            timePickedUp: isoDate,
            timePickedUpSenderName: "another one",
            timeDroppedOff: isoDate,
            timeDroppedOffRecipientName: "someone person",
            status: models.TaskStatus.DROPPED_OFF,
        });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
            taskAssigneesReducer: {
                items: [mockAssignment],
                ready: true,
                isSynced: true,
            },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const spy = jest.spyOn(DataStore, "query");
        const clipboardSpy = jest.spyOn(navigator.clipboard, "writeText");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "another one" }));
        await waitFor(() => {
            expect(clipboardSpy).toHaveBeenCalledWith("another one");
        });
        userEvent.click(screen.getByRole("button", { name: "someone person" }));
        await waitFor(() => {
            expect(clipboardSpy).toHaveBeenCalledWith("someone person");
        });
    });

    it("clicks the rider home button", async () => {
        const mockTask = new models.Task({
            timePickedUp: isoDate,
            timeDroppedOff: isoDate,
        });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: models.Role.RIDER,
        });
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Rider home" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.COMPLETED,
            });
        });
    });

    test("rider home button is disabled", async () => {
        const mockRider = await DataStore.save(new models.User({}));
        const mockTask = new models.Task({
            timePickedUp: isoDate,
            timeDroppedOff: null,
            status: models.TaskStatus.DROPPED_OFF,
        });
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            role: models.Role.RIDER,
            assignee: mockRider,
        });
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const deliveryButton = screen.getByRole("button", {
            name: "Delivered",
        });
        await waitFor(() => {
            expect(deliveryButton).toBeEnabled();
        });
        const button = screen.getByRole("button", { name: "Rider home" });
        expect(button).toBeDisabled();
    });

    it("clicks the cancelled button", async () => {
        const mockTask = new models.Task({});
        await DataStore.save(mockTask);
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Cancelled" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
        userEvent.click(button);
        expect(screen.getByText(/Set the cancelled time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeCancelled: isoDate,
                status: models.TaskStatus.CANCELLED,
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
        const saveSpy = jest.spyOn(DataStore, "save");
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: whoami },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Rejected" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
        userEvent.click(button);
        expect(screen.getByText(/Set the rejected time/)).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                timeRejected: isoDate,
                status: models.TaskStatus.REJECTED,
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
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Delivered" })
            ).toBeEnabled();
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
            role: models.Role.RIDER,
        });
        await DataStore.save(mockAssignment);
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Rider home" })
            ).toBeEnabled();
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
            role: models.Role.RIDER,
        });
        await DataStore.save(mockAssignment);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Picked up" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.ACTIVE,
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
            role: models.Role.RIDER,
        });
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Delivered" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.PICKED_UP,
            });
        });
    });

    test("untoggle timeCancelled", async () => {
        const mockTask = new models.Task({
            timeCancelled: isoDate,
        });
        await DataStore.save(mockTask);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Cancelled" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.NEW,
            });
        });
    });

    test("untoggle timeRejected", async () => {
        const mockTask = new models.Task({
            timeRejected: isoDate,
        });
        await DataStore.save(mockTask);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Rejected" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
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
                status: models.TaskStatus.NEW,
            });
        });
    });

    test("observer is unsubscribed on unmount", async () => {
        const mockTask = await DataStore.save(
            new models.Task({
                timePickedUp: new Date().toISOString(),
            })
        );
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        const { component } = render(<TaskActions taskId={mockTask.id} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Cancelled" })
            ).toBeEnabled();
        });
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        await waitFor(() => {
            expect(observeSpy).toHaveBeenCalledTimes(3);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(3);
        });
        jest.clearAllMocks();
    });

    test("observer updates component on task update", async () => {
        const mockTask = new models.Task({
            timePickedUp: new Date().toISOString(),
        });
        await DataStore.save(mockTask);
        const observerSpy = jest.spyOn(DataStore, "observe");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Cancelled" })
            ).toBeEnabled();
        });
        await waitFor(() => {
            expect(observerSpy).toHaveBeenCalledTimes(3);
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
        const observerSpy = jest.spyOn(DataStore, "observe");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Cancelled" })
            ).toBeEnabled();
        });
        await waitFor(() => {
            expect(observerSpy).toHaveBeenCalledTimes(3);
        });
        await DataStore.delete(mockTask);
        const buttons = screen.getAllByRole("button");
        // expect all buttons to be disabled
        buttons.forEach((button) => {
            expect(button).toBeDisabled();
        });
    });

    test("multiple actions", async () => {
        const mockTask = new models.Task({ status: models.TaskStatus.ACTIVE });
        const fakeAssignee = new models.User({
            roles: [models.Role.RIDER, models.Role.USER],
            displayName: "test",
        });
        const fakeAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.RIDER,
        });
        await DataStore.save(mockTask);
        await DataStore.save(fakeAssignee);
        await DataStore.save(fakeAssignment);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
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
                status: models.TaskStatus.PICKED_UP,
                timePickedUpSenderName: "",
            });
        });
        userEvent.click(buttonDroppedOff);
        const okButton2 = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton2);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(2, {
                ...mockTask,
                timePickedUp: isoDate,
                timePickedUpSenderName: "",
                timeDroppedOffRecipientName: "",
                timeDroppedOff: isoDate,
                status: models.TaskStatus.DROPPED_OFF,
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
                timePickedUpSenderName: "",
                timeDroppedOffRecipientName: "",
                status: models.TaskStatus.COMPLETED,
            });
        });
        const result = await DataStore.query(models.Task, mockTask.id);
        expect(result.status).toBe(models.TaskStatus.COMPLETED);
    });

    test("allow setting the times when assigned as a rider", async () => {
        const mockTask = new models.Task({ status: models.TaskStatus.ACTIVE });
        await DataStore.save(mockTask);
        const fakeAssignee = await DataStore.save(
            new models.User({
                roles: [models.Role.RIDER, models.Role.USER],
                displayName: "test",
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: fakeAssignee,
                role: models.Role.RIDER,
            })
        );
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: fakeAssignee },
        };
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        const button = screen.getByRole("button", { name: "Cancelled" });
        await waitFor(() => {
            expect(button).toBeEnabled();
        });
    });

    test("don't allow setting the times when not assigned as a rider", async () => {
        const mockTask = new models.Task({ status: models.TaskStatus.ACTIVE });
        const fakeAssignee = new models.User({
            roles: [models.Role.RIDER, models.Role.USER],
            displayName: "test",
        });
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: fakeAssignee },
        };
        await DataStore.save(mockTask);
        await DataStore.save(fakeAssignee);
        const spy = jest.spyOn(DataStore, "query");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(3);
        });
        const button = screen.getByRole("button", { name: "Cancelled" });
        await waitFor(() => {
            expect(button).toBeDisabled();
        });
    });

    test.each`
        status
        ${models.TaskStatus.CANCELLED} | ${models.TaskStatus.REJECTED} | ${models.TaskStatus.COMPLETED}
    `("change the times without a name", async ({ status }) => {
        const date = new Date();
        let mockTask;
        if (status === models.TaskStatus.CANCELLED) {
            mockTask = new models.Task({
                status,
                timeCancelled: date.toISOString(),
            });
        } else if (status === models.TaskStatus.REJECTED) {
            mockTask = new models.Task({
                status,
                timeRejected: date.toISOString(),
            });
        } else {
            mockTask = new models.Task({
                status,
                timePickedUp: date.toISOString(),
                timeDroppedOff: date.toISOString(),
                timeRiderHome: date.toISOString(),
            });
        }

        const fakeAssignee = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.USER],
                displayName: "test",
            })
        );
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.COORDINATOR,
        });
        const mockAssignment2 = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: fakeAssignee },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        await DataStore.save(mockAssignment2);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        if (status === models.TaskStatus.REJECTED) {
            userEvent.click(
                screen.getByRole("button", { name: "edit Time rejected" })
            );
            const dateField = screen.getByRole("textbox", {
                name: /Choose date/,
            });
            expect(dateField).toHaveValue(
                moment(date).format("DD/MM/YYYY HH:mm")
            );
            const okButton = screen.getByRole("button", { name: "OK" });
            userEvent.click(okButton);
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                });
            });
        } else if (status === models.TaskStatus.CANCELLED) {
            userEvent.click(
                screen.getByRole("button", { name: "edit Time cancelled" })
            );
            const dateField = screen.getByRole("textbox", {
                name: /Choose date/,
            });
            expect(dateField).toHaveValue(
                moment(date).format("DD/MM/YYYY HH:mm")
            );
            const okButton = screen.getByRole("button", { name: "OK" });
            userEvent.click(okButton);
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                });
            });
        } else if (status === models.TaskStatus.COMPLETED) {
            userEvent.click(
                screen.getByRole("button", { name: "edit Time rider home" })
            );
            const dateField = screen.getByRole("textbox", {
                name: /Choose date/,
            });
            expect(dateField).toHaveValue(
                moment(date).format("DD/MM/YYYY HH:mm")
            );
            const okButton = screen.getByRole("button", { name: "OK" });
            userEvent.click(okButton);
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                });
            });
        }
    });

    test("change the times failure", async () => {
        const date = new Date();
        let mockTask;
        const status = models.TaskStatus.CANCELLED;
        mockTask = new models.Task({
            status,
            timeCancelled: date.toISOString(),
        });

        const fakeAssignee = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.USER],
                displayName: "test",
            })
        );
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.COORDINATOR,
        });
        const mockAssignment2 = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: fakeAssignee },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        await DataStore.save(mockAssignment2);
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Cancelled" })
            ).toBeEnabled();
        });
        userEvent.click(
            screen.getByRole("button", { name: "edit Time cancelled" })
        );
        const dateField = screen.getByRole("textbox", {
            name: /Choose date/,
        });
        expect(dateField).toHaveValue(moment(date).format("DD/MM/YYYY HH:mm"));
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalled();
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
        expect(dateField).toBeInTheDocument();
    });

    test.each`
        status
        ${models.TaskStatus.PICKED_UP} | ${models.TaskStatus.DROPPED_OFF}
    `("change the sender or recipient name and times", async ({ status }) => {
        const date = new Date();
        const date2 = moment(date).subtract(1, "day").toDate(); // date object
        const mockTask = new models.Task({
            status: models.TaskStatus.DROPPED_OFF,
            timePickedUp: date.toISOString(),
            timeDroppedOff: date2.toISOString(),
            timePickedUpSenderName: "someone person",
            timeDroppedOffRecipientName: "someone else",
        });
        const fakeAssignee = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.USER],
                displayName: "test",
            })
        );
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.COORDINATOR,
        });
        const mockAssignment2 = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: fakeAssignee },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        await DataStore.save(mockAssignment2);
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Delivered" })
            ).toBeEnabled();
        });
        const more = "more text";
        if (status === models.TaskStatus.PICKED_UP) {
            userEvent.click(
                screen.getByRole("button", { name: "edit Time picked up" })
            );
            const nameField = screen.getByRole("textbox", {
                name: "Sender name",
            });
            const dateField = screen.getByRole("textbox", {
                name: /Choose date/,
            });
            expect(dateField).toHaveValue(
                moment(date).format("DD/MM/YYYY HH:mm")
            );
            expect(nameField).toHaveValue(mockTask.timePickedUpSenderName);
            userEvent.type(nameField, more);
            expect(nameField).toHaveValue(
                `${mockTask.timePickedUpSenderName}${more}`
            );
            const okButton = screen.getByRole("button", { name: "OK" });
            userEvent.click(okButton);
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    timePickedUpSenderName: `${mockTask.timePickedUpSenderName}${more}`,
                });
            });
            // check the tooltip
            const tooltip = await screen.findByRole("button", {
                name: `${mockTask.timePickedUpSenderName}${more}`,
            });
            userEvent.hover(tooltip);
            await waitFor(() => {
                expect(
                    screen.getByText(/someone personmore text/)
                ).toBeInTheDocument();
            });
        } else {
            userEvent.click(
                screen.getByRole("button", { name: "edit Time delivered" })
            );
            const nameField = screen.getByRole("textbox", {
                name: "Recipient name",
            });
            expect(nameField).toHaveValue(mockTask.timeDroppedOffRecipientName);
            const dateField = screen.getByRole("textbox", {
                name: /Choose date/,
            });
            expect(dateField).toHaveValue(
                moment(date2).format("DD/MM/YYYY HH:mm")
            );
            userEvent.type(nameField, more);
            expect(nameField).toHaveValue(
                `${mockTask.timeDroppedOffRecipientName}${more}`
            );
            const okButton = screen.getByRole("button", { name: "OK" });
            userEvent.click(okButton);
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    timeDroppedOffRecipientName: `${mockTask.timeDroppedOffRecipientName}${more}`,
                });
            });
            // check the tooltip
            const tooltip = await screen.findByRole("button", {
                name: `${mockTask.timeDroppedOffRecipientName}${more}`,
            });
            userEvent.hover(tooltip);
            await waitFor(() => {
                expect(
                    screen.getByText(/someone elsemore text/)
                ).toBeInTheDocument();
            });
        }
    });

    test("change the sender details failure", async () => {
        const date = new Date();
        const mockTask = new models.Task({
            status: models.TaskStatus.DROPPED_OFF,
            timePickedUp: date.toISOString(),
            timePickedUpSenderName: "someone person",
        });
        const fakeAssignee = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.USER],
                displayName: "test",
            })
        );
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.COORDINATOR,
        });
        const mockAssignment2 = new models.TaskAssignee({
            task: mockTask,
            assignee: fakeAssignee,
            role: models.Role.RIDER,
        });
        const preloadedState = {
            roleView: models.Role.RIDER,
            whoami: { user: fakeAssignee },
        };
        await DataStore.save(mockTask);
        await DataStore.save(mockAssignment);
        await DataStore.save(mockAssignment2);
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error());
        render(<TaskActions taskId={mockTask.id} />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Picked up" })
            ).toBeEnabled();
        });
        const more = "more text";
        userEvent.click(
            screen.getByRole("button", { name: "edit Time picked up" })
        );
        const nameField = screen.getByRole("textbox", {
            name: "Sender name",
        });
        const dateField = screen.getByRole("textbox", {
            name: /Choose date/,
        });
        expect(dateField).toHaveValue(moment(date).format("DD/MM/YYYY HH:mm"));
        expect(nameField).toHaveValue(mockTask.timePickedUpSenderName);
        userEvent.type(nameField, more);
        expect(nameField).toHaveValue(
            `${mockTask.timePickedUpSenderName}${more}`
        );
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalled();
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
        expect(nameField).toBeInTheDocument();
    });
});
