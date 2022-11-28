import { createMatchMedia, render } from "../../../test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import userEvent from "@testing-library/user-event";
import { DataStore } from "aws-amplify";
import MultipleSelectionActionsMenu from "./MultipleSelectionActionsMenu";
import TaskFilterTextField from "../../../components/TaskFilterTextfield";
import ActiveRidersChips from "./ActiveRidersChips";

const tenantId = "tenantId";

describe("MultipleSelectionActionsMenu", () => {
    const RealDate = Date;
    const isoDate = "2021-11-29T23:24:58.987Z";
    const dateString = "2021-11-29";

    function mockDate() {
        global.Date = class extends RealDate {
            constructor() {
                super();
                return new RealDate(isoDate);
            }
        };
    }

    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        global.Date = RealDate;
        const tasks = await DataStore.query(models.Task);
        const users = await DataStore.query(models.User);
        const assignees = await DataStore.query(models.TaskAssignee);
        await Promise.all(
            [...tasks, ...users, ...assignees].map((t) => DataStore.delete(t))
        );
    });
    test("select all items", async () => {
        for (const i in _.range(0, 10)) {
            await DataStore.save(
                new models.Task({ status: models.TaskStatus.NEW })
            );
        }
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            tenantId,
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
                <TasksGridColumn taskKey={[models.TaskStatus.NEW]} />
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
        ${models.TaskStatus.COMPLETED} | ${models.TaskStatus.ABANDONED} | ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
        ${models.TaskStatus.ACTIVE}    | ${models.TaskStatus.PICKED_UP} | ${models.TaskStatus.NEW}      | ${models.TaskStatus.DROPPED_OFF}
    `(
        "enables and disables the menu based on status",
        async ({ taskStatus }) => {
            await DataStore.save(new models.Task({ status: taskStatus }));
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [models.Role.COORDINATOR],
                    displayName: "Someone Person",
                })
            );
            const dashboardTabIndex = [
                models.TaskStatus.COMPLETED,
                models.TaskStatus.ABANDONED,
                models.TaskStatus.REJECTED,
                models.TaskStatus.CANCELLED,
            ].includes(taskStatus)
                ? 0
                : 1;
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex,
                whoami: { user: mockWhoami },
                tenantId,
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
                case models.TaskStatus.ACTIVE:
                    stringMatch = "Picked Up";
                    break;
                case models.TaskStatus.PICKED_UP:
                    stringMatch = "Delivered";
                    break;
                case models.TaskStatus.DROPPED_OFF:
                    stringMatch = "Rider Home";
                    break;
                default:
                    break;
            }
            const name = `Selection ${stringMatch}`;
            const actionButtonsFiltered = actionButtons
                .filter((button) => !button.textContent.includes("Assign User"))
                .filter((button) => !button.textContent.includes("Duplicate"))
                .filter((button) => !button.textContent.includes("Cancelled"))
                .filter((button) => !button.textContent.includes("Rejected"))
                .filter((button) => !button.textContent.includes(stringMatch));
            const rejectedCancelledButtons = actionButtons.filter(
                (button) =>
                    button.textContent.includes("Cancelled") ||
                    button.textContent.includes("Rejected")
            );
            const duplicateButton = screen.getByRole("button", {
                name: "Selection Duplicate",
            });
            if (
                [
                    models.TaskStatus.NEW,
                    models.TaskStatus.ACTIVE,
                    models.TaskStatus.PICKED_UP,
                    models.TaskStatus.DROPPED_OFF,
                ].includes(taskStatus)
            ) {
                expect(duplicateButton).toBeEnabled();
            } else {
                expect(duplicateButton).toBeDisabled();
            }

            const assignButton = screen.getByRole("button", {
                name: "Selection Assign User",
            });
            // assign users should always be enabled
            expect(assignButton).toBeEnabled();
            switch (taskStatus) {
                case models.TaskStatus.NEW:
                    // new tasks can only be assigned
                    for (const button of actionButtonsFiltered) {
                        expect(button).toBeDisabled();
                    }
                    break;
                case models.TaskStatus.ACTIVE:
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
                case models.TaskStatus.PICKED_UP:
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
                case models.TaskStatus.DROPPED_OFF:
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
                    models.TaskStatus.COMPLETED,
                    models.TaskStatus.CANCELLED,
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
        ${models.TaskStatus.COMPLETED} | ${models.TaskStatus.ABANDONED} | ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
        ${models.TaskStatus.ACTIVE}    | ${models.TaskStatus.PICKED_UP} | ${models.TaskStatus.NEW}      | ${models.TaskStatus.DROPPED_OFF}
    `(
        "cancelled and rejected are disabled based on status",
        async ({ taskStatus }) => {
            await DataStore.save(new models.Task({ status: taskStatus }));
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [models.Role.COORDINATOR],
                    displayName: "Someone Person",
                })
            );
            const dashboardTabIndex = [
                models.TaskStatus.COMPLETED,
                models.TaskStatus.ABANDONED,
                models.TaskStatus.REJECTED,
                models.TaskStatus.CANCELLED,
            ].includes(taskStatus)
                ? 0
                : 1;
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex,
                tenantId,
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
                    models.TaskStatus.NEW,
                    models.TaskStatus.ACTIVE,
                    models.TaskStatus.PICKED_UP,
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
        ${models.Role.COORDINATOR} | ${models.Role.RIDER}
    `("assign someone to two tasks", async ({ role }) => {
        const mockTask = await DataStore.save(
            new models.Task({ status: models.TaskStatus.NEW })
        );
        const mockTask2 = await DataStore.save(
            new models.Task({ status: models.TaskStatus.NEW })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
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
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            tenantId,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const mockAssignments = [mockTask, mockTask2].map(
            (t) =>
                new models.TaskAssignee({
                    task: t,
                    assignee,
                    role: role,
                    tenantId,
                })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const modelSpy = jest.spyOn(models.Task, "copyOf");
        render(
            <>
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={models.TaskStatus.NEW}
                    taskKey={[models.TaskStatus.NEW]}
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
        if (role === models.Role.COORDINATOR) {
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
        if (role === models.Role.RIDER) {
            await waitFor(() => {
                expect(modelSpy).toHaveBeenCalledTimes(2);
            });
        }
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(
                role === models.Role.RIDER ? 4 : 2
            );
        });
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(mockAssignments[0], "id"))
        );
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(mockAssignments[1], "id"))
        );
        const expectedStatus =
            role === models.Role.COORDINATOR
                ? models.TaskStatus.NEW
                : models.TaskStatus.ACTIVE;
        if (role === models.Role.RIDER) {
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
            taskData = { status: models.TaskStatus.ACTIVE };
            buttonLabel = "Picked Up";
            newStatus = models.TaskStatus.PICKED_UP;
        } else if (timeToSet === "timeDroppedOff") {
            taskData = {
                status: models.TaskStatus.PICKED_UP,
                timePickedUp: new Date().toISOString(),
            };
            buttonLabel = "Delivered";
            newStatus = models.TaskStatus.DROPPED_OFF;
        } else if (timeToSet === "timeRejected") {
            taskData = { status: models.TaskStatus.NEW };
            buttonLabel = "Rejected";
            newStatus = models.TaskStatus.REJECTED;
        } else if (timeToSet === "timeCancelled") {
            taskData = { status: models.TaskStatus.NEW };
            buttonLabel = "Cancelled";
            newStatus = models.TaskStatus.CANCELLED;
        } else if (timeToSet === "timeRiderHome") {
            taskData = {
                status: models.TaskStatus.DROPPED_OFF,
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
            };
            buttonLabel = "Rider Home";
            newStatus = models.TaskStatus.COMPLETED;
        }
        const mockTask = await DataStore.save(new models.Task(taskData));
        const mockTask2 = await DataStore.save(new models.Task(taskData));
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const mockRider = await DataStore.save(
            new models.User({
                roles: [models.Role.RIDER],
                displayName: "Rider",
            })
        );
        const assignments = await Promise.all(
            [mockTask, mockTask2].map((t) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: t,
                        assignee: mockRider,
                        role: models.Role.RIDER,
                    })
                )
            )
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            tenantId,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: assignments,
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
        if (timeToSet === "timePickedUp") {
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timePickedUpSenderName: null,
                });
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask2,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timePickedUpSenderName: null,
                });
            });
        } else if (timeToSet === "timeDroppedOff") {
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timeDroppedOffRecipientName: null,
                });
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask2,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timeDroppedOffRecipientName: null,
                });
            });
        } else {
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
        }
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
        ${"timePickedUp"} | ${"timeDroppedOff"}
    `("set the time on two tasks with names", async ({ timeToSet }) => {
        let taskData = {};
        let buttonLabel = null;
        let newStatus = null;
        if (timeToSet === "timePickedUp") {
            taskData = { status: models.TaskStatus.ACTIVE };
            buttonLabel = "Picked Up";
            newStatus = models.TaskStatus.PICKED_UP;
        } else if (timeToSet === "timeDroppedOff") {
            taskData = {
                status: models.TaskStatus.PICKED_UP,
                timePickedUp: new Date().toISOString(),
            };
            buttonLabel = "Delivered";
            newStatus = models.TaskStatus.DROPPED_OFF;
        }
        const mockTask = await DataStore.save(new models.Task(taskData));
        const mockTask2 = await DataStore.save(new models.Task(taskData));
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const mockRider = await DataStore.save(
            new models.User({
                roles: [models.Role.RIDER],
                displayName: "Rider",
            })
        );
        const assignments = await Promise.all(
            [mockTask, mockTask2].map((t) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: t,
                        assignee: mockRider,
                        role: models.Role.RIDER,
                    })
                )
            )
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            tenantId,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: assignments,
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
        const textBoxName =
            timeToSet === "timePickedUp" ? "Sender name" : "Recipient name";
        userEvent.type(
            screen.getByRole("textbox", { name: textBoxName }),
            "someone person"
        );
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeEnabled();
        userEvent.click(okButton);
        expect(okButton).toBeDisabled();
        if (timeToSet === "timePickedUp") {
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timePickedUpSenderName: "someone person",
                });
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask2,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timePickedUpSenderName: "someone person",
                });
            });
        } else if (timeToSet === "timeDroppedOff") {
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timeDroppedOffRecipientName: "someone person",
                });
            });
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTask2,
                    status: newStatus,
                    [timeToSet]: expect.any(String),
                    timeDroppedOffRecipientName: "someone person",
                });
            });
        }
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
                DataStore.save(
                    new models.Task({ status: models.TaskStatus.NEW })
                )
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            tenantId,
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
                    title={models.TaskStatus.NEW}
                    taskKey={[models.TaskStatus.NEW]}
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
        expect(screen.getByText("10 selected")).toBeInTheDocument();
        //expect(screen.getAllByText(/10 selected/)).toHaveLength(2);
    });

    test("throwing an error on save", async () => {
        DataStore.save(new models.Task({ status: models.TaskStatus.NEW }));
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            tenantId,
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
                    title={models.TaskStatus.NEW}
                    taskKey={[models.TaskStatus.NEW]}
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
        ${models.Role.COORDINATOR} | ${models.Role.RIDER}
    `(
        "the confirmation button is disabled when there are no assignees selected",
        async ({ role }) => {
            const mockTask = await DataStore.save(
                new models.Task({ status: models.TaskStatus.NEW })
            );
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [models.Role.COORDINATOR],
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
                tenantId,
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
                        title={models.TaskStatus.NEW}
                        taskKey={[models.TaskStatus.NEW]}
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
            if (role === models.Role.COORDINATOR) {
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
        ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
    `(
        "adds a comment reason if the rejected or cancelled",
        async ({ status }) => {
            const reason = "This is a reason";
            const mockTask = await DataStore.save(
                new models.Task({ status: models.TaskStatus.NEW })
            );
            const mockTask2 = await DataStore.save(
                new models.Task({ status: models.TaskStatus.NEW })
            );
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [models.Role.COORDINATOR],
                    displayName: "Someone Person",
                })
            );
            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex: 0,
                tenantId,
                whoami: { user: mockWhoami },
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };

            const mockComment = new models.Comment({
                parentId: mockTask.id,
                visibility: models.CommentVisibility.EVERYONE,
                tenantId: preloadedState.tenantId,
                body: reason,
                author: mockWhoami,
            });
            const mockComment2 = new models.Comment({
                parentId: mockTask.id,
                visibility: models.CommentVisibility.EVERYONE,
                tenantId: preloadedState.tenantId,
                body: reason,
                author: mockWhoami,
            });
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <>
                    <MultipleSelectionActionsMenu />
                    <TasksGridColumn
                        title={models.TaskStatus.NEW}
                        taskKey={[models.TaskStatus.NEW]}
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
                status === models.TaskStatus.REJECTED
                    ? "Rejected"
                    : "Cancelled";
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
                status === models.TaskStatus.REJECTED
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

    test("show hint on duplicate if some picked up or dropped off tasks", async () => {
        await Promise.all(
            _.range(2).map((i) =>
                DataStore.save(
                    new models.Task({
                        status:
                            i === 0
                                ? models.TaskStatus.PICKED_UP
                                : models.TaskStatus.DROPPED_OFF,
                        tenantId,
                    })
                )
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.RIDER],
                displayName: "Someone Person",
                riderRole: "some role",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            tenantId,
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
                    title={models.TaskStatus.PICKED_UP}
                    taskKey={[
                        models.TaskStatus.PICKED_UP,
                        models.TaskStatus.DROPPED_OFF,
                    ]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        userEvent.click(
            screen.getByRole("button", { name: "Selection Duplicate" })
        );
        expect(
            screen.getByText(
                "Picked up and delivered times will not be copied."
            )
        ).toBeInTheDocument();
    });

    test.each`
        view
        ${"mobile"} | ${"desktop"}
    `("no duplicate button in rider view", async ({ view }) => {
        const mockTasks = await Promise.all(
            _.range(2).map(() =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.ACTIVE,
                        tenantId,
                    })
                )
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.RIDER],
                displayName: "Someone Person",
                riderRole: "some role",
                tenantId,
            })
        );
        const mockAssignments = await Promise.all(
            mockTasks.map((task) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task,
                        assignee: mockWhoami,
                        role: models.Role.RIDER,
                        tenantId,
                    })
                )
            )
        );
        const preloadedState = {
            roleView: models.Role.RIDER,
            dashboardTabIndex: 0,
            tenantId,
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
                <MultipleSelectionActionsMenu />
                <TasksGridColumn
                    title={models.TaskStatus.ACTIVE}
                    taskKey={[models.TaskStatus.ACTIVE]}
                />
            </>,
            {
                preloadedState,
            }
        );
        if (view === "mobile") window.matchMedia = createMatchMedia(128);
        else window.matchMedia = createMatchMedia(1280);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        if (view === "desktop") {
            userEvent.click(screen.getByRole("button", { name: "Select All" }));
            expect(
                screen.queryByRole("button", { name: "Selection Duplicate" })
            ).toBeNull();
        } else {
            userEvent.click(
                screen.getByRole("button", { name: "ACTIVE Select All" })
            );
            userEvent.click(
                screen.getByRole("button", { name: "More Selection Actions" })
            );
            expect(
                screen.queryByRole("menuitem", { name: "Duplicate" })
            ).toBeNull();
        }
    });

    test.each`
        listedType
        ${"unlisted"} | ${"listed"}
    `(
        "duplicate with listed and unlisted locations",
        async ({ listedType }) => {
            mockDate();
            const listed = listedType === "unlisted" ? 0 : 1;
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [models.Role.COORDINATOR, models.Role.RIDER],
                    displayName: "Someone Person",
                    riderRole: "some role",
                    tenantId,
                })
            );
            const mockLocation1 = new models.Location({
                listed,
                line1: "some line",
                tenantId,
            });
            const mockLocation2 = new models.Location({
                listed,
                line1: "some line 2",
                tenantId,
            });
            const mockLocation3 = new models.Location({
                listed,
                line1: "woop 1",
                tenantId,
            });
            const mockLocation4 = new models.Location({
                listed,
                line1: "woop 2",
                tenantId,
            });
            const mockEstablishment1 = new models.Location({
                listed,
                line1: "est 1",
                tenantId,
            });
            const mockEstablishment2 = new models.Location({
                listed,
                line1: "est 2",
                tenantId,
            });

            const mockTasks = await Promise.all(
                _.range(2).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: models.TaskStatus.NEW,
                            createdBy: mockWhoami,
                            pickUpLocation:
                                i === 0 ? mockLocation1 : mockLocation3,
                            dropOffLocation:
                                i === 0 ? mockLocation2 : mockLocation4,
                            establishmentLocation:
                                i === 0
                                    ? mockEstablishment1
                                    : mockEstablishment2,
                            tenantId,
                        })
                    )
                )
            );

            const preloadedState = {
                roleView: "ALL",
                dashboardTabIndex: 0,
                tenantId,
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
                        title={models.TaskStatus.NEW}
                        taskKey={[models.TaskStatus.NEW]}
                    />
                </>,
                {
                    preloadedState,
                }
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            userEvent.click(screen.getByRole("button", { name: "Select All" }));
            userEvent.click(
                screen.getByRole("button", { name: "Selection Duplicate" })
            );
            userEvent.click(
                screen.getByRole("button", { name: "Copy my comments" })
            );
            userEvent.click(
                screen.getByRole("button", { name: "Copy assignees" })
            );
            const okButton = screen.getByRole("button", { name: "OK" });
            userEvent.click(okButton);
            expect(okButton).toBeDisabled();
            if (listedType === "listed") {
                await waitFor(() => {
                    expect(saveSpy).toHaveBeenCalledTimes(4);
                });
            } else {
                await waitFor(() => {
                    expect(saveSpy).toHaveBeenCalledTimes(10);
                });
            }

            if (listedType === "listed") {
                mockTasks.forEach((t) => {
                    expect(saveSpy).toHaveBeenCalledWith({
                        ...t,
                        dateCreated: dateString,
                        id: expect.not.stringMatching(t.id),
                        tenantId,
                    });
                });
            } else {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTasks[0],
                    dateCreated: dateString,
                    tenantId,
                    id: expect.not.stringMatching(mockTasks[0].id),
                    pickUpLocation: {
                        ...mockLocation1,
                        id: expect.not.stringMatching(mockLocation1.id),
                        tenantId,
                    },
                    dropOffLocation: {
                        ...mockLocation2,
                        id: expect.not.stringMatching(mockLocation2.id),
                        tenantId,
                    },
                    establishmentLocation: {
                        ...mockEstablishment1,
                        id: expect.not.stringMatching(mockEstablishment1.id),
                        tenantId,
                    },
                });
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockTasks[1],
                    dateCreated: dateString,
                    tenantId,
                    id: expect.not.stringMatching(mockTasks[1].id),
                    pickUpLocation: {
                        ...mockLocation3,
                        id: expect.not.stringMatching(mockLocation3.id),
                        tenantId,
                    },
                    dropOffLocation: {
                        ...mockLocation4,
                        id: expect.not.stringMatching(mockLocation4.id),
                        tenantId,
                    },
                    establishmentLocation: {
                        ...mockEstablishment2,
                        id: expect.not.stringMatching(mockEstablishment2.id),
                        tenantId,
                    },
                });
                [
                    mockLocation1,
                    mockLocation2,
                    mockLocation3,
                    mockLocation4,
                    mockEstablishment1,
                    mockEstablishment2,
                ].forEach((loc) => {
                    expect(saveSpy).toHaveBeenCalledWith({
                        ...loc,
                        id: expect.not.stringMatching(loc.id),
                    });
                });
            }
        }
    );
    // removed rider role for now
    test.each`
        role
        ${models.Role.COORDINATOR} | ${"ALL"}
    `("duplicate some tasks and assign self", async ({ role }) => {
        mockDate();
        let actualRole = [models.Role.COORDINATOR, "ALL"].includes(role)
            ? models.Role.COORDINATOR
            : models.Role.RIDER;

        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR, models.Role.RIDER],
                displayName: "Someone Person",
                riderRole: "some role",
                tenantId,
            })
        );

        const mockTasks = await Promise.all(
            _.range(2).map(() =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.ACTIVE,
                        tenantId,
                    })
                )
            )
        );
        const mockDeliverableTypes = await Promise.all(
            _.range(2).map((i) =>
                DataStore.save(
                    new models.DeliverableType({ label: `test-${i}`, tenantId })
                )
            )
        );
        const deliverable1 = await DataStore.save(
            new models.Deliverable({
                task: mockTasks[0],
                deliverableType: mockDeliverableTypes[0],
                count: 1,
                tenantId,
            })
        );
        const deliverable2 = await DataStore.save(
            new models.Deliverable({
                task: mockTasks[1],
                deliverableType: mockDeliverableTypes[0],
                count: 2,
                tenantId,
            })
        );

        const someoneElse = await DataStore.save(
            new models.User({ displayName: "eee", tenantId })
        );

        const mockAssignments = await Promise.all(
            mockTasks.map((task) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task,
                        assignee: mockWhoami,
                        role: actualRole,
                        tenantId,
                    })
                )
            )
        );
        const mockAssignmentsSomeoneElse = await Promise.all(
            mockTasks.map((task) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task,
                        assignee: someoneElse,
                        role: models.Role.RIDER,
                        tenantId,
                    })
                )
            )
        );

        const myComments = await Promise.all(
            mockTasks.map((t) =>
                DataStore.save(
                    new models.Comment({
                        parentId: t.id,
                        body: "something",
                        author: mockWhoami,
                        tenantId,
                    })
                )
            )
        );

        const notMyComments = await Promise.all(
            mockTasks.map((t) =>
                DataStore.save(
                    new models.Comment({
                        parentId: t.id,
                        body: "something",
                        author: someoneElse,
                        tenantId,
                    })
                )
            )
        );

        const preloadedState = {
            roleView: role,
            dashboardTabIndex: 0,
            tenantId,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: mockAssignments,
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
                    title={models.TaskStatus.ACTIVE}
                    taskKey={[models.TaskStatus.ACTIVE]}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        userEvent.click(
            screen.getByRole("button", { name: "Selection Duplicate" })
        );
        userEvent.click(
            screen.getByRole("button", { name: "Copy my comments" })
        );
        userEvent.click(screen.getByRole("button", { name: "Copy assignees" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        expect(okButton).toBeDisabled();
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(10);
        });
        mockTasks.forEach((t) => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...t,
                tenantId,
                createdBy: mockWhoami,
                id: expect.not.stringMatching(t.id),
                dateCreated: dateString,
            });
        });
        const mockAssigns = mockTasks.map(
            (task) =>
                new models.TaskAssignee({
                    task: {
                        ...task,
                        createdBy: mockWhoami,
                        dateCreated: dateString,
                    },
                    assignee: mockWhoami,
                    role: actualRole,
                    tenantId,
                })
        );

        mockAssignmentsSomeoneElse.forEach((a) => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...a,
                tenantId,
                id: expect.any(String),
                task: {
                    ...a.task,
                    createdBy: mockWhoami,
                    dateCreated: dateString,
                    id: expect.not.stringMatching(a.task.id),
                },
            });
        });

        mockAssigns.forEach((a) => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...a,
                id: expect.any(String),
                tenantId,
                task: {
                    ...a.task,
                    createdBy: mockWhoami,
                    dateCreated: dateString,
                    id: expect.not.stringMatching(a.task.id),
                },
            });
        });
        [(deliverable1, deliverable2)].forEach((d) => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...d,
                tenantId,
                task: {
                    ...d.task,
                    createdBy: mockWhoami,
                    dateCreated: dateString,
                    id: expect.not.stringMatching(d.task.id),
                },
                id: expect.not.stringMatching(d.id),
            });
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...myComments[0],
            tenantId,
            id: expect.not.stringMatching(myComments[0].id),
            parentId: expect.not.stringMatching(mockTasks[0].id),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...myComments[1],
            tenantId,
            id: expect.not.stringMatching(myComments[1].id),
            parentId: expect.not.stringMatching(mockTasks[1].id),
        });
        // doesn't save the comments that aren't mine
        expect(saveSpy).not.toHaveBeenCalledWith({
            ...notMyComments[0],
            tenantId,
            id: expect.not.stringMatching(notMyComments[0].id),
            parentId: expect.not.stringMatching(mockTasks[0].id),
        });
        expect(saveSpy).not.toHaveBeenCalledWith({
            ...notMyComments[1],
            tenantId,
            id: expect.not.stringMatching(notMyComments[1].id),
            parentId: expect.not.stringMatching(mockTasks[1].id),
        });
    });

    test("the checkboxes are disabled when filters are applied", async () => {
        const mockTask = await DataStore.save(
            new models.Task({ status: models.TaskStatus.ACTIVE })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const mockRider = await DataStore.save(
            new models.User({
                roles: [models.Role.RIDER],
                displayName: "Test Rider",
            })
        );
        const mockAssignments = [
            await DataStore.save(
                new models.TaskAssignee({
                    task: mockTask,
                    assignee: mockRider,
                    role: models.Role.RIDER,
                })
            ),
        ];

        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            tenantId,
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
            new models.Task({ status: models.TaskStatus.NEW })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            tenantId,
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
        const dateBox = screen.getByRole("textbox", { name: /Choose date/ });
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeEnabled();
        userEvent.clear(dateBox);
        expect(dateBox).toHaveValue("");
        await waitFor(() => {
            expect(okButton).toBeDisabled();
        });
    });

    test("double confirm if affecting a lot of items", async () => {
        const mockTasks = await Promise.all(
            _.range(10).map(() =>
                DataStore.save(
                    new models.Task({ status: models.TaskStatus.NEW })
                )
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const assignee = await DataStore.save(
            new models.User({
                roles: [models.Role.RIDER],
                displayName: "Other Person",
                riderResponsibility: "test",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 0,
            tenantId,
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
                    title={models.TaskStatus.NEW}
                    taskKey={[models.TaskStatus.NEW]}
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
        userEvent.click(
            screen.getByRole("button", { name: "Selection Assign User" })
        );
        const textBox = screen.getByRole("textbox");
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(12);
        });
        userEvent.type(textBox, assignee.displayName);
        userEvent.click(screen.getByText(assignee.displayName));
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        expect(
            screen.getByText("You have 10 items selected.")
        ).toBeInTheDocument();
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(0);
        });
        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledTimes(20);
        });
        expect(screen.queryByTestId("CheckBoxIcon")).toBeNull();
    });
});
