import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import {
    commentVisibility,
    priorities,
    tasksStatus,
    userRoles,
} from "../../../apiConsts";
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
import { useDispatch } from "react-redux";
import * as assActions from "../../../redux/taskAssignees/taskAssigneesActions";
import * as commentActions from "../../../redux/comments/commentsActions";
import * as taskDeliverablesActions from "../../../redux/taskDeliverables/taskDeliverablesActions";

Logger.LOG_LEVEL = "ERROR";

const testUserModel = new models.User({
    name: "whoami",
    displayName: "Mock User",
    roles: Object.values(userRoles),
    dateOfBirth: null,
    profilePictureThumbnailURL: null,
});

export const testUser = { ...testUserModel, id: "whoami" };

const preloadedState = {
    taskAssigneesReducer: { items: [], ready: true, isSynced: true },
    whoami: { user: testUser },
};

const FakeDispatchComponent = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(assActions.initTaskAssignees());
        dispatch(commentActions.initComments());
        dispatch(taskDeliverablesActions.initTaskDeliverables());
    }, [dispatch]);
    return null;
};

describe("TasksGridColumn", () => {
    const finishLoading = async () => {
        await waitFor(() => {
            expect(
                screen.queryByTestId("tasks-kanban-column-skeleton")
            ).toBeNull();
        });
        mockAllIsIntersecting(true);
        await waitFor(() => {
            expect(screen.queryByTestId("task-item-skeleton")).toBeNull();
        });
    };

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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
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
        await Promise.all(
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
        const preloadedState = {
            whoami: { user: fakeWhoami },
            roleView,
        };
        render(
            <>
                <FakeDispatchComponent />
                <TasksGridColumn taskKey={[tasksStatus.new]} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        expect(await screen.findAllByText(priorities.medium)).toHaveLength(5);
        expect(screen.queryAllByText(priorities.high)).toHaveLength(0);
    });

    it.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}   | ${tasksStatus.pending}  | ${tasksStatus.abandoned}
    `(
        "renders the tasks in ALL view for each status",
        async ({ taskStatus }) => {
            await Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: taskStatus,
                            priority: priorities.medium,
                            dateCompleted: new Date()
                                .toISOString()
                                .split("T")[0],
                        })
                    )
                )
            );
            render(
                <TasksGridColumn title={taskStatus} taskKey={[taskStatus]} />,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            expect(screen.getByText(taskStatus)).toBeInTheDocument();
            const links = screen.getAllByRole("link");
            expect(links).toHaveLength(10);
            for (const link of links) {
                expect(link.firstChild.className).toMatch(
                    new RegExp(`${taskStatus}`)
                );
            }
        }
    );
    it.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.rejected} | ${tasksStatus.cancelled} | ${tasksStatus.abandoned}
    `(
        "renders the tasks in ALL view for each completed status when dateCompleted is not defined",
        async ({ taskStatus }) => {
            await Promise.all(
                _.range(0, 10).map((i) =>
                    DataStore.save(
                        new models.Task({
                            status: taskStatus,
                            priority: priorities.medium,
                        })
                    )
                )
            );
            render(
                <TasksGridColumn title={taskStatus} taskKey={[taskStatus]} />,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            expect(screen.getByText(taskStatus)).toBeInTheDocument();
            const links = screen.getAllByRole("link");
            expect(links).toHaveLength(10);
            for (const link of links) {
                expect(link.firstChild.className).toMatch(
                    new RegExp(`${taskStatus}`)
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
        await finishLoading();
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
        await Promise.all(
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
        await Promise.all(
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
        const preloadedState = {
            roleView: userRoles.coordinator,
            whoami: { user: mockWhoami },
        };
        render(
            <>
                <FakeDispatchComponent />
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
        await finishLoading();
        expect(await screen.findAllByText("AI")).toHaveLength(5);
        expect(await screen.findAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await finishLoading();
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
        await Promise.all(
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
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
        };
        render(
            <>
                <FakeDispatchComponent />
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
        await finishLoading();
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await finishLoading();
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
        await DataStore.save(mockTask);
        await finishLoading();
        await waitFor(() => {
            expect(screen.queryAllByRole("link")).toHaveLength(1);
        });
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
        await DataStore.save(mockTask);
        await expect(
            screen.findByText(moment(timeOfCall).calendar())
        ).rejects.toThrow();
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
            };
            const mockObservedResult = new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockWhoami,
                task: mockTask,
                role: roleView,
            });
            render(
                <>
                    <FakeDispatchComponent />
                    <TasksGridColumn taskKey={[tasksStatus.new]} />
                </>,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await DataStore.save(mockObservedResult);
            await finishLoading();
            await waitFor(
                () => {
                    expect(
                        screen.queryByTestId("task-item-skeleton")
                    ).toBeInTheDocument();
                },
                { timeout: 4000 }
            );
            await finishLoading();
            expect(await screen.findAllByRole("link")).toHaveLength(1);
            expect(
                screen.getByText(moment(timeOfCall).calendar())
            ).toBeInTheDocument();
        }
    );

    test.each`
        roleView
        ${userRoles.coordinator} | ${userRoles.rider}
    `("the observer reacts to changes in status", async ({ roleView }) => {
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [roleView],
            })
        );
        const timeOfCall = new Date().toISOString();
        const mockTask = await DataStore.save(
            new models.Task({
                status: tasksStatus.pickedUp,
                timeOfCall,
            })
        );
        await DataStore.save(
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
        };
        render(
            <>
                <FakeDispatchComponent />
                <TasksGridColumn taskKey={[tasksStatus.droppedOff]} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        expect(screen.queryByText(moment(timeOfCall).calendar())).toBeNull();
        await DataStore.save(
            models.Task.copyOf(
                mockTask,
                (upd) => (upd.status = tasksStatus.droppedOff)
            )
        );
        await finishLoading();
        expect(await screen.findAllByRole("link")).toHaveLength(1);
        expect(
            screen.getByText(moment(timeOfCall).calendar())
        ).toBeInTheDocument();
    });

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
            };
            const mockObservedResult = new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockOtherPerson,
                task: mockTask,
                role: roleView,
            });
            render(
                <>
                    <FakeDispatchComponent />
                    <TasksGridColumn taskKey={[tasksStatus.new]} />
                </>,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await DataStore.save(mockObservedResult);
            await finishLoading();
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await expect(
                screen.findByText(moment(timeOfCall).calendar())
            ).rejects.toThrow();
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
            };
            const mockObservedResult = new models.TaskAssignee({
                tenantId: "tenant-id",
                assignee: mockWhoami,
                task: mockTask,
                role: roleView,
            });
            render(
                <>
                    <FakeDispatchComponent />
                    <TasksGridColumn taskKey={[tasksStatus.active]} />
                </>,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            expect(screen.queryAllByRole("link")).toHaveLength(0);
            await DataStore.save(mockObservedResult);
            await finishLoading();
            await expect(
                screen.findByText(moment(timeOfCall).calendar())
            ).rejects.toThrow();
        }
    );

    test("observers are unsubscribed on unmount", async () => {
        const unsubscribe = jest.fn();
        jest.spyOn(amplify.DataStore, "observe").mockImplementation(() => {
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
        const { component } = render(
            <TasksGridColumn taskKey={[tasksStatus.new]} />,
            { preloadedState }
        );
        await finishLoading();
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
            render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
                preloadedState,
            });
            await finishLoading();
            expect(screen.getAllByText(/first ward/)).toHaveLength(10);
            expect(screen.getAllByText(/first line1/)).toHaveLength(10);
            expect(screen.getAllByText(/second ward/)).toHaveLength(10);
            expect(screen.getAllByText(/second line1/)).toHaveLength(10);
        }
    );
    test.each`
        roleView
        ${userRoles.coordinator} | ${userRoles.rider}
    `("location responds to changes on role views", async ({ roleView }) => {
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
        const mockLocation3 = await DataStore.save(
            new models.Location({
                line1: "third line1",
                ward: "third ward",
            })
        );
        const mockTask = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                priority: priorities.medium,
                pickUpLocation: mockLocation,
                dropOffLocation: mockLocation2,
            })
        );
        const assignee = await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: testUser,
                role: roleView,
            })
        );
        const preloadedState = {
            whoami: { user: testUser },
            roleView,
            taskAssigneesReducer: {
                items: [assignee],
                ready: true,
                isSynced: true,
            },
        };
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
        expect(screen.getByText(/first ward/)).toBeInTheDocument();
        expect(screen.getByText(/first line1/)).toBeInTheDocument();
        expect(screen.getByText(/second ward/)).toBeInTheDocument();
        expect(screen.getByText(/second line1/)).toBeInTheDocument();
        await DataStore.save(
            models.Location.copyOf(mockLocation, (updated) => {
                updated.line1 = "updated line1";
            })
        );
        expect(await screen.findByText(/updated line1/)).toBeInTheDocument();
        await DataStore.save(
            models.Location.copyOf(mockLocation2, (updated) => {
                updated.line1 = "updated second line1";
            })
        );
        expect(
            await screen.findByText(/updated second line1/)
        ).toBeInTheDocument();
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.pickUpLocation = mockLocation3;
            })
        );
        expect(await screen.findByText(/third line1/)).toBeInTheDocument();
        expect(screen.queryByText(/updated line1/)).toBeNull();
    });

    it("location responds to changes", async () => {
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
        const mockLocation3 = await DataStore.save(
            new models.Location({
                line1: "third line1",
                ward: "third ward",
            })
        );
        const mockTask = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                priority: priorities.medium,
                pickUpLocation: mockLocation,
                dropOffLocation: mockLocation2,
            })
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
        expect(screen.getByText(/first ward/)).toBeInTheDocument();
        expect(screen.getByText(/first line1/)).toBeInTheDocument();
        expect(screen.getByText(/second ward/)).toBeInTheDocument();
        expect(screen.getByText(/second line1/)).toBeInTheDocument();
        await DataStore.save(
            models.Location.copyOf(mockLocation, (updated) => {
                updated.line1 = "updated line1";
            })
        );
        expect(await screen.findByText(/updated line1/)).toBeInTheDocument();
        await DataStore.save(
            models.Location.copyOf(mockLocation2, (updated) => {
                updated.line1 = "updated second line1";
            })
        );
        expect(
            await screen.findByText(/updated second line1/)
        ).toBeInTheDocument();
        await DataStore.save(
            models.Task.copyOf(mockTask, (upd) => {
                upd.pickUpLocation = mockLocation3;
            })
        );
        expect(await screen.findByText(/third line1/)).toBeInTheDocument();
        expect(screen.queryByText(/updated line1/)).toBeNull();
    });

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
            await Promise.all(
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
            };
            render(
                <>
                    <FakeDispatchComponent />
                    <TasksGridColumn taskKey={[tasksStatus.new]} />
                </>,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            expect(screen.getAllByText(/first ward/)).toHaveLength(10);
            expect(screen.getAllByText(/first line1/)).toHaveLength(10);
            expect(screen.getAllByText(/second ward/)).toHaveLength(10);
            expect(screen.getAllByText(/second line1/)).toHaveLength(10);
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
        await Promise.all(
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
        const preloadedState = {
            roleView: "ALL",
            whoami: { user: mockWhoami },
        };
        render(
            <>
                <FakeDispatchComponent />
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
        await finishLoading();
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await finishLoading();
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
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
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />, {
            preloadedState,
        });
        await finishLoading();
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
        render(
            <TasksGridColumn
                taskKey={[tasksStatus.new]}
                title={tasksStatus.new}
            />,
            {
                preloadedState,
            }
        );
        await finishLoading();
        expect(
            await screen.findAllByTestId("CheckBoxOutlineBlankIcon")
        ).toHaveLength(11);
        userEvent.click(screen.getByTestId(`${tasksStatus.new}-select-all`));

        expect(await screen.findAllByTestId("CheckBoxIcon")).toHaveLength(11);
    });

    test("show the comment count", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        await DataStore.save(
            new models.Comment({
                parentId: task.id,
                visibility: commentVisibility.everyone,
                author: mockWhoami,
                body: "test",
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
        render(
            <>
                <FakeDispatchComponent />
                <TasksGridColumn taskKey={[tasksStatus.new]} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        expect(await screen.findByText("1")).toBeInTheDocument();
        await DataStore.save(
            new models.Comment({
                parentId: task.id,
                visibility: commentVisibility.everyone,
                author: mockWhoami,
                body: "test",
            })
        );
        await waitFor(
            () => {
                expect(screen.getByText("2")).toBeInTheDocument();
            },
            { timeout: 4000 }
        );
    });

    test("show the assignees", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const mockAssignee1 = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "A Coordinator",
            })
        );
        const mockAssignee2 = await DataStore.save(
            new models.User({
                roles: [userRoles.rider],
                displayName: "A Rider",
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task: task,
                assignee: mockAssignee1,
                role: userRoles.coordinator,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task: task,
                assignee: mockAssignee2,
                role: userRoles.rider,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task: task,
                assignee: mockWhoami,
                role: userRoles.coordinator,
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
        };
        render(
            <>
                <FakeDispatchComponent />
                <TasksGridColumn taskKey={[tasksStatus.new]} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        const tooltip = await screen.findByTestId("assignee-names-tooltip");
        userEvent.hover(tooltip);
        expect(await screen.findByText(/A Coordinator/)).toBeInTheDocument();
        expect(await screen.findByText(/A Rider/)).toBeInTheDocument();
        expect(screen.queryByText(/Someone Person/)).toBeNull();
    });

    it("shows the deliverables", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        const mockWhoami = await DataStore.save(
            new models.User({
                roles: [userRoles.coordinator],
                displayName: "Someone Person",
            })
        );
        const fakeDeliverableType = await DataStore.save(
            new models.DeliverableType({
                label: "del 1",
            })
        );
        const fakeDeliverableType2 = await DataStore.save(
            new models.DeliverableType({
                label: "del 2",
            })
        );
        await DataStore.save(
            new models.Deliverable({
                task: task,
                deliverableType: fakeDeliverableType,
                count: 5,
            })
        );
        await DataStore.save(
            new models.Deliverable({
                task: task,
                deliverableType: fakeDeliverableType2,
                count: 10,
            })
        );
        const preloadedState = {
            roleView: "ALL",
            dashboardTabIndex: 1,
            whoami: { user: mockWhoami },
        };
        render(
            <>
                <FakeDispatchComponent />
                <TasksGridColumn taskKey={[tasksStatus.new]} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        expect(
            await screen.findByText(`${fakeDeliverableType.label} x 5`)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(`${fakeDeliverableType2.label} x 10`)
        ).toBeInTheDocument();
    });
});
