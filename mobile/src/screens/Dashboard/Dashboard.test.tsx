import * as React from "react";
import { DataStore } from "aws-amplify";
import { useDispatch } from "react-redux";
import * as models from "../../models";
import { fireEvent, render, screen, waitFor } from "../../test-utils";
import Dashboard from "./Dashboard";
import * as commentActions from "../../redux/comments/commentsActions";
import * as taskDeliverablesActions from "../../redux/taskDeliverables/taskDeliverablesActions";
import _ from "lodash";
import SearchAndUserMenuBar from "./components/SearchAndUserMenuBar";
import { setDashboardFilter } from "../../redux/dashboardFilter/DashboardFilterActions";
import MultipleSelectionMenu from "./components/MultipleSelectionMenu";
import { AppState } from "react-native";

jest.mock("react-native/Libraries/AppState/AppState", () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentState: "active",
}));

const tenantId = "test-tenant";

const dateCreated = new Date().toISOString().split("T")[0];

const FakeDispatchComponent = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(commentActions.initComments());
        dispatch(taskDeliverablesActions.initTaskDeliverables());
    }, [dispatch]);
    return null;
};

describe("Dashboard", () => {
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

    beforeAll(async () => {
        jest.useFakeTimers();
    });

    afterEach(async () => {
        await DataStore.clear();
    });

    beforeEach(() => {
        jest.restoreAllMocks();
        mockDate();
    });

    afterEach(async () => {
        await DataStore.clear();
    });

    const finishLoading = async () => {
        await waitFor(
            () => {
                expect(
                    screen.queryByTestId("task-grid-tasks-list-skeleton")
                ).toBeNull();
            },
            { timeout: 5000 }
        );
    };

    test.skip("disable and restart observers on inactive/active status", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const appStateSpy = jest.spyOn(AppState, "addEventListener");
        const unsubscribe = jest.fn();
        const unsubscribe2 = jest.fn();
        const subscribe = jest.fn((callback: any) => {
            callback({ items: [] });
            return {
                unsubscribe,
            };
        });
        const subscribe2 = jest.fn(() => ({ unsubscribe: unsubscribe2 }));
        render(<Dashboard tabIndex={0} status="inProgress" />, {
            preloadedState,
        });
        //await appStateSpy.mock.calls[0][1]("active");
        jest.spyOn(DataStore, "observeQuery").mockImplementation(() => {
            return {
                subscribe,
            };
        });

        jest.spyOn(DataStore, "observe").mockImplementation(() => {
            return {
                subscribe: subscribe2,
            };
        });
        await finishLoading();
        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe2).toHaveBeenCalledTimes(1);
        await appStateSpy.mock.calls[0][1]("inactive");
        expect(unsubscribe).toHaveBeenCalledTimes(1);
        expect(unsubscribe2).toHaveBeenCalledTimes(1);
    });

    test.each`
        status
        ${"inProgress"} | ${"completed"}
    `(
        "renders column titles",
        async ({ status }: { status: "inProgress" | "completed" }) => {
            render(
                <Dashboard
                    tabIndex={status === "inProgress" ? 0 : 1}
                    status={status}
                />
            );
            screen.getByTestId("task-grid-tasks-list-skeleton");
            await finishLoading();
            if (status === "inProgress") {
                await waitFor(() => {
                    screen.getByText("ACTIVE");
                });
                screen.getByText("PICKED UP");

                screen.getByText("DELIVERED");
            } else {
                await waitFor(() => {
                    screen.getByText("COMPLETED");
                });
                screen.getByText("CANCELLED");
                screen.getByText("REJECTED");
                screen.getByText("ABANDONED");
            }
        }
    );
    it.each`
        status
        ${"completed"} | ${"inProgress"}
    `(
        "shows assigned tasks and responds to changes",
        async ({ status }: { status: "inProgress" | "completed" }) => {
            const whoami = await DataStore.save(
                new models.User({
                    name: "John Doe",
                    displayName: "John Doe",
                    cognitoId: "123",
                    roles: [models.Role.RIDER],
                    tenantId,
                    username: "johndoe",
                })
            );
            const task = await DataStore.save(
                new models.Task({
                    tenantId,
                    status: models.TaskStatus.ACTIVE,
                    dateCreated,
                    priority: models.Priority.LOW,
                })
            );
            const task2 = await DataStore.save(
                new models.Task({
                    tenantId,
                    status: models.TaskStatus.PICKED_UP,
                    dateCreated,
                    priority: models.Priority.HIGH,
                })
            );
            const task3 = await DataStore.save(
                new models.Task({
                    tenantId,
                    status: models.TaskStatus.COMPLETED,
                    dateCreated,
                    priority: models.Priority.MEDIUM,
                })
            );
            const task4 = await DataStore.save(
                new models.Task({
                    tenantId,
                    status: models.TaskStatus.REJECTED,
                    dateCreated,
                    priority: models.Priority.LOW,
                })
            );
            const [ass1, _, ass2] = await Promise.all(
                [task, task2, task3, task4].map((task) => {
                    return DataStore.save(
                        new models.TaskAssignee({
                            tenantId,
                            task: task,
                            assignee: whoami,
                            role: models.Role.RIDER,
                        })
                    );
                })
            );
            const preloadedState = {
                whoami: { user: whoami },
            };
            render(
                <Dashboard
                    tabIndex={status === "inProgress" ? 0 : 1}
                    status={status}
                />,
                { preloadedState }
            );
            await finishLoading();
            if (status === "inProgress") {
                screen.getByText("LOW");
                screen.getByText("HIGH");
                expect(screen.queryByText("MEDIUM")).toBeNull();
                await DataStore.delete(ass1);
                await waitFor(
                    () => {
                        expect(screen.queryByText("LOW")).toBeNull();
                    },
                    { timeout: 5000 }
                );
                const newTask = await DataStore.save(
                    new models.Task({
                        tenantId,
                        status: models.TaskStatus.ACTIVE,
                        priority: models.Priority.MEDIUM,
                        dateCreated,
                    })
                );
                await DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: newTask,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
                await waitFor(
                    () => {
                        screen.getByText("MEDIUM");
                    },
                    { timeout: 5000 }
                );
            } else {
                screen.getByText("MEDIUM");
                screen.getByText("LOW");
                expect(screen.queryByText("HIGH")).toBeNull();
                await DataStore.delete(ass2);
                await waitFor(
                    () => {
                        expect(screen.queryByText("MEDIUM")).toBeNull();
                    },
                    { timeout: 5000 }
                );
                const newTask = await DataStore.save(
                    new models.Task({
                        tenantId,
                        status: models.TaskStatus.COMPLETED,
                        priority: models.Priority.HIGH,
                        dateCreated,
                    })
                );
                await DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: newTask,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
                await waitFor(
                    () => {
                        screen.getByText("HIGH");
                    },
                    { timeout: 5000 }
                );
            }
        }
    );
    it("shows deliverables and responds to changes", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.PICKED_UP,
                dateCreated,
                priority: models.Priority.HIGH,
            })
        );
        await Promise.all(
            [task, task2].map((task) => {
                return DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: task,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
            })
        );
        const delt1 = await DataStore.save(
            new models.DeliverableType({
                tenantId,
                label: "Test Deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
            })
        );
        const delt2 = await DataStore.save(
            new models.DeliverableType({
                tenantId,
                label: "Another Deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
            })
        );
        const delt3 = await DataStore.save(
            new models.DeliverableType({
                tenantId,
                label: "New Deliverable",
                defaultUnit: models.DeliverableUnit.ITEM,
            })
        );
        const firstDeliverable = await DataStore.save(
            new models.Deliverable({
                tenantId,
                task: task,
                deliverableType: delt1,
                count: 4,
            })
        );
        await DataStore.save(
            new models.Deliverable({
                tenantId,
                task: task2,
                deliverableType: delt2,
                count: 6,
            })
        );

        const preloadedState = {
            whoami: { user: whoami },
        };
        render(
            <>
                <Dashboard tabIndex={0} status={"inProgress"} />
                <FakeDispatchComponent />
            </>,
            { preloadedState }
        );
        await finishLoading();
        await screen.findByText("Test Deliverable x 4");
        await screen.findByText("Another Deliverable x 6");
        await DataStore.save(
            new models.Deliverable({
                deliverableType: delt3,
                tenantId,
                task: task2,
                count: 2,
            })
        );
        await waitFor(
            () => {
                screen.getByText("New Deliverable x 2");
            },
            { timeout: 5000 }
        );
        await DataStore.delete(firstDeliverable);
        await waitFor(
            () => {
                expect(screen.queryByText("Test Deliverable x 4")).toBeNull();
            },
            { timeout: 5000 }
        );
    });

    it("shows comment count and responds to changes", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.PICKED_UP,
                dateCreated,
                priority: models.Priority.HIGH,
            })
        );
        await Promise.all(
            [task, task2].map((task) => {
                return DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: task,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
            })
        );
        await Promise.all(
            _.range(4).map(async () => {
                await DataStore.save(
                    new models.Comment({
                        parentId: task.id,
                        body: "Test comment",
                        tenantId,
                        author: whoami,
                        visibility: models.CommentVisibility.EVERYONE,
                    })
                );
            })
        );
        await Promise.all(
            _.range(6).map(async () => {
                await DataStore.save(
                    new models.Comment({
                        parentId: task2.id,
                        body: "Test comment",
                        tenantId,
                        author: whoami,
                        visibility: models.CommentVisibility.ME,
                    })
                );
            })
        );
        const otherUser = await DataStore.save(
            new models.User({
                name: "Jane Doe",
                displayName: "Jane Doe",
                cognitoId: "1234",
                roles: [models.Role.RIDER],
                tenantId,
                username: "janedoe",
            })
        );
        // this one should be ignored and not counted
        await DataStore.save(
            new models.Comment({
                parentId: task2.id,
                author: otherUser,
                body: "Test comment",
                tenantId,
                visibility: models.CommentVisibility.ME,
            })
        );

        const preloadedState = {
            whoami: { user: whoami },
        };
        render(
            <>
                <Dashboard tabIndex={0} status={"inProgress"} />
                <FakeDispatchComponent />
            </>,
            { preloadedState }
        );
        await finishLoading();
        await screen.findByText("4");
        await screen.findByText("6");
        // responds to new comments and deleting comments
        await DataStore.save(
            new models.Comment({
                parentId: task.id,
                body: "Test comment",
                tenantId,
                author: whoami,
                visibility: models.CommentVisibility.EVERYONE,
            })
        );
        const delComment = await DataStore.save(
            new models.Comment({
                parentId: task2.id,
                body: "Test comment",
                tenantId,
                author: whoami,
                visibility: models.CommentVisibility.EVERYONE,
            })
        );
        await waitFor(
            () => {
                screen.getByText("5");
            },
            { timeout: 5000 }
        );
        await screen.findByText("7");
        await DataStore.delete(delComment);
        await waitFor(
            () => {
                screen.getByText("6");
            },
            { timeout: 5000 }
        );
    });

    it("shows address details and responds to changes", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const pickUpLocation = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "123 Main St",
                town: "SomeTown",
                postcode: "12345",
            })
        );
        const dropOffLocation = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "Another street",
                town: "Another town",
                postcode: "54321",
            })
        );
        const pickUpLocation2 = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "321 Main St",
                town: "Second some town",
                postcode: "33333",
            })
        );
        const dropOffLocation2 = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "Seconds another street",
                town: "Seconds another town",
                postcode: "44444",
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                pickUpLocation,
                dropOffLocation,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                tenantId,
                pickUpLocation: pickUpLocation2,
                dropOffLocation: dropOffLocation2,
                status: models.TaskStatus.PICKED_UP,
                dateCreated,
                priority: models.Priority.HIGH,
            })
        );
        await Promise.all(
            [task, task2].map((task) => {
                return DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: task,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        render(<Dashboard tabIndex={0} status="inProgress" />, {
            preloadedState,
        });
        await finishLoading();
        for (const l of [
            pickUpLocation,
            dropOffLocation,
            dropOffLocation2,
            pickUpLocation2,
        ]) {
            screen.getByText(new RegExp(`\\b${l.line1}\\b`));
            screen.getByText(new RegExp(`\\b${l.town}\\b`));
            screen.getByText(new RegExp(`\\b${l.postcode}\\b`));
        }
        await DataStore.save(
            models.Task.copyOf(task, (updated) => {
                updated.pickUpLocation = null;
            })
        );

        await waitFor(
            () => {
                expect(
                    screen.queryByText(
                        new RegExp(`\\b${pickUpLocation.line1}\\b`)
                    )
                ).toBeNull();
            },
            { timeout: 5000 }
        );
        await DataStore.save(
            models.Location.copyOf(dropOffLocation, (l) => {
                l.line1 = "New line 1";
            })
        );
        await waitFor(() => {
            expect(
                screen.queryByText(new RegExp(`\\b${dropOffLocation.line1}\\b`))
            ).toBeNull();
        });
        screen.getByText(new RegExp(`\\bNew line 1\\b`));
        const newLocation = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "New location",
            })
        );
        await DataStore.save(
            models.Task.copyOf(task, (updated) => {
                updated.pickUpLocation = newLocation;
            })
        );
        await waitFor(
            () => {
                screen.getByText(new RegExp(`\\bNew location\\b`));
            },
            { timeout: 5000 }
        );
        await DataStore.save(
            models.Location.copyOf(newLocation, (l) => {
                l.line1 = "boop";
            })
        );
        await waitFor(() => {
            screen.getByText(new RegExp(`\\bboop\\b`));
        });
        expect(screen.queryByText(new RegExp(`\\bNew location\\b`))).toBeNull();
    });

    test("filtering the dashboard", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const pickUpLocation = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "123 Main St",
                town: "SomeTown",
                postcode: "12345",
            })
        );
        const dropOffLocation = await DataStore.save(
            new models.Location({
                tenantId,
                listed: 1,
                line1: "Another street",
                town: "Another town",
                postcode: "54321",
            })
        );
        const task1 = await DataStore.save(
            new models.Task({
                dateCreated,
                tenantId,
                pickUpLocation,
                status: models.TaskStatus.ACTIVE,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                dateCreated,
                tenantId,
                dropOffLocation,
                status: models.TaskStatus.ACTIVE,
                priority: models.Priority.HIGH,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                tenantId,
                task: task1,
                assignee: whoami,
                role: models.Role.RIDER,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                tenantId,
                task: task2,
                assignee: whoami,
                role: models.Role.RIDER,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const { store } = render(
            <>
                <FakeDispatchComponent />
                <SearchAndUserMenuBar />
                <Dashboard tabIndex={0} status="inProgress" />
            </>,
            { preloadedState }
        );
        await finishLoading();
        await screen.findByText("LOW");
        const filter = screen.getByRole("search");
        fireEvent(filter, "onChangeText", "LOW");
        // for some reason fireEvent won't work, so forcing it..
        store.dispatch(setDashboardFilter("LOW"));
        await waitFor(() => {
            expect(screen.queryByText("HIGH")).toBeNull();
        });
        screen.getByText("LOW");
        store.dispatch(setDashboardFilter(""));
        await screen.findByText("HIGH");
        store.dispatch(setDashboardFilter("another street"));
        await waitFor(() => {
            expect(screen.queryByText("LOW")).toBeNull();
        });
        screen.getByText("HIGH");
    });

    test("observers are unsubscribed on unmount", async () => {
        const unsubscribe = jest.fn();
        const unsubscribe2 = jest.fn();
        jest.spyOn(DataStore, "observeQuery").mockImplementation(() => {
            return {
                subscribe: (callback: any) => {
                    callback({ items: [] });
                    return {
                        unsubscribe,
                    };
                },
            };
        });

        jest.spyOn(DataStore, "observe").mockImplementation(() => {
            return {
                subscribe: () => ({ unsubscribe: unsubscribe2 }),
            };
        });
        const { component } = render(
            <Dashboard tabIndex={0} status={"inProgress"} />
        );
        await finishLoading();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(0);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(unsubscribe2).toHaveBeenCalledTimes(1);
        });
    });
    test("mark multiple tasks as picked up", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.ACTIVE,
                dateCreated,
                priority: models.Priority.HIGH,
            })
        );
        await Promise.all(
            [task, task2].map((task) => {
                return DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: task,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <>
                <MultipleSelectionMenu tabIndex={0} />
                <Dashboard tabIndex={0} status={"inProgress"} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        fireEvent(screen.getByText("LOW"), "onLongPress");
        fireEvent(screen.getByText("HIGH"), "onLongPress");
        expect(
            screen.getAllByRole("button", { name: "Unselect task" })
        ).toHaveLength(2);
        fireEvent(
            screen.getByRole("button", { name: "Mark selected picked up" }),
            "onPress"
        );
        screen.getByText("Set the picked up time?");
        const input = screen.getByPlaceholderText("Sender name");
        fireEvent(input, "onChangeText", "John Doe");
        expect(input.props.value).toBe("John Doe");
        fireEvent(screen.getByRole("button", { name: "OK" }), "onPress");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timePickedUp: isoDate,
                status: models.TaskStatus.PICKED_UP,
                timePickedUpSenderName: "John Doe",
            });
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task2,
                timePickedUp: isoDate,
                status: models.TaskStatus.PICKED_UP,
                timePickedUpSenderName: "John Doe",
            });
        });
    });
    test("mark multiple tasks as delivered", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.PICKED_UP,
                timePickedUp: isoDate,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.PICKED_UP,
                timePickedUp: isoDate,
                dateCreated,
                priority: models.Priority.HIGH,
            })
        );
        await Promise.all(
            [task, task2].map((task) => {
                return DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: task,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <>
                <MultipleSelectionMenu tabIndex={0} />
                <Dashboard tabIndex={0} status={"inProgress"} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        fireEvent(screen.getByText("LOW"), "onLongPress");
        fireEvent(screen.getByText("HIGH"), "onLongPress");
        expect(
            screen.getAllByRole("button", { name: "Unselect task" })
        ).toHaveLength(2);
        fireEvent(
            screen.getByRole("button", { name: "Mark selected delivered" }),
            "onPress"
        );
        screen.getByText("Set the delivered time?");
        const input = screen.getByPlaceholderText("Recipient name");
        fireEvent(input, "onChangeText", "Another Person");
        expect(input.props.value).toBe("Another Person");
        fireEvent(screen.getByRole("button", { name: "OK" }), "onPress");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeDroppedOff: isoDate,
                status: models.TaskStatus.DROPPED_OFF,
                timeDroppedOffRecipientName: "Another Person",
            });
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task2,
                timeDroppedOff: isoDate,
                status: models.TaskStatus.DROPPED_OFF,
                timeDroppedOffRecipientName: "Another Person",
            });
        });
    });
    test("mark multiple tasks as rider home", async () => {
        const whoami = await DataStore.save(
            new models.User({
                name: "John Doe",
                displayName: "John Doe",
                cognitoId: "123",
                roles: [models.Role.RIDER],
                tenantId,
                username: "johndoe",
            })
        );
        const task = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.DROPPED_OFF,
                timePickedUp: isoDate,
                timeDroppedOff: isoDate,
                dateCreated,
                priority: models.Priority.LOW,
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                tenantId,
                status: models.TaskStatus.DROPPED_OFF,
                timePickedUp: isoDate,
                timeDroppedOff: isoDate,
                dateCreated,
                priority: models.Priority.HIGH,
            })
        );
        await Promise.all(
            [task, task2].map((task) => {
                return DataStore.save(
                    new models.TaskAssignee({
                        tenantId,
                        task: task,
                        assignee: whoami,
                        role: models.Role.RIDER,
                    })
                );
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <>
                <MultipleSelectionMenu tabIndex={0} />
                <Dashboard tabIndex={0} status={"inProgress"} />
            </>,
            {
                preloadedState,
            }
        );
        await finishLoading();
        fireEvent(screen.getByText("LOW"), "onLongPress");
        fireEvent(screen.getByText("HIGH"), "onLongPress");
        expect(
            screen.getAllByRole("button", { name: "Unselect task" })
        ).toHaveLength(2);
        fireEvent(
            screen.getByRole("button", { name: "Mark selected rider home" }),
            "onPress"
        );
        screen.getByText("Set the rider home time?");
        fireEvent(screen.getByRole("button", { name: "OK" }), "onPress");
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task,
                timeRiderHome: isoDate,
                status: models.TaskStatus.COMPLETED,
            });
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...task2,
                timeRiderHome: isoDate,
                status: models.TaskStatus.COMPLETED,
            });
        });
    });
    test.each`
        status
        ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
    `(
        "mark multiple tasks as cancelled or rejected",
        async ({ status }: { status: models.TaskStatus }) => {
            const whoami = await DataStore.save(
                new models.User({
                    name: "John Doe",
                    displayName: "John Doe",
                    cognitoId: "123",
                    roles: [models.Role.RIDER],
                    tenantId,
                    username: "johndoe",
                })
            );
            const task = await DataStore.save(
                new models.Task({
                    tenantId,
                    status: models.TaskStatus.ACTIVE,
                    dateCreated,
                    priority: models.Priority.LOW,
                })
            );
            const task2 = await DataStore.save(
                new models.Task({
                    tenantId,
                    status: models.TaskStatus.ACTIVE,
                    dateCreated,
                    priority: models.Priority.HIGH,
                })
            );
            await Promise.all(
                [task, task2].map((task) => {
                    return DataStore.save(
                        new models.TaskAssignee({
                            tenantId,
                            task: task,
                            assignee: whoami,
                            role: models.Role.RIDER,
                        })
                    );
                })
            );
            const mockComment = new models.Comment({
                tenantId,
                author: whoami,
                body: "Some reason",
                parentId: "tempId",
            });
            const preloadedState = {
                whoami: { user: whoami },
                tenantId,
            };
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <>
                    <MultipleSelectionMenu tabIndex={0} />
                    <Dashboard tabIndex={0} status={"inProgress"} />
                </>,
                {
                    preloadedState,
                }
            );
            await finishLoading();
            fireEvent(screen.getByText("LOW"), "onLongPress");
            fireEvent(screen.getByText("HIGH"), "onLongPress");
            expect(
                screen.getAllByRole("button", { name: "Unselect task" })
            ).toHaveLength(2);
            fireEvent(
                screen.getByRole("button", { name: "More options" }),
                "onPress"
            );
            const menuText =
                status === models.TaskStatus.REJECTED
                    ? "Rejected"
                    : "Cancelled";
            fireEvent(screen.getByText(menuText), "onPress");
            const title =
                status === models.TaskStatus.REJECTED
                    ? "rejected"
                    : "cancelled";
            screen.getByText(`Set the ${title} time?`);
            const commentInput = screen.getByPlaceholderText("Reason...");
            fireEvent(commentInput, "onChangeText", "Some reason");
            expect(commentInput.props.value).toBe("Some reason");
            fireEvent(screen.getByRole("button", { name: "OK" }), "onPress");
            if (status === models.TaskStatus.REJECTED) {
                await waitFor(() => {
                    expect(saveSpy).toHaveBeenCalledWith({
                        ...task,
                        timeRejected: isoDate,
                        status: models.TaskStatus.REJECTED,
                    });
                });
                await waitFor(() => {
                    expect(saveSpy).toHaveBeenCalledWith({
                        ...task2,
                        timeRejected: isoDate,
                        status: models.TaskStatus.REJECTED,
                    });
                });
            } else {
                await waitFor(() => {
                    expect(saveSpy).toHaveBeenCalledWith({
                        ...task,
                        timeCancelled: isoDate,
                        status: models.TaskStatus.CANCELLED,
                    });
                });
                await waitFor(() => {
                    expect(saveSpy).toHaveBeenCalledWith({
                        ...task2,
                        timeCancelled: isoDate,
                        status: models.TaskStatus.CANCELLED,
                    });
                });
            }
            await waitFor(() => {
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockComment,
                    parentId: task.id,
                    id: expect.any(String),
                    visibility: models.CommentVisibility.EVERYONE,
                });
                expect(saveSpy).toHaveBeenCalledWith({
                    ...mockComment,
                    parentId: task2.id,
                    id: expect.any(String),
                    visibility: models.CommentVisibility.EVERYONE,
                });
            });

            await waitFor(
                () => {
                    expect(screen.queryByText("LOW")).toBeNull();
                    expect(screen.queryByText("HIGH")).toBeNull();
                },
                { timeout: 5000 }
            );
        }
    );
});
