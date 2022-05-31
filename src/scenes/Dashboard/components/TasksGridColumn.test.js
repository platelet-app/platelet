import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import { priorities, tasksStatus, userRoles } from "../../../apiConsts";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import { DashboardDetailTabs } from "./DashboardDetailTabs";
import { createMatchMedia } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import * as dashboardUtils from "../utilities/functions";
import { convertListDataToObject } from "../../../utilities";
import ActiveRidersChips from "./ActiveRidersChips";
import moment from "moment";
import { DataStore, Logger } from "aws-amplify";
import { setTaskAssignees } from "../../../redux/taskAssignees/taskAssigneesActions";

Logger.LOG_LEVEL = "ERROR";

function addAssigneesAndConvertToObject(tasks, allAssignees) {
    const finalResult = {};
    for (const t of tasks) {
        const assignmentsFiltered = allAssignees.filter(
            (a) => a.task.id === t.id
        );
        const assignees = convertListDataToObject(assignmentsFiltered);
        finalResult[t.id] = { ...t, assignees };
    }

    return finalResult;
}
const testUserModel = new models.User({
    name: "whoami",
    displayName: "Mock User",
    roles: Object.values(userRoles),
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
        const tasks = await DataStore.query(models.Task);
        const users = await DataStore.query(models.User);
        const assignees = await DataStore.query(models.TaskAssignee);
        await Promise.all(
            [...tasks, ...users, ...assignees].map((t) => DataStore.delete(t))
        );
    });
    it("renders without crashing", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
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
        ${userRoles.rider} | ${userRoles.coordinator}
    `("renders the tasks in different role views", async ({ roleView }) => {
        let mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: tasksStatus.new,
                        priority:
                            i % 2 === 0 ? priorities.medium : priorities.high,
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
            taskAssigneesReducer: {
                items: mockAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                { sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        expect(await screen.findAllByText(priorities.medium)).toHaveLength(5);
        expect(screen.queryAllByText(priorities.high)).toHaveLength(0);
    });

    it.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}
    `(
        "renders the tasks in ALL view for each status",
        async ({ taskStatus }) => {
            const mockTasks = await Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: taskStatus,
                            priority: priorities.medium,
                        })
                    )
                )
            );
            const querySpy = jest.spyOn(DataStore, "query");
            render(
                <TasksGridColumn title={taskStatus} taskKey={[taskStatus]} />,
                {
                    preloadedState,
                }
            );
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenNthCalledWith(
                    1,
                    models.Task,
                    expect.any(Function),
                    {
                        limit: dashboardUtils.isCompletedTab([taskStatus])
                            ? 100
                            : 0,
                        sort: expect.any(Function),
                    }
                );
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(11);
            });
            expect(screen.getByText(taskStatus)).toBeInTheDocument();
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
                        status: tasksStatus.new,
                        priority: i < 5 ? priorities.medium : priorities.high,
                    })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <DashboardDetailTabs />
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
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                {
                    limit: 0,
                    sort: expect.any(Function),
                }
            );
        });
        mockAllIsIntersecting(true);
        const searchTerm = "medium";
        await screen.findAllByText(searchTerm.toUpperCase());
        userEvent.type(screen.getByRole("textbox"), searchTerm);
        await waitFor(() => {
            expect(filterTaskSpy).toHaveBeenCalledTimes(3);
        });
        expect(filterTaskSpy).toHaveBeenNthCalledWith(
            3,
            convertListDataToObject(mockTasks),
            searchTerm
        );
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
                        status: tasksStatus.new,
                        priority: i < 5 ? priorities.medium : priorities.high,
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
                        role: userRoles.rider,
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
                        role: userRoles.coordinator,
                    })
                )
            )
        );
        const allAssignments = [...mockAssignments, ...mockAssignmentsMe];
        const preloadedState = {
            roleView: userRoles.coordinator,
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: allAssignments,
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <>
                <ActiveRidersChips />
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
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                {
                    sort: expect.any(Function),
                }
            );
        });
        mockAllIsIntersecting(true);
        expect(await screen.findAllByText("AI")).toHaveLength(5);
        expect(await screen.findAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(12);
        });
        mockAllIsIntersecting(true);
        const firstFakeUser = screen.getAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });

    it("filters by selected rider chip", async () => {
        let mockTasks = await Promise.all(
            _.range(0, 10).map((i) =>
                DataStore.save(
                    new models.Task({
                        status: tasksStatus.active,
                        priority: i < 5 ? priorities.medium : priorities.high,
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
                        role: userRoles.rider,
                    })
                )
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "Someone Person",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: mockAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <>
                <ActiveRidersChips />
                <TasksGridColumn
                    title={tasksStatus.active}
                    taskKey={[tasksStatus.active]}
                />
            </>,
            {
                preloadedState,
            }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(11);
        });
        //jest.clearAllMocks();
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                12,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        const firstFakeUser = await screen.findAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });

    test("the observer shows new jobs when using the ALL role view", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
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
            status: tasksStatus.new,
            timeOfCall,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        await DataStore.save(mockTask);
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        expect(screen.queryAllByRole("link")).toHaveLength(1);
        expect(
            screen.getByText(moment(timeOfCall).calendar())
        ).toBeInTheDocument();
    });

    test("the observer doesn't show jobs that don't match the keys", async () => {
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
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
            status: tasksStatus.active,
            timeOfCall,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        await DataStore.save(mockTask);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        expect(screen.queryAllByRole("link")).toHaveLength(0);
        expect(screen.queryByText(moment(timeOfCall).calendar())).toBeNull();
    });

    test.each`
        roleView
        ${userRoles.coordinator} | ${userRoles.rider}
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
                    status: tasksStatus.new,
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
            const observeSpy = jest.spyOn(DataStore, "observe");
            const querySpy = jest.spyOn(DataStore, "query");
            const { store } = render(
                <TasksGridColumn taskKey={[tasksStatus.new]} />,
                {
                    preloadedState,
                }
            );
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await waitFor(() => {
                expect(observeSpy).toHaveBeenNthCalledWith(1, models.Task);
            });
            await waitFor(() => {
                expect(observeSpy).toHaveBeenNthCalledWith(2, models.Location);
            });
            store.dispatch(
                setTaskAssignees({
                    items: [mockObservedResult],
                    ready: true,
                    isSynced: true,
                })
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            expect(await screen.findAllByRole("link")).toHaveLength(1);
            expect(
                screen.getByText(moment(timeOfCall).calendar())
            ).toBeInTheDocument();
        }
    );

    test.each`
        roleView
        ${userRoles.coordinator} | ${userRoles.rider}
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
                    status: tasksStatus.new,
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
                assignee: mockOtherPerson,
                task: mockTask,
                role: roleView,
            });
            const observeSpy = jest.spyOn(DataStore, "observe");
            const querySpy = jest.spyOn(DataStore, "query");
            const { store } = render(
                <TasksGridColumn taskKey={[tasksStatus.new]} />,
                {
                    preloadedState,
                }
            );
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await waitFor(() => {
                expect(observeSpy).toHaveBeenNthCalledWith(1, models.Task);
            });
            await waitFor(() => {
                expect(observeSpy).toHaveBeenNthCalledWith(2, models.Location);
            });
            store.dispatch(
                setTaskAssignees({
                    items: [mockObservedResult],
                    ready: true,
                    isSynced: true,
                })
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(0);
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            expect(
                screen.queryByText(moment(timeOfCall).calendar())
            ).toBeNull();
        }
    );

    test.each`
        roleView
        ${userRoles.coordinator} | ${userRoles.rider}
    `(
        "observer don't show tasks assigned to us but not matching the role view",
        async ({ roleView }) => {
            const mockWhoami = new models.User({
                roles: [roleView],
            });
            const timeOfCall = new Date().toISOString();
            const mockTask = await DataStore.save(
                new models.Task({
                    status: tasksStatus.new,
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
            const observeSpy = jest.spyOn(DataStore, "observe");
            const querySpy = jest.spyOn(DataStore, "query");
            const { store } = render(
                <TasksGridColumn taskKey={[tasksStatus.active]} />,
                {
                    preloadedState,
                }
            );
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await waitFor(() => {
                expect(observeSpy).toHaveBeenNthCalledWith(1, models.Task);
            });
            await waitFor(() => {
                expect(observeSpy).toHaveBeenNthCalledWith(2, models.Location);
            });
            store.dispatch(
                setTaskAssignees({
                    items: [mockObservedResult],
                    ready: true,
                    isSynced: true,
                })
            );
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(1);
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            expect(
                screen.queryByText(moment(timeOfCall).calendar())
            ).toBeNull();
        }
    );

    test("observers are unsubscribed on unmount", async () => {
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });

        const preloadedState = {
            taskAssigneesReducer: {
                items: [],
                ready: true,
                isSynced: true,
            },
        };
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const { component } = render(
            <TasksGridColumn taskKey={[tasksStatus.new]} />,
            { preloadedState }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(0);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(2);
        });
    });

    it.each(
        "shows the location details on each task for the ALL view",
        async () => {
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
            const mockTasks = Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: tasksStatus.new,
                            priority: priorities.medium,
                            pickUpLocation: mockLocation,
                            dropOffLocation: mockLocation2,
                        })
                    )
                )
            );
            const mockAssignments = Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.TaskAssignee({
                            task: mockTasks[i],
                            assignee: testUser,
                            role: roleView,
                        })
                    )
                )
            );
            const preloadedState = {
                whoami: { user: testUser },
                roleView,
                taskAssigneesReducer: {
                    items: [],
                    ready: true,
                    isSynced: true,
                },
            };
            const querySpy = jest.spyOn(amplify.DataStore, "query");
            render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
                preloadedState,
            });
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(querySpy).toHaveBeenCalledTimes(2);
            });
            mockAllIsIntersecting(true);
            expect(screen.getAllByText(mockLocation.ward)).toHaveLength(10);
            expect(screen.getAllByText(mockLocation.line1)).toHaveLength(10);
            expect(screen.getAllByText(mockLocation2.ward)).toHaveLength(10);
            expect(screen.getAllByText(mockLocation2.line1)).toHaveLength(10);
        }
    );

    it.each`
        roleView
        ${userRoles.rider} | ${userRoles.coordinator}
    `(
        "shows the location details on each task for the role views",
        async ({ roleView }) => {
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
                            status: tasksStatus.new,
                            priority: priorities.medium,
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
                            assignee: testUser,
                            role: roleView,
                        })
                    )
                )
            );
            const preloadedState = {
                whoami: { user: testUser },
                roleView,
                taskAssigneesReducer: {
                    items: mockAssignments,
                    ready: true,
                    isSynced: true,
                },
            };
            const querySpy = jest.spyOn(amplify.DataStore, "query");
            render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
                preloadedState,
            });
            mockAllIsIntersecting(true);
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
                        status: tasksStatus.active,
                        priority: i < 5 ? priorities.medium : priorities.high,
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
                        role: userRoles.rider,
                    })
                )
            )
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
            taskAssigneesReducer: {
                items: mockAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <>
                <DashboardDetailTabs />
                <ActiveRidersChips />
                <TasksGridColumn
                    title={tasksStatus.active}
                    taskKey={[tasksStatus.active]}
                />
            </>,
            {
                preloadedState,
            }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(11);
        });
        //jest.clearAllMocks();
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(querySpy).toHaveBeenNthCalledWith(
                12,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        const firstFakeUser = await screen.findAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
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
        await DataStore.save(new models.Task({ status: tasksStatus.new }));
        await DataStore.save(new models.Task({ status: tasksStatus.new }));
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
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
        await DataStore.save(new models.Task({ status: tasksStatus.new }));
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
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
            <TasksGridColumn
                taskKey={[tasksStatus.new]}
                title={tasksStatus.new}
            />,
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
        ).toHaveLength(11);
        userEvent.click(screen.getByTestId(`${tasksStatus.new}-select-all`));

        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(11);
    });
});
