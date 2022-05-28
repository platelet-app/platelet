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
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
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
    `("assign someone to a task", async ({ role }) => {
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
            })
        );
        const mockAssignment = new models.TaskAssignee({
            task: mockTask,
            assignee,
            role: role,
        });
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
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "Select All" }));
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(3);
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

        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, assignee.displayName);
        userEvent.click(screen.getByText(assignee.displayName));
        userEvent.click(screen.getByText("OK"));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining(_.omit(mockAssignment, "id"))
            );
        });
    });
});
