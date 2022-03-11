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

jest.mock("aws-amplify");

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
    active: 1,
});

export const testUser = { ...testUserModel, id: "whoami" };

describe("TasksGridColumn", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("renders without crashing", async () => {
        amplify.DataStore.query.mockResolvedValueOnce([]).mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />);
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
    });

    it.each`
        roleView
        ${userRoles.rider} | ${userRoles.coordinator}
    `("renders the tasks in different role views", async ({ roleView }) => {
        let mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i % 2 === 0 ? priorities.medium : priorities.high,
                })
        );

        mockTasks = mockTasks.map((t) => ({
            ...t,
            createdAt: new Date().toISOString(),
        }));

        const fakeUser = new models.User({
            displayName: "Someone Person",
        });
        const mockAssignments = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: i % 2 === 0 ? testUser : fakeUser,
                    role: roleView,
                })
        );
        const preloadedState = { whoami: { user: testUser }, roleView };

        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        expect(screen.getAllByText(priorities.medium)).toHaveLength(5);
        expect(screen.queryAllByText(priorities.high)).toHaveLength(0);
    });

    it.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}
    `(
        "renders the tasks in ALL view for each status",
        async ({ taskStatus }) => {
            const mockTasks = _.range(0, 10).map(
                (i) =>
                    new models.Task({
                        status: taskStatus,
                        priority: priorities.medium,
                    })
            );
            amplify.DataStore.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce(mockTasks)
                .mockResolvedValue([]);
            amplify.DataStore.observe.mockReturnValue({
                subscribe: () => ({ unsubscribe: () => {} }),
            });
            render(
                <TasksGridColumn title={taskStatus} taskKey={[taskStatus]} />
            );
            mockAllIsIntersecting(true);
            await waitFor(() => {
                expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                    1,
                    models.TaskAssignee
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                    2,
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
                expect(amplify.DataStore.query).toHaveBeenCalledTimes(12);
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
        const mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i < 5 ? priorities.medium : priorities.high,
                })
        );
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(
            <>
                <DashboardDetailTabs />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>,
            {
                preloadedState: {
                    whoami: { user: testUser },
                },
            }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Task,
                expect.any(Function),
                {
                    limit: 0,
                    sort: expect.any(Function),
                }
            );
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(12);
        });
        const searchTerm = "medium";
        userEvent.type(screen.getByRole("textbox"), searchTerm);
        await waitFor(() => {
            expect(filterTaskSpy).toHaveBeenCalledTimes(3);
        });
        expect(filterTaskSpy).toHaveBeenNthCalledWith(
            3,
            convertListDataToObject(
                mockTasks.map((t) => ({ ...t, assignees: {} }))
            ),
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

    it.skip("filters by selected rider chip on coord view", async () => {
        //TODO fix later
        const preloadedState = {
            roleView: userRoles.coordinator,
            whoami: { user: { ...testUser } },
        };
        let mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i < 5 ? priorities.medium : priorities.high,
                })
        );

        mockTasks = mockTasks.map((t) => ({
            ...t,
            createdAt: new Date().toISOString(),
        }));

        const fakeUser1 = new models.User({
            id: "fakeId",
            displayName: "Another Individual",
        });
        const fakeUser2 = new models.User({
            id: "fakeId",
            displayName: "Someone Person",
        });
        const mockAssignments = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                    role: userRoles.rider,
                })
        );
        const mockAssignmentsMe = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: testUser,
                    role: userRoles.coordinator,
                })
        );
        const allAssignments = [...mockAssignments, ...mockAssignmentsMe];

        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(allAssignments)
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockAssignmentsMe)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
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
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.RiderResponsibility
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                3,
                models.TaskAssignee,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                4,
                models.Task,
                expect.any(Function),
                {
                    limit: 0,
                    sort: expect.any(Function),
                }
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                5,
                models.TaskAssignee,
                expect.any(Function)
            );
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(14);
        });
        jest.clearAllMocks();
        amplify.DataStore.query
            .mockResolvedValueOnce(allAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Task
            );
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                3,
                models.Comment,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(7);
        });
        const firstFakeUser = screen.getAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });

    it("filters by selected rider chip", async () => {
        let mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i < 5 ? priorities.medium : priorities.high,
                })
        );

        mockTasks = mockTasks.map((t) => ({
            ...t,
            createdAt: new Date().toISOString(),
        }));

        const fakeUser1 = new models.User({
            id: "fakeId",
            displayName: "Another Individual",
        });
        const fakeUser2 = new models.User({
            id: "fakeId",
            displayName: "Someone Person",
        });
        const mockAssignments = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                    role: userRoles.rider,
                })
        );

        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(
            <>
                <ActiveRidersChips />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                3,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(13);
        });
        screen.getByText("NEW");
        jest.clearAllMocks();
        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                3,
                models.Comment,
                expect.any(Function)
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(7);
        });
        const firstFakeUser = screen.getAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });

    test("the observer shows new jobs when using the ALL role view", async () => {
        const preloadedState = { roleView: "ALL" };
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            tenantId: "tenant-id",
            status: tasksStatus.new,
            timeOfCall,
        });
        const mockWhoami = new models.User({
            roles: [userRoles.coordinator],
        });
        const mockObservedResult = {
            opType: "INSERT",
            element: mockTask,
        };
        const mockObservedResult2 = {
            element: new models.TaskAssignee({
                tenantId: "tenant-id",
                taskId: mockTask.id,
                assigneeId: mockWhoami.id,
                role: userRoles.coordinator,
            }),
            opType: "INSERT",
        };
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([mockTask])
            .mockResolvedValue([]);
        amplify.DataStore.observe
            .mockReturnValueOnce({
                subscribe: jest.fn().mockImplementation((callback) => {
                    setTimeout(() => callback(mockObservedResult), 1000);
                    return { unsubscribe: jest.fn() };
                }),
            })
            .mockReturnValueOnce({
                subscribe: () => ({ unsubscribe: () => {} }),
            })
            .mockReturnValueOnce({
                subscribe: jest.fn().mockImplementation((callback) => {
                    setTimeout(() => callback(mockObservedResult2), 1100);
                    return { unsubscribe: jest.fn() };
                }),
            })
            .mockReturnValue({
                subscribe: () => ({ unsubscribe: () => {} }),
            });
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                3,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                4,
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
        const preloadedState = { roleView: "ALL" };
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            tenantId: "tenant-id",
            status: tasksStatus.active,
            timeOfCall,
        });
        const mockWhoami = new models.User({
            roles: [userRoles.coordinator],
        });
        const mockObservedResult = {
            opType: "INSERT",
            element: mockTask,
        };
        const mockObservedResult2 = {
            element: new models.TaskAssignee({
                tenantId: "tenant-id",
                taskId: mockTask.id,
                assigneeId: mockWhoami.id,
                role: userRoles.coordinator,
            }),
            opType: "INSERT",
        };
        amplify.DataStore.query.mockResolvedValue([]);

        amplify.DataStore.observe
            .mockReturnValueOnce({
                subscribe: jest.fn().mockImplementation((callback) => {
                    callback(mockObservedResult);
                    return { unsubscribe: jest.fn() };
                }),
            })
            .mockReturnValueOnce({
                subscribe: () => ({ unsubscribe: () => {} }),
            })
            .mockReturnValueOnce({
                subscribe: jest.fn().mockImplementation((callback) => {
                    callback(mockObservedResult2);
                    return { unsubscribe: jest.fn() };
                }),
            })
            .mockReturnValue({
                subscribe: () => ({ unsubscribe: () => {} }),
            });
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee
            );
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                2,
                models.Task,
                expect.any(Function),
                { limit: 0, sort: expect.any(Function) }
            );
        });
        expect(screen.queryAllByRole("link")).toHaveLength(0);
        await waitFor(() => {
            expect(amplify.DataStore.observe).toHaveBeenCalledTimes(3);
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryAllByRole("link")).toHaveLength(0);
        expect(screen.queryByText(moment(timeOfCall).calendar())).toBeNull();
    });

    test.each`
        roleView
        ${userRoles.coordinator} | ${userRoles.rider}
    `(
        "the observer shows new jobs when using the RIDER or COORDINATOR role view",
        async ({ roleView }) => {
            const mockWhoami = new models.User({
                roles: [roleView],
            });
            const timeOfCall = new Date().toISOString();
            const mockTask = new models.Task({
                status: tasksStatus.new,
                timeOfCall,
            });
            const preloadedState = {
                roleView,
                whoami: { user: mockWhoami },
            };
            const mockObservedResult = {
                element: new models.TaskAssignee({
                    tenantId: "tenant-id",
                    taskId: mockTask.id,
                    assigneeId: mockWhoami.id,
                    role: roleView,
                }),
                opType: "INSERT",
            };
            const mockObservedResultIgnored = {
                element: mockTask,
                opType: "INSERT",
            };
            const unsubscribe = jest.fn();
            amplify.DataStore.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce(mockTask)
                .mockResolvedValue([]);
            amplify.DataStore.observe
                .mockReturnValueOnce({
                    subscribe: jest.fn().mockImplementation((callback) => {
                        callback(mockObservedResultIgnored);
                        return { unsubscribe };
                    }),
                })
                .mockReturnValueOnce({
                    subscribe: () => ({ unsubscribe }),
                })
                .mockReturnValue({
                    subscribe: jest.fn().mockImplementation((callback) => {
                        callback(mockObservedResult);
                        return { unsubscribe };
                    }),
                });
            render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
                preloadedState,
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    1,
                    models.Task
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    2,
                    models.Location
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    3,
                    models.TaskAssignee
                );
            });
            mockAllIsIntersecting(true);
            return;
            expect(screen.queryAllByRole("link")).toHaveLength(1);
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
            const mockWhoami = new models.User({
                roles: [roleView],
            });
            const timeOfCall = new Date().toISOString();
            const mockTask = new models.Task({
                status: tasksStatus.new,
                timeOfCall,
            });
            const preloadedState = {
                roleView,
                whoami: { user: mockWhoami },
            };
            const mockAssignee = new models.User({});
            const mockObservedResult = {
                element: new models.TaskAssignee({
                    tenantId: "tenant-id",
                    task: mockTask,
                    taskId: mockTask.id,
                    assigneeId: mockAssignee.id,
                    role: roleView,
                }),
                opType: "INSERT",
            };
            const mockObservedResultIgnored = {
                element: mockTask,
                opType: "INSERT",
            };
            const unsubscribe = jest.fn();
            amplify.DataStore.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce(mockTask)
                .mockResolvedValue([]);
            amplify.DataStore.observe
                .mockReturnValueOnce({
                    subscribe: jest.fn().mockImplementation((callback) => {
                        callback(mockObservedResultIgnored);
                        return { unsubscribe };
                    }),
                })
                .mockReturnValueOnce({
                    subscribe: () => ({ unsubscribe }),
                })
                .mockReturnValue({
                    subscribe: jest.fn().mockImplementation((callback) => {
                        callback(mockObservedResult);
                        return { unsubscribe };
                    }),
                });
            render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
                preloadedState,
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    1,
                    models.Task
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    2,
                    models.Location
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    3,
                    models.TaskAssignee
                );
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
                roles: [userRoles.rider, userRoles.coordinator],
            });
            const timeOfCall = new Date().toISOString();
            const mockTask = new models.Task({
                status: tasksStatus.new,
                timeOfCall,
            });
            const preloadedState = {
                roleView,
                whoami: { user: mockWhoami },
            };
            const mockAssignee = new models.User({});
            const mockObservedResult = {
                element: new models.TaskAssignee({
                    tenantId: "tenant-id",
                    taskId: mockTask.id,
                    assigneeId: mockAssignee.id,
                    role:
                        roleView === userRoles.coordinator
                            ? userRoles.rider
                            : userRoles.coordinator,
                }),
                opType: "INSERT",
            };
            const mockObservedResultIgnored = {
                element: mockTask,
                opType: "INSERT",
            };
            const unsubscribe = jest.fn();
            amplify.DataStore.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce(mockTask)
                .mockResolvedValue([]);
            amplify.DataStore.observe
                .mockReturnValueOnce({
                    subscribe: jest.fn().mockImplementation((callback) => {
                        callback(mockObservedResultIgnored);
                        return { unsubscribe };
                    }),
                })
                .mockReturnValueOnce({
                    subscribe: () => ({ unsubscribe }),
                })
                .mockReturnValue({
                    subscribe: jest.fn().mockImplementation((callback) => {
                        callback(mockObservedResult);
                        return { unsubscribe };
                    }),
                });
            render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
                preloadedState,
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    1,
                    models.Task
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    2,
                    models.Location
                );
            });
            await waitFor(() => {
                expect(amplify.DataStore.observe).toHaveBeenNthCalledWith(
                    3,
                    models.TaskAssignee
                );
            });
            mockAllIsIntersecting(true);
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            expect(
                screen.queryByText(moment(timeOfCall).calendar())
            ).toBeNull();
        }
    );

    test("observers are unsubscribed on unmount", async () => {
        const preloadedState = { roleView: "ALL" };
        const unsubscribe = jest.fn();
        amplify.DataStore.query.mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const component = render(
            <TasksGridColumn taskKey={[tasksStatus.new]} />,
            { preloadedState }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(0);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(3);
        });
    });

    it.each`
        roleView
        ${userRoles.rider} | ${userRoles.coordinator} | ${"ALL"}
    `("shows the location details on each task", async ({ roleView }) => {
        const mockLocation = new models.Location({
            line1: "first line1",
            ward: "first ward",
        });
        const mockLocation2 = new models.Location({
            line1: "second line1",
            ward: "second ward",
        });
        const mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: priorities.medium,
                    pickUpLocation: mockLocation,
                    dropOffLocation: mockLocation2,
                })
        );
        const mockAssignments = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: testUser,
                    role: roleView,
                })
        );
        const preloadedState = { whoami: { user: testUser }, roleView };
        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
        mockAllIsIntersecting(true);
        expect(screen.getAllByText(mockLocation.ward)).toHaveLength(10);
        expect(screen.getAllByText(mockLocation.line1)).toHaveLength(10);
        expect(screen.getAllByText(mockLocation2.ward)).toHaveLength(10);
        expect(screen.getAllByText(mockLocation2.line1)).toHaveLength(10);
    });

    it.skip("filters by selected rider chip and search term", async () => {
        const filterTaskSpy = jest.spyOn(dashboardUtils, "filterTasks");
        let mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i < 5 ? priorities.medium : priorities.high,
                })
        );

        mockTasks = mockTasks.map((t) => ({
            ...t,
            createdAt: new Date().toISOString(),
        }));

        const fakeUser1 = new models.User({
            id: "fakeId",
            displayName: "Another Individual",
        });
        const fakeUser2 = new models.User({
            id: "fakeId",
            displayName: "Someone Person",
        });
        const mockAssignments = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                    role: userRoles.rider,
                })
        );

        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(
            <>
                <DashboardDetailTabs />
                <ActiveRidersChips />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>,
            {
                preloadedState: {
                    whoami: { user: testUser },
                },
            }
        );
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(13);
        });
        jest.clearAllMocks();
        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(8);
        });

        const firstFakeUser = screen.getAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
        const searchTerm = "medium";
        userEvent.type(screen.getByRole("textbox"), searchTerm);
        await waitFor(() => {
            expect(filterTaskSpy).toHaveBeenCalledTimes(2);
        });
        expect(filterTaskSpy).toHaveBeenNthCalledWith(
            3,
            addAssigneesAndConvertToObject(
                mockAssignments.map((a) => ({
                    ...a.task,
                })),
                mockAssignments
            ),
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
});
