import React from "react";
import { render } from "../../../test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import { commentVisibility, tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import userEvent from "@testing-library/user-event";
import { DataStore } from "aws-amplify";
import MultipleSelectionActionsMenu from "./MultipleSelectionActionsMenu";
import { DashboardDetailTabs } from "./DashboardDetailTabs";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import ActiveRidersChips from "./ActiveRidersChips";

describe("MultipleSelectionActionsMenu", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        const tasks = await DataStore.query(models.Task);
        const users = await DataStore.query(models.User);
        const assignees = await DataStore.query(models.TaskAssignee);
        await Promise.all(
            [...tasks, ...users, ...assignees].map((t) => DataStore.delete(t))
        );
    });
    test("select all items", async () => {
        for (const i in _.range(0, 10)) {
            await DataStore.save(new models.Task({ status: tasksStatus.new }));
        }
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn taskKey={[tasksStatus.new]} />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(11);
        });
        expect(
            await screen.findAllByTestId("CheckBoxOutlineBlankIcon")
        ).toHaveLength(12);
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(12);
    });
    test.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}   | ${tasksStatus.new}      | ${tasksStatus.droppedOff}
    `(
        "enables and disables the menu based on status",
        async ({ taskStatus }) => {
            await DataStore.save(new models.Task({ status: taskStatus }));
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [userRoles.coordinator],
                    displayName: "Someone Person",
                })
            );
            const dashboardTabIndex = [
                tasksStatus.completed,
                tasksStatus.droppedOff,
                tasksStatus.rejected,
                tasksStatus.cancelled,
            ].includes(taskStatus)
                ? 0
                : 1;
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex,
                whoami: { user: mockWhoami },
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };
            const querySpy = jest.spyOn(DataStore, "query");
            render(
                <>
                    <MultipleSelectionActionsMenu />
                    <TasksGridColumn
                        title={taskStatus}
                        taskKey={[taskStatus]}
                    />
                </>,
                {
                    preloadedState,
                }
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(2);
            });
            userEvent.click(screen.getByRole("button", { name: "Select All" }));
            expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(
                3
            );
            const actionButtons = await screen.findAllByTestId(
                "select-action-button"
            );
            let stringMatch = "none";
            switch (taskStatus) {
                case tasksStatus.active:
                    stringMatch = "Picked Up";
                    break;
                case tasksStatus.pickedUp:
                    stringMatch = "Delivered";
                    break;
                case tasksStatus.droppedOff:
                    stringMatch = "Rider Home";
                    break;
                default:
                    break;
            }
            const name = `Selection ${stringMatch}`;
            const actionButtonsFiltered = actionButtons
                .filter((button) => !button.textContent.includes("Assign User"))
                .filter((button) => !button.textContent.includes("Cancelled"))
                .filter((button) => !button.textContent.includes("Rejected"))
                .filter((button) => !button.textContent.includes(stringMatch));
            const rejectedCancelledButtons = actionButtons.filter(
                (button) =>
                    button.textContent.includes("Cancelled") ||
                    button.textContent.includes("Rejected")
            );
            const assignButton = screen.getByRole("button", {
                name: "Selection Assign User",
            });
            // assign users should always be enabled
            expect(assignButton).toBeEnabled();
            switch (taskStatus) {
                case tasksStatus.new:
                    // new tasks can only be assigned
                    for (const button of actionButtonsFiltered) {
                        expect(button).toBeDisabled();
                    }
                    break;
                case tasksStatus.active:
                    // active tasks can only be picked up
                    expect(
                        screen.getByRole("button", {
                            name,
                        })
                    ).toBeEnabled();
                    for (const button of actionButtonsFiltered) {
                        expect(button).toBeDisabled();
                    }
                    // or cancelled and rejected
                    for (const button of rejectedCancelledButtons) {
                        expect(button).toBeEnabled();
                    }
                    break;
                case tasksStatus.pickedUp:
                    // picked up tasks can only be delivered
                    expect(
                        screen.getByRole("button", {
                            name,
                        })
                    ).toBeEnabled();
                    for (const button of actionButtonsFiltered) {
                        expect(button).toBeDisabled();
                    }
                    // or cancelled and rejected
                    for (const button of rejectedCancelledButtons) {
                        expect(button).toBeEnabled();
                    }
                    break;
                case tasksStatus.droppedOff:
                    // delivered tasks can only be rider home
                    expect(
                        screen.getByRole("button", {
                            name,
                        })
                    ).toBeEnabled();
                    for (const button of actionButtonsFiltered) {
                        expect(button).toBeDisabled();
                    }
                    // not cancelled and rejected
                    for (const button of rejectedCancelledButtons) {
                        expect(button).toBeDisabled();
                    }
                    break;
                case [
                    tasksStatus.completed,
                    tasksStatus.cancelled,
                    taskStatus.rejected,
                    taskStatus.abandoned,
                ].includes(taskStatus):
                    // everything else means disabled
                    for (const button of actionButtonsFiltered) {
                        expect(button).toBeDisabled();
                    }
                    for (const button of rejectedCancelledButtons) {
                        expect(button).toBeDisabled();
                    }
                    break;
                default:
                    break;
            }
        }
    );

    test.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}   | ${tasksStatus.new}      | ${tasksStatus.droppedOff}
    `(
        "cancelled and rejected are disabled based on status",
        async ({ taskStatus }) => {
            await DataStore.save(new models.Task({ status: taskStatus }));
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [userRoles.coordinator],
                    displayName: "Someone Person",
                })
            );
            const dashboardTabIndex = [
                tasksStatus.completed,
                tasksStatus.droppedOff,
                tasksStatus.rejected,
                tasksStatus.cancelled,
            ].includes(taskStatus)
                ? 0
                : 1;
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex,
                whoami: { user: mockWhoami },
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };
            const querySpy = jest.spyOn(DataStore, "query");
            render(
                <>
                    <MultipleSelectionActionsMenu />
                    <TasksGridColumn
                        title={taskStatus}
                        taskKey={[taskStatus]}
                    />
                </>,
                {
                    preloadedState,
                }
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(2);
            });
            userEvent.click(screen.getByRole("button", { name: "Select All" }));
            expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(
                3
            );
            const cancelled = screen.getByRole("button", {
                name: "Selection Cancelled",
            });
            const rejected = screen.getByRole("button", {
                name: "Selection Rejected",
            });
            if (
                [
                    tasksStatus.new,
                    tasksStatus.active,
                    tasksStatus.pickedUp,
                ].includes(taskStatus)
            ) {
                expect(cancelled).toBeEnabled();
                expect(rejected).toBeEnabled();
            } else {
                expect(cancelled).toBeDisabled();
                expect(rejected).toBeDisabled();
            }
        }
    );

    test.each`
        role
        ${userRoles.coordinator} | ${userRoles.rider}
    `("assign someone to two tasks", async ({ role }) => {
        const mockTask = await DataStore.save(
            new models.Task({ status: tasksStatus.new })
        );
        const mockTask2 = await DataStore.save(
            new models.Task({ status: tasksStatus.new })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const assignee = await DataStore.save(
            new models.User({
                roles: [role],
                displayName: "Other Person",
                riderResponsibility: "test",
            })
        );
        const mockAssignments = [mockTask, mockTask2].map(
            (t) =>
                new models.TaskAssignee({
                    task: t,
                    assignee,
                    role: role,
                })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const modelSpy = jest.spyOn(models.Task, "copyOf");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(4);
        userEvent.click(
            screen.getByRole("button", { name: "Selection Assign User" })
        );
        if (role === userRoles.coordinator) {
            userEvent.click(screen.getByText("COORDINATOR"));
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(5);
            });
        } else {
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(4);
            });
        }

        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, assignee.displayName);
        userEvent.click(screen.getByText(assignee.displayName));
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeEnabled();
        userEvent.click(okButton);
        expect(okButton).toBeDisabled();
        if (role === userRoles.rider) {
            await waitFor(() => {
                expect(modelSpy).toHaveBeenCalledTimes(2);
            });
        }
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(
                role === userRoles.rider ? 4 : 2
            );
        });
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(mockAssignments[0], "id"))
        );
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(mockAssignments[1], "id"))
        );
        const expectedStatus =
            role === userRoles.coordinator
                ? tasksStatus.new
                : tasksStatus.active;
        if (role === userRoles.rider) {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                status: expectedStatus,
                riderResponsibility: assignee.riderResponsibility,
            });
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask2,
                status: expectedStatus,
                riderResponsibility: assignee.riderResponsibility,
            });
        }
        expect(screen.queryByTestId("CheckBoxIcon")).toBeNull();
    });

    it.each`
        timeToSet
        ${"timePickedUp"} | ${"timeDroppedOff"} | ${"timeRejected"} | ${"timeCancelled"} | ${"timeRiderHome"}
    `("set the time on two tasks", async ({ timeToSet }) => {
        let taskData = {};
        let buttonLabel = null;
        let newStatus = null;
        if (timeToSet === "timePickedUp") {
            taskData = { status: tasksStatus.active };
            buttonLabel = "Picked Up";
            newStatus = tasksStatus.pickedUp;
        } else if (timeToSet === "timeDroppedOff") {
            taskData = {
                status: tasksStatus.pickedUp,
                timePickedUp: new Date().toISOString(),
            };
            buttonLabel = "Delivered";
            newStatus = tasksStatus.droppedOff;
        } else if (timeToSet === "timeRejected") {
            taskData = { status: tasksStatus.new };
            buttonLabel = "Rejected";
            newStatus = tasksStatus.rejected;
        } else if (timeToSet === "timeCancelled") {
            taskData = { status: tasksStatus.new };
            buttonLabel = "Cancelled";
            newStatus = tasksStatus.cancelled;
        } else if (timeToSet === "timeRiderHome") {
            taskData = {
                status: tasksStatus.droppedOff,
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
            };
            buttonLabel = "Rider Home";
            newStatus = tasksStatus.completed;
        }
        const mockTask = await DataStore.save(new models.Task(taskData));
        const mockTask2 = await DataStore.save(new models.Task(taskData));
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const mockRider = await DataStore.save(
            new models.User({ roles: [userRoles.rider], displayName: "Rider" })
        );
        const assignments = await Promise.all(
            [mockTask, mockTask2].map((t) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: t,
                        assignee: mockRider,
                        role: userRoles.rider,
                    })
                )
            )
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: assignments,
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const modelSpy = jest.spyOn(models.Task, "copyOf");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={mockTask.status}
                    taskKey={[mockTask.status]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(4);
        const buttonToClick = screen.getByRole("button", {
            name: "Selection " + buttonLabel,
        });
        expect(buttonToClick).toBeEnabled();
        userEvent.click(buttonToClick);
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeEnabled();
        userEvent.click(okButton);
        expect(okButton).toBeDisabled();
        // this should really check the time
        // but I can't get the stupid mocking to work
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                status: newStatus,
                [timeToSet]: expect.any(String),
            });
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask2,
                status: newStatus,
                [timeToSet]: expect.any(String),
            });
        });
        expect(screen.queryByTestId("CheckBoxIcon")).toBeNull();
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(5);
        });
        expect(
            await screen.findAllByTestId("CheckBoxOutlineBlankIcon")
        ).toHaveLength(1);
    });

    it.each`
        timeToSet
        ${"assignUser"} | ${"setTime"}
    `("shows the selection count", async ({ action }) => {
        await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(new models.Task({ status: tasksStatus.new }))
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(11);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        if (action === "assignUser") {
            userEvent.click(
                screen.getByRole("button", { name: "Selection Assign User" })
            );
        } else {
            userEvent.click(
                screen.getByRole("button", { name: "Selection Rejected" })
            );
        }
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(12);
        expect(screen.getAllByText(/10 items/)).toHaveLength(2);
    });

    test("throwing an error on save", async () => {
        const mockTask = DataStore.save(
            new models.Task({ status: tasksStatus.new })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error("Something went wrong"));
        const modelSpy = jest.spyOn(models.Task, "copyOf");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        userEvent.click(
            screen.getByRole("button", { name: "Selection Rejected" })
        );
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeEnabled();
        userEvent.click(okButton);
        expect(okButton).toBeDisabled();
        await waitFor(() => {
            expect(modelSpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });
        const spinner = await screen.findByTestId(
            "progressive-loading-spinner"
        );

        await waitFor(() => {
            expect(screen.queryByText("OK")).toBeNull();
        });
        fireEvent.mouseOver(spinner);
        expect(
            await screen.findByText(
                "An error occurred and data may not have been saved"
            )
        ).toBeInTheDocument();
    });
    test.each`
        role
        ${userRoles.coordinator} | ${userRoles.rider}
    `(
        "the confirmation button is disabled when there are no assignees selected",
        async ({ role }) => {
            const mockTask = await DataStore.save(
                new models.Task({ status: tasksStatus.new })
            );
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [userRoles.coordinator],
                    displayName: "Someone Person",
                })
            );
            const assignee = await DataStore.save(
                new models.User({
                    roles: [role],
                    displayName: "Other Person",
                    riderResponsibility: "test",
                })
            );
            const mockAssignments = [mockTask].map(
                (t) =>
                    new models.TaskAssignee({
                        task: t,
                        assignee,
                        role: role,
                    })
            );
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex: 1,
                whoami: { user: mockWhoami },
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };
            const querySpy = jest.spyOn(DataStore, "query");
            render(
                <>
                    <MultipleSelectionActionsMenu />
                    <TasksGridColumn
                        title={tasksStatus.new}
                        taskKey={[tasksStatus.new]}
                    />
                </>,
                {
                    preloadedState,
                }
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(2);
            });
            userEvent.click(screen.getByRole("button", { name: "Select All" }));
            expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(
                3
            );
            userEvent.click(
                screen.getByRole("button", { name: "Selection Assign User" })
            );
            if (role === userRoles.coordinator) {
                userEvent.click(screen.getByText("COORDINATOR"));
                await waitFor(() => {
                    expect(querySpy).toHaveBeenCalledTimes(4);
                });
            } else {
                await waitFor(() => {
                    expect(querySpy).toHaveBeenCalledTimes(3);
                });
            }

            const okButton = screen.getByRole("button", { name: "OK" });
            expect(okButton).toBeDisabled();
            const textBox = screen.getByRole("textbox");
            userEvent.type(textBox, assignee.displayName);
            userEvent.click(screen.getByText(assignee.displayName));
            expect(okButton).toBeEnabled();
            userEvent.click(screen.getByTestId("CancelIcon"));
            await waitFor(() => {
                expect(okButton).toBeDisabled();
            });
        }
    );

    test.each`
        status
        ${tasksStatus.rejected} | ${tasksStatus.cancelled}
    `(
        "adds a comment reason if the rejected or cancelled",
        async ({ status }) => {
            const reason = "This is a reason";
            const mockTask = await DataStore.save(
                new models.Task({ status: tasksStatus.new })
            );
            const mockTask2 = await DataStore.save(
                new models.Task({ status: tasksStatus.new })
            );
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [userRoles.coordinator],
                    displayName: "Someone Person",
                })
            );
            const mockComment = new models.Comment({
                parentId: mockTask.id,
                visibility: commentVisibility.everyone,
                body: reason,
                author: mockWhoami,
            });
            const mockComment2 = new models.Comment({
                parentId: mockTask.id,
                visibility: commentVisibility.everyone,
                body: reason,
                author: mockWhoami,
            });
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex: 0,
                whoami: { user: mockWhoami },
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };

            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <>
                    <MultipleSelectionActionsMenu />
                    <TasksGridColumn
                        title={tasksStatus.new}
                        taskKey={[tasksStatus.new]}
                    />
                </>,
                {
                    preloadedState,
                }
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(3);
            });
            const label =
                status === tasksStatus.rejected ? "Rejected" : "Cancelled";
            userEvent.click(screen.getByRole("button", { name: "Select All" }));
            userEvent.click(
                screen.getByRole("button", { name: `Selection ${label}` })
            );
            const textBox = screen.getByRole("textbox", {
                name: "Enter a reason",
            });
            userEvent.type(textBox, reason);
            userEvent.click(screen.getByRole("button", { name: "OK" }));
            const key =
                status === tasksStatus.rejected
                    ? "timeRejected"
                    : "timeCancelled";
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    status,
                    [key]: expect.any(String),
                });
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask2,
                    status,
                    [key]: expect.any(String),
                });
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith(
                    expect.objectContaining(_.omit(mockComment, "id"))
                );
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith(
                    expect.objectContaining(_.omit(mockComment2, "id"))
                );
            });
        }
    );

    test("the checkboxes are disabled when filters are applied", async () => {
        const mockTask = await DataStore.save(
            new models.Task({ status: tasksStatus.active })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const mockRider = await DataStore.save(
            new models.User({
                roles: [userRoles.rider],
                displayName: "Test Rider",
            })
        );
        const mockAssignments = [
            await DataStore.save(
                new models.TaskAssignee({
                    task: mockTask,
                    assignee: mockRider,
                    role: userRoles.rider,
                })
            ),
        ];

        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: mockAssignments,
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <TaskFilterTextField />
                <ActiveRidersChips />
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={mockTask.status}
                    taskKey={[mockTask.status]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const searchBox = screen.getByRole("textbox", { name: "Filter tasks" });
        const headerCheckbox = screen.getByTestId(
            `${mockTask.status}-select-all`
        );
        expect(headerCheckbox).toBeEnabled();
        userEvent.type(searchBox, "test");
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Select All" })
            ).toBeDisabled();
        });
        expect(
            screen.queryByTestId(`${mockTask.status}-select-all`)
        ).toBeNull();
        fireEvent.change(searchBox, { target: { value: "" } });
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Select All" })
            ).toBeEnabled();
        });
        await waitFor(() => {
            expect(headerCheckbox).toBeEnabled();
        });
        userEvent.click(await screen.findByText(mockRider.displayName));
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Select All" })
            ).toBeDisabled();
        });
        await waitFor(() => {
            expect(headerCheckbox).toBeEnabled();
        });
        userEvent.click(await screen.findByText(mockRider.displayName));
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: "Select All" })
            ).toBeEnabled();
        });
    });

    it.skip("disables the confirmation button if the time is invalid", async () => {
        // skipped because for some reason the date picker is read only when used in jest
        const mockTask = await DataStore.save(
            new models.Task({ status: tasksStatus.new })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={mockTask.status}
                    taskKey={[mockTask.status]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(3);
        const buttonToClick = screen.getByRole("button", {
            name: "Selection Cancelled",
        });
        expect(buttonToClick).toBeEnabled();
        userEvent.click(buttonToClick);
        const dateBox = screen.getByRole("textbox");
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeEnabled();
        userEvent.type(dateBox, "invalid date");
        await waitFor(() => {
            expect(okButton).toBeDisabled();
        });
    });
});
