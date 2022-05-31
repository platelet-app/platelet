import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import { tasksStatus, userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import { createMatchMedia } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import { DataStore } from "aws-amplify";
import MultipleSelectionActionsMenu from "./MultipleSelectionActionsMenu";

describe("MultipleSelectionActionsMenu", () => {
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
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
    beforeEach(() => {
        jest.restoreAllMocks();
        mockDate();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        const tasks = await DataStore.query(models.Task);
        const users = await DataStore.query(models.User);
        const assignees = await DataStore.query(models.TaskAssignee);
        await Promise.all(
            [...tasks, ...users, ...assignees].map((t) => DataStore.delete(t))
        );
        global.Date = RealDate;
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
        mockAllIsIntersecting(true);
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
            mockAllIsIntersecting(true);
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
                .filter((button) => !button.textContent.includes(stringMatch));
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
            mockAllIsIntersecting(true);
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
                screen.getByRole("button", { name: "More Selection Actions" })
            );
            const cancelled = screen.getByRole("menuitem", {
                name: "Selection Cancelled",
            });
            const rejected = screen.getByRole("menuitem", {
                name: "Selection Rejected",
            });
            if (
                [
                    tasksStatus.new,
                    tasksStatus.active,
                    tasksStatus.pickedUp,
                ].includes(taskStatus)
            ) {
                expect(cancelled).not.toHaveAttribute("aria-disabled");
                expect(rejected).not.toHaveAttribute("aria-disabled");
            } else {
                expect(cancelled).toHaveAttribute("aria-disabled", "true");
                expect(rejected).toHaveAttribute("aria-disabled", "true");
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
        mockAllIsIntersecting(true);
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
        await waitFor(() => {
            expect(modelSpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByText("OK"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(4);
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
        } else {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                status: expectedStatus,
            });
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask2,
                status: expectedStatus,
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
            dashboardTabIndex: 1,
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
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(4);
        let buttonToClick = null;
        if (
            ["timePickedUp", "timeDroppedOff", "timeRiderHome"].includes(
                timeToSet
            )
        ) {
            buttonToClick = screen.getByRole("button", {
                name: "Selection " + buttonLabel,
            });
            expect(buttonToClick).toBeEnabled();
        } else {
            userEvent.click(
                screen.getByRole("button", { name: "More Selection Actions" })
            );
            if (timeToSet === "timeRejected") {
                buttonToClick = screen.getByRole("menuitem", {
                    name: "Selection Rejected",
                });
            } else {
                buttonToClick = screen.getByRole("menuitem", {
                    name: "Selection Cancelled",
                });
            }
            expect(buttonToClick).not.toHaveAttribute("aria-disabled");
        }
        userEvent.click(buttonToClick);
        await waitFor(() => {
            expect(modelSpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByText("OK"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask,
                status: newStatus,
                [timeToSet]: isoDate,
            });
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...mockTask2,
                status: newStatus,
                [timeToSet]: isoDate,
            });
        });
        expect(screen.queryByTestId("CheckBoxIcon")).toBeNull();
    });

    it.each`
        timeToSet
        ${"assignUser"} | ${"setTime"}
    `("shows the selection count", async ({ action }) => {
        const mockTasks = await Promise.all(
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
        mockAllIsIntersecting(true);
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
                screen.getByRole("button", { name: "More Selection Actions" })
            );
            userEvent.click(
                screen.getByRole("menuitem", {
                    name: "Selection Rejected",
                })
            );
        }
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(12);
        expect(screen.getByText(/10 items/)).toBeInTheDocument();
    });
});
