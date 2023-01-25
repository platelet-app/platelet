import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import DashboardDetailTabs from "./DashboardDetailTabs";
import { createMatchMedia } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import * as dashboardUtils from "../utilities/functions";
import { convertListDataToObject } from "../../../utilities";
import ActiveRidersChips from "./ActiveRidersChips";
import moment from "moment";
import { DataStore, Logger } from "aws-amplify";
import { setTaskAssignees } from "../../../redux/taskAssignees/taskAssigneesActions";

Logger.LOG_LEVEL = "ERROR";

const testUserModel = new models.User({
    name: "whoami",
    displayName: "Mock User",
    roles: Object.values(models.Role),
    dateOfBirth: null,
    profilePictureURL: null,
    profilePictureThumbnailURL: null,
});

export const testUser = { ...testUserModel, id: "whoami" };

const preloadedState = {
    taskAssigneesReducer: { items: [], ready: true, isSynced: true },
    whoami: { user: testUser },
};

describe("TasksGridColumn", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    it("renders without crashing", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={[models.TaskStatus.NEW]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        querySpy.mockClear();
    });

    it.each`
        roleView
        ${models.Role.RIDER} | ${models.Role.COORDINATOR}
    `("renders the tasks in different role views", async ({ roleView }) => {
        let mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.NEW,
                        riderResponsibility: "something",
                        priority:
                            i % 2 === 0
                                ? models.Priority.MEDIUM
                                : models.Priority.HIGH,
                    })
                )
            )
        );

        const fakeWhoami = await DataStore.save(
            new models.User({
                displayName: "Someone Person",
            })
        );

        const fakeUser = await DataStore.save(
            new models.User({
                displayName: "Someone Person",
            })
        );
        const mockAssignments = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: mockTasks[i],
                        assignee: i % 2 === 0 ? fakeWhoami : fakeUser,
                        role: roleView,
                    })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const preloadedState = {
            whoami: { user: fakeWhoami },
            roleView,
        };
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        expect(await screen.findAllByText(models.Priority.MEDIUM)).toHaveLength(
            5
        );
        expect(screen.queryAllByText(models.Priority.HIGH)).toHaveLength(0);
    });

    it.each`
        taskStatus
        ${models.TaskStatus.COMPLETED} | ${models.TaskStatus.DROPPED_OFF} | ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
        ${models.TaskStatus.ACTIVE}    | ${models.TaskStatus.PICKED_UP}
    `(
        "renders the tasks in ALL view for each status",
        async ({ taskStatus }) => {
            const mockTasks = await Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: taskStatus,
                            priority: models.Priority.MEDIUM,
                        })
                    )
                )
            );
            const querySpy = jest.spyOn(DataStore, "query");
            render(
                <TasksGridColumn title={taskStatus} taskKey={taskStatus} />,
                {
                    preloadedState,
                }
            );
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(41);
            });
            expect(screen.getByText(taskStatus)).toBeInTheDocument();
            mockAllIsIntersecting(true);
            const links = screen.getAllByRole("link");
            expect(links).toHaveLength(10);
            for (const link of links) {
                expect(link.firstChild.className).toMatch(
                    new RegExp(`makeStyles-${taskStatus}`)
                );
            }
        }
    );

    it("filters tasks with the search textbox", async () => {
        const filterTaskSpy = jest.spyOn(dashboardUtils, "filterTasks");

        const mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.NEW,
                        priority:
                            i < 5
                                ? models.Priority.MEDIUM
                                : models.Priority.HIGH,
                    })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <DashboardDetailTabs />
                <TasksGridColumn
                    title={models.TaskStatus.NEW}
                    taskKey={models.TaskStatus.NEW}
                />
            </>,
            {
                preloadedState,
            }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(41);
        });
        mockAllIsIntersecting(true);
        const searchTerm = "medium";
        await screen.findAllByText(searchTerm.toUpperCase());
        userEvent.type(screen.getByRole("textbox"), searchTerm);
        await waitFor(() => {
            expect(filterTaskSpy).toHaveBeenCalledTimes(3);
        });
        const mediumCards = screen.getAllByText("MEDIUM");
        const highCards = screen.getAllByText("HIGH");
        for (const card of mediumCards) {
            expect(card).toBeVisible();
        }
        for (const card of highCards) {
            expect(card).not.toBeVisible();
        }
        userEvent.click(screen.getByRole("button", { name: "Clear Search" }));
    });

    it("filters by selected rider chip on coord view", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "Someone Person",
            })
        );
        let mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.NEW,
                        priority:
                            i < 5
                                ? models.Priority.MEDIUM
                                : models.Priority.HIGH,
                    })
                )
            )
        );

        const fakeUser1 = await DataStore.save(
            new models.User({
                id: "fakeId",
                displayName: "Another Individual",
            })
        );
        const fakeUser2 = await DataStore.save(
            new models.User({
                id: "fakeId",
                displayName: "Someone Person",
            })
        );
        const mockAssignments = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: mockTasks[i],
                        assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                        role: models.Role.RIDER,
                    })
                )
            )
        );
        const mockAssignmentsMe = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: mockTasks[i],
                        assignee: mockWhoami,
                        role: models.Role.COORDINATOR,
                    })
                )
            )
        );
        const allAssignments = [...mockAssignments, ...mockAssignmentsMe];
        const resolvedAllAssignments = await Promise.all(
            allAssignments.map(async (a) => {
                const task = await a.task;
                const assignee = await a.assignee;
                return {
                    ...a,
                    task,
                    assignee,
                };
            })
        );
        const preloadedState = {
            roleView: models.Role.COORDINATOR,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: resolvedAllAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <>
                <ActiveRidersChips />
                <TasksGridColumn
                    title={models.TaskStatus.NEW}
                    taskKey={models.TaskStatus.NEW}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.queryByTestId("fetching-tasks-grid-column")
            ).toBeNull();
        });
        mockAllIsIntersecting(true);
        expect(await screen.findAllByText("AI")).toHaveLength(5);
        expect(await screen.findAllByText("SP")).toHaveLength(5);
        userEvent.click(await screen.findByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(screen.queryAllByText("SP")).toHaveLength(0);
        });
        mockAllIsIntersecting(true);
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        expect(await screen.findAllByText("AI")).toHaveLength(5);
        const firstFakeUser = screen.getAllByText("AI");
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });

    it("filters by selected rider chip", async () => {
        let mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.ACTIVE,
                        priority:
                            i < 5
                                ? models.Priority.MEDIUM
                                : models.Priority.HIGH,
                    })
                )
            )
        );

        const fakeUser1 = await DataStore.save(
            new models.User({
                id: "fakeId",
                displayName: "Another Individual",
            })
        );
        const fakeUser2 = await DataStore.save(
            new models.User({
                id: "fakeId",
                displayName: "Someone Person",
            })
        );
        const mockAssignments = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: mockTasks[i],
                        assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                        role: models.Role.RIDER,
                    })
                )
            )
        );
        const resolvedAllAssignments = await Promise.all(
            mockAssignments.map(async (a) => {
                const task = await a.task;
                const assignee = await a.assignee;
                return {
                    ...a,
                    task,
                    assignee,
                };
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "Someone Person",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: resolvedAllAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <>
                <ActiveRidersChips />
                <TasksGridColumn
                    title={models.TaskStatus.ACTIVE}
                    taskKey={models.TaskStatus.ACTIVE}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.queryByTestId("fetching-tasks-grid-column")
            ).toBeNull();
        });
        mockAllIsIntersecting(true);
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(screen.queryAllByText("SP")).toHaveLength(0);
        });
        mockAllIsIntersecting(true);
        const firstFakeUser = await screen.findAllByText("AI");
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });

    test("the observer shows new jobs when using the ALL role view", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
            })
        );
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            status: models.TaskStatus.NEW,
            timeOfCall,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        await DataStore.save(mockTask);
        await waitFor(
            () => {
                expect(querySpy).toHaveBeenCalledTimes(7);
            },
            { timeout: 3000 }
        );
        mockAllIsIntersecting(true);
        expect(screen.queryAllByRole("link")).toHaveLength(1);
        expect(
            screen.getByText(moment(timeOfCall).calendar())
        ).toBeInTheDocument();
    });

    test("the observer doesn't show jobs that don't match the keys", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
            })
        );
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
                priority: models.Priority.HIGH,
            })
        );
        const mockTask = new models.Task({
            status: models.TaskStatus.ACTIVE,
            priority: models.Priority.LOW,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(5);
        });
        mockAllIsIntersecting(true);
        expect(screen.queryAllByRole("link")).toHaveLength(1);
        await DataStore.save(mockTask);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(7);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(screen.queryAllByRole("link")).toHaveLength(1);
        });
        expect(screen.queryByText(models.Priority.LOW)).toBeNull();
    });

    test.each`
        roleView
        ${models.Role.COORDINATOR} | ${models.Role.RIDER}
    `(
        "the observer shows new jobs when using the RIDER or COORDINATOR role view",
        async ({ roleView }) => {
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [roleView],
                })
            );
            const timeOfCall = new Date().toISOString();
            const mockTask = await DataStore.save(
                new models.Task({
                    status: models.TaskStatus.NEW,
                    timeOfCall,
                })
            );
            const preloadedState = {
                roleView,
                whoami: { user: mockWhoami },
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };
            const mockObservedResult = new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockWhoami,
                task: mockTask,
                role: roleView,
            });
            const querySpy = jest.spyOn(DataStore, "query");
            render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
                preloadedState,
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            console.log(querySpy.mock.calls);
            await DataStore.save(mockObservedResult);
            await waitFor(
                () => {
                    expect(querySpy).toHaveBeenCalledTimes(8);
                },
                { timeout: 3000 }
            );
            mockAllIsIntersecting(true);
            expect(await screen.findAllByRole("link")).toHaveLength(1);
            expect(
                screen.getByText(moment(timeOfCall).calendar())
            ).toBeInTheDocument();
        }
    );

    test.each`
        roleView
        ${models.Role.COORDINATOR} | ${models.Role.RIDER}
    `("the observer reacts to changes in status", async ({ roleView }) => {
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [roleView],
            })
        );
        const timeOfCall = new Date().toISOString();
        const mockTask = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.PICKED_UP,
                timeOfCall,
            })
        );
        const mockAssignees = await DataStore.save(
            new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockWhoami,
                task: mockTask,
                role: roleView,
            })
        );
        const preloadedState = {
            roleView,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [mockAssignees],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.DROPPED_OFF} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.queryByText(moment(timeOfCall).calendar())).toBeNull();
        await DataStore.save(
            models.Task.copyOf(
                mockTask,
                (upd) => (upd.status = models.TaskStatus.DROPPED_OFF)
            )
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(8);
        });
        mockAllIsIntersecting(true);
        expect(await screen.findAllByRole("link")).toHaveLength(1);
        expect(
            screen.getByText(moment(timeOfCall).calendar())
        ).toBeInTheDocument();
    });

    test.each`
        roleView
        ${models.Role.COORDINATOR} | ${models.Role.RIDER}
    `(
        "observer don't show tasks not assigned to us when using the RIDER or COORDINATOR role view",
        async ({ roleView }) => {
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [roleView],
                })
            );
            const mockOtherPerson = await DataStore.save(
                new models.User({
                    roles: [roleView],
                })
            );
            const timeOfCall = new Date().toISOString();
            const mockTask = await DataStore.save(
                new models.Task({
                    status: models.TaskStatus.NEW,
                    timeOfCall,
                })
            );
            const preloadedState = {
                roleView,
                whoami: { user: mockWhoami },
            };
            const mockObservedResult = new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockOtherPerson,
                task: mockTask,
                role: roleView,
            });
            const querySpy = jest.spyOn(DataStore, "query");
            render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
                preloadedState,
            });
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await DataStore.save(mockObservedResult);
            // hold on to see if observer reacts
            await new Promise((resolve) => setTimeout(resolve, 3000));
            expect(
                screen.queryByText(moment(timeOfCall).calendar())
            ).toBeNull();
        }
    );

    test.each`
        roleView
        ${models.Role.COORDINATOR} | ${models.Role.RIDER}
    `(
        "observer don't show tasks assigned to us but not matching the role view",
        async ({ roleView }) => {
            const mockWhoami = await DataStore.save(
                new models.User({
                    roles: [roleView],
                })
            );
            const timeOfCall = new Date().toISOString();
            const mockTask = await DataStore.save(
                new models.Task({
                    status: models.TaskStatus.NEW,
                    timeOfCall,
                })
            );
            const preloadedState = {
                roleView,
                whoami: { user: mockWhoami },
            };
            const mockObservedResult = new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockWhoami,
                task: mockTask,
                role: roleView,
            });
            const querySpy = jest.spyOn(DataStore, "query");
            render(<TasksGridColumn taskKey={models.TaskStatus.ACTIVE} />, {
                preloadedState,
            });
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            mockAllIsIntersecting(true);
            await DataStore.save(mockObservedResult);
            // hold on to see if observer reacts
            await new Promise((resolve) => setTimeout(resolve, 3000));
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            expect(
                screen.queryByText(moment(timeOfCall).calendar())
            ).toBeNull();
        }
    );

    test("observers are unsubscribed on unmount", async () => {
        const unsubscribe = jest.fn();
        const observeQuerySpy = jest
            .spyOn(amplify.DataStore, "observeQuery")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });

        const preloadedState = {
            dashboardFilteredUser: "something",
        };
        const { component } = render(
            <TasksGridColumn taskKey={models.TaskStatus.NEW} />,
            { preloadedState }
        );
        await waitFor(() => {
            expect(observeSpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(observeQuerySpy).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(0);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(3);
        });
    });

    it("shows the location details on each task for the ALL view", async () => {
        const roleView = "ALL";
        const mockLocation = await DataStore.save(
            new models.Location({
                line1: "first line1",
                ward: "first ward",
            })
        );
        const mockLocation2 = await DataStore.save(
            new models.Location({
                line1: "second line1",
                ward: "second ward",
            })
        );
        const mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.NEW,
                        pickUpLocation: mockLocation,
                        dropOffLocation: mockLocation2,
                    })
                )
            )
        );
        const preloadedState = {
            whoami: { user: testUser },
            roleView,
        };
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(41);
        });
        mockAllIsIntersecting(true);
        expect(screen.getAllByText(mockLocation.ward)).toHaveLength(10);
        expect(screen.getAllByText(mockLocation.line1)).toHaveLength(10);
        expect(screen.getAllByText(mockLocation2.ward)).toHaveLength(10);
        expect(screen.getAllByText(mockLocation2.line1)).toHaveLength(10);
    });

    it.each`
        roleView
        ${models.Role.RIDER} | ${models.Role.COORDINATOR}
    `(
        "shows the location details on each task for the role views",
        async ({ roleView }) => {
            const mockUser = await DataStore.save(
                new models.User({
                    roles: [roleView],
                })
            );
            const mockLocation = await DataStore.save(
                new models.Location({
                    line1: "first line1",
                    ward: "first ward",
                })
            );
            const mockLocation2 = await DataStore.save(
                new models.Location({
                    line1: "second line1",
                    ward: "second ward",
                })
            );
            const mockTasks = await Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: models.TaskStatus.NEW,
                            priority: models.Priority.MEDIUM,
                            pickUpLocation: mockLocation,
                            dropOffLocation: mockLocation2,
                        })
                    )
                )
            );
            const mockAssignments = await Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.TaskAssignee({
                            task: mockTasks[i],
                            assignee: mockUser,
                            role: roleView,
                        })
                    )
                )
            );
            const preloadedState = {
                whoami: { user: mockUser },
                roleView,
                taskAssigneesReducer: {
                    items: mockAssignments,
                    ready: true,
                    isSynced: true,
                },
            };
            const querySpy = jest.spyOn(amplify.DataStore, "query");
            render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
                preloadedState,
            });
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            expect(screen.getAllByText(mockLocation.ward)).toHaveLength(10);
            expect(screen.getAllByText(mockLocation.line1)).toHaveLength(10);
            expect(screen.getAllByText(mockLocation2.ward)).toHaveLength(10);
            expect(screen.getAllByText(mockLocation2.line1)).toHaveLength(10);
        }
    );

    it("filters by selected rider chip and search term", async () => {
        let mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.ACTIVE,
                        priority:
                            i < 5
                                ? models.Priority.MEDIUM
                                : models.Priority.HIGH,
                    })
                )
            )
        );

        const fakeUser1 = await DataStore.save(
            new models.User({
                id: "fakeId",
                displayName: "Another Individual",
            })
        );
        const fakeUser2 = await DataStore.save(
            new models.User({
                id: "fakeId",
                displayName: "Someone Person",
            })
        );
        const mockAssignments = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.TaskAssignee({
                        task: mockTasks[i],
                        assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                        role: models.Role.RIDER,
                    })
                )
            )
        );
        const resolvedAllAssignments = await Promise.all(
            mockAssignments.map(async (a) => {
                const task = await a.task;
                const assignee = await a.assignee;
                return {
                    ...a,
                    task,
                    assignee,
                };
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "Someone Person",
                roles: [models.Role.COORDINATOR],
            })
        );
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: resolvedAllAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <>
                <DashboardDetailTabs />
                <ActiveRidersChips />
                <TasksGridColumn
                    title={models.TaskStatus.ACTIVE}
                    taskKey={models.TaskStatus.ACTIVE}
                />
            </>,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.queryByTestId("fetching-tasks-grid-column")
            ).toBeNull();
        });
        mockAllIsIntersecting(true);
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(screen.queryAllByText("SP")).toHaveLength(0);
        });
        mockAllIsIntersecting(true);
        const firstFakeUser = await screen.findAllByText("AI");
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }

        const filterTaskSpy = jest.spyOn(dashboardUtils, "filterTasks");
        const searchTerm = "medium";
        userEvent.type(screen.getByRole("textbox"), searchTerm);
        await waitFor(() => {
            expect(filterTaskSpy).toHaveBeenCalledTimes(1);
        });
        const mediumCards = screen.getAllByText("MEDIUM");
        const highCards = screen.getAllByText("HIGH");
        for (const card of mediumCards) {
            expect(card).toBeVisible();
        }
        for (const card of highCards) {
            expect(card).not.toBeVisible();
        }
        userEvent.click(screen.getByRole("button", { name: "Clear Search" }));
    });

    test("select and unselect items by clicking the checkbox", async () => {
        await DataStore.save(
            new models.Task({ status: models.TaskStatus.NEW })
        );
        await DataStore.save(
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
            whoami: { user: mockWhoami },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(9);
        });
        expect(
            await screen.findAllByTestId("CheckBoxOutlineBlankIcon")
        ).toHaveLength(3);
        const checks = await screen.findAllByTestId("task-item-select");
        userEvent.click(checks[0]);
        // both the taskitem and header checkbox will be changed
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(1);
        expect(
            await screen.findAllByTestId("IndeterminateCheckBoxIcon")
        ).toHaveLength(1);
        userEvent.click(checks[1]);
        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(3);
        expect(screen.queryByTestId("IndeterminateCheckBoxIcon")).toBeNull();
        userEvent.click(checks[0]);
        userEvent.click(checks[1]);
        expect(
            await screen.findAllByTestId("CheckBoxOutlineBlankIcon")
        ).toHaveLength(3);
    });

    test.skip("long press in mobile view to select", async () => {
        // not working yet
        global.innerWidth = 100;
        global.dispatchEvent(new Event("resize"));
        await DataStore.save(
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
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={[models.TaskStatus.NEW]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        // simulate a long press
        const longPress = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            clientX: 0,
            clientY: 0,
            button: 0,
        });
        const taskItem = await screen.findByTestId("task-item-parent");
        taskItem.dispatchEvent(longPress);
    });

    test("select all the items in a column", async () => {
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
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <TasksGridColumn
                taskKey={models.TaskStatus.NEW}
                title={models.TaskStatus.NEW}
            />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(41);
        });
        mockAllIsIntersecting(true);
        expect(
            await screen.findAllByTestId("CheckBoxOutlineBlankIcon")
        ).toHaveLength(11);
        userEvent.click(
            screen.getByTestId(`${models.TaskStatus.NEW}-select-all`)
        );

        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(11);
    });

    test("show the comment count", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        await DataStore.save(
            new models.Comment({
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: mockWhoami,
                body: "test",
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(5);
        });
        const tooltip = await screen.findByTestId("comment-count-tooltip");
        userEvent.hover(tooltip);
        expect(await screen.findByText("1 comment")).toBeInTheDocument();
        await DataStore.save(
            new models.Comment({
                parentId: task.id,
                visibility: models.CommentVisibility.EVERYONE,
                author: mockWhoami,
                body: "test",
            })
        );
        await waitFor(
            () => {
                expect(screen.getByText("2 comments")).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });

    test("show the assignees", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.NEW,
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "Someone Person",
            })
        );
        const mockAssignee1 = await DataStore.save(
            new models.User({
                roles: [models.Role.COORDINATOR],
                displayName: "A Coordinator",
            })
        );
        const mockAssignee2 = await DataStore.save(
            new models.User({
                roles: [models.Role.RIDER],
                displayName: "A Rider",
            })
        );
        const mockAssignment1 = await DataStore.save(
            new models.TaskAssignee({
                task: task,
                assignee: mockAssignee1,
                role: models.Role.COORDINATOR,
            })
        );
        const mockAssignment2 = await DataStore.save(
            new models.TaskAssignee({
                task: task,
                assignee: mockAssignee2,
                role: models.Role.RIDER,
            })
        );
        const mockAssignmentMe = await DataStore.save(
            new models.TaskAssignee({
                task: task,
                assignee: mockWhoami,
                role: models.Role.COORDINATOR,
            })
        );
        const resolvedAssignments = await Promise.all(
            [mockAssignment1, mockAssignment2, mockAssignmentMe].map(
                async (a) => {
                    const assignee = await a.assignee;
                    const task = await a.task;
                    return { ...a, assignee, task };
                }
            )
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: resolvedAssignments,
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={models.TaskStatus.NEW} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(5);
        });
        const tooltip = await screen.findByTestId("assignee-names-tooltip");
        userEvent.hover(tooltip);
        expect(await screen.findByText(/A Coordinator/)).toBeInTheDocument();
        expect(await screen.findByText(/A Rider/)).toBeInTheDocument();
        expect(screen.queryByText(/Someone Person/)).toBeNull();
    });
});
