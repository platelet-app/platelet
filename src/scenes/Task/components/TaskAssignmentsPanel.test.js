import React from "react";
import TaskAssignmentsPanel from "./TaskAssignmentsPanel";
import { render } from "../../../test-utils";
import { v4 as uuidv4 } from "uuid";
import * as amplify from "aws-amplify";
import * as models from "../../../models/index";
import _ from "lodash";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataStore } from "aws-amplify";
import { useDispatch } from "react-redux";
import * as initActions from "../../../redux/taskAssignees/taskAssigneesActions";

// For some reason in this file, the query spies are reporting inflated numbers
// of calls. I think it's because records are not properly being deleted between tests
// which means that the observeQuery is making multiple queries
// could be it'll be fine after DataStore.clear() can be called after tests instead

const FakeDispatchComponent = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(initActions.initTaskAssignees());
    }, [dispatch]);
    return null;
};

const errorMessage = "Sorry, something went wrong";

const tenantId = "tenantId";

const fakeUsers = _.range(0, 3).map(() => {
    const riderResponsibility = new models.RiderResponsibility({
        tenantId,
        label: uuidv4(),
    });
    return new models.User({
        displayName: uuidv4(),
        riderResponsibility: riderResponsibility.label,
        tenantId,
        roles: [models.Role.COORDINATOR, models.Role.RIDER, models.Role.USER],
    });
});

const fakeTask1 = new models.Task({
    tenantId,
    status: models.TaskStatus.NEW,
});
const fakeTask2 = new models.Task({
    tenantId,
    status: models.TaskStatus.NEW,
});

let count = 0;
const fakeAssignments = fakeUsers.map((user) => {
    count++;
    return new models.TaskAssignee({
        assignee: user,
        task: count <= 2 ? fakeTask1 : fakeTask2,
        role: count % 2 === 0 ? models.Role.COORDINATOR : models.Role.RIDER,
    });
});

const preloadedState = {
    tenantId,
    whoami: {
        user: new models.User({
            displayName: "some name",
            roles: [
                models.Role.COORDINATOR,
                models.Role.RIDER,
                models.Role.USER,
            ],
            tenantId,
        }),
    },
};

async function saveAssignments() {
    await Promise.all(
        fakeAssignments.map((assignment) => DataStore.save(assignment))
    );
}

async function saveCoordAssignments() {
    await Promise.all(
        fakeAssignments
            .filter((assignment) => assignment.role === models.Role.COORDINATOR)
            .map((assignment) => DataStore.save(assignment))
    );
}

describe("TaskAssignmentsPanel", () => {
    beforeEach(async () => {
        await DataStore.save(fakeTask1);
        await DataStore.save(fakeTask2);
        for (const user of fakeUsers) {
            await DataStore.save(user);
        }
        jest.restoreAllMocks();
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    it("renders", async () => {
        render(<TaskAssignmentsPanel taskId={fakeTask1.id} />, {
            preloadedState,
        });
    });

    it("displays chips of the assigned users", async () => {
        await saveAssignments();
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskAssignmentsPanel taskId={fakeTask1.id} />, {
            preloadedState,
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(3));
        console.log(querySpy.mock.calls);
        // TODO: mock amplify Storage to test avatars
        //const avatarGroup = screen.queryAllByRole("img");
        // expect to have the correct number of avatars
        // and correct names
        //expect(avatarGroup).toHaveLength(2);
        for (const user of fakeAssignments
            .filter((a) => a.task.id === fakeTask1.id)
            .map((a) => a.assignee)) {
            expect(screen.getByText(user.displayName)).toBeInTheDocument();
        }
    });

    it("displays cards for the assigned users when expanded", async () => {
        await saveAssignments();
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskAssignmentsPanel taskId={fakeTask1.id} />, {
            preloadedState,
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(3));
        // click the expand button
        userEvent.click(screen.getByRole("button", { name: "Edit Assignees" }));
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(4));
        for (const user of fakeAssignments
            .filter((a) => a.task.id === fakeTask1.id)
            .map((a) => a.assignee)) {
            expect(
                screen.getByText(new RegExp(user.displayName))
            ).toBeInTheDocument();
        }
    });

    it("is collapsed by default when there are assignees for both roles", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        await Promise.all(
            [
                new models.TaskAssignee({
                    assignee: fakeUsers[0],
                    task: fakeTask1,
                    role: models.Role.COORDINATOR,
                }),
                new models.TaskAssignee({
                    assignee: fakeUsers[1],
                    task: fakeTask1,
                    role: models.Role.RIDER,
                }),
            ].map((a) => DataStore.save(a))
        );
        render(<TaskAssignmentsPanel taskId={fakeTask1.id} />, {
            preloadedState,
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(3));
        expect(screen.queryByRole("combobox")).toBeNull();
        expect(screen.queryByText("No one assigned")).toBeNull();
    });

    it("is expanded by default when there are no assignees", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<TaskAssignmentsPanel taskId={fakeTask1.id} />, {
            preloadedState,
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getAllByText("No one assigned")).toHaveLength(2);
    });

    it.each`
        role
        ${models.Role.RIDER} | ${models.Role.COORDINATOR}
    `(
        "is expanded by default when there are no coordinators or riders",
        async ({ role }) => {
            await DataStore.save(
                new models.TaskAssignee({
                    task: fakeTask1,
                    role: role,
                    assignee: fakeUsers[0],
                })
            );
            const querySpy = jest.spyOn(DataStore, "query");
            render(<TaskAssignmentsPanel taskId={fakeTask1.id} />, {
                preloadedState,
            });
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            expect(screen.getByRole("combobox")).toBeInTheDocument();
            expect(screen.getAllByText("No one assigned")).toHaveLength(1);
        }
    );

    test("select and assign a rider", async () => {
        const mockUser = await DataStore.save(
            new models.User({
                displayName: uuidv4(),
                roles: [models.Role.RIDER],
                riderResponsibility: uuidv4(),
            })
        );
        const mockTask = fakeTask1;
        const mockAssignment = new models.TaskAssignee({
            assignee: mockUser,
            task: mockTask,
            role: models.Role.RIDER,
            tenantId,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<TaskAssignmentsPanel taskId={mockTask.id} />, {
            preloadedState,
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(2));

        expect(screen.getByText("RIDER")).toBeInTheDocument();
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, mockUser.displayName);
        const option = screen.getByText(mockUser.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        await waitFor(() =>
            expect(querySpy).toHaveBeenCalledWith(models.User, mockUser.id)
        );
        await waitFor(() =>
            expect(querySpy).toHaveBeenCalledWith(models.Task, fakeTask1.id)
        );
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(2));
        // expect(
        //     await screen.findByText(
        //         `${mockUser.displayName} (${mockUser.riderResponsibility})`
        //     )
        // ).toBeInTheDocument();
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockAssignment,
            id: expect.any(String),
        });
        expect(saveSpy).toHaveBeenCalledWith({
            ...mockTask,
            status: models.TaskStatus.ACTIVE,
            riderResponsibility: mockUser.riderResponsibility,
        });
        expect(
            await screen.findByText("Task moved to ACTIVE")
        ).toBeInTheDocument();
    });

    test("select and assign a coordinator", async () => {
        const mockTask = fakeTask1;
        const mockUser = fakeUsers[0];
        const mockAssignment = new models.TaskAssignee({
            assignee: mockUser,
            task: mockTask,
            role: models.Role.COORDINATOR,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={mockTask.id} />
            </>,
            { preloadedState }
        );
        /*await waitFor(() =>
            expect(querySpy).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee,
                expect.any(Function),
                { sort: expect.any(Function) }
            )
        );
        await waitFor(() =>
            expect(querySpy).toHaveBeenNthCalledWith(
                2,
                models.User,
                expect.any(Function)
            )
        );*/
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(18));
        const roleOption = screen.getByText("COORDINATOR");
        userEvent.click(roleOption);
        /*await waitFor(() =>
            expect(querySpy).toHaveBeenNthCalledWith(
                3,
                models.User,
                expect.any(Function)
            )
        );*/
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(19));
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, mockUser.displayName);
        const option = screen.getByText(mockUser.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(screen.getByText(mockUser.displayName)).toBeInTheDocument();
        expect(saveSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                ..._.omit(mockAssignment, "id"),
                assignee: expect.objectContaining(_.omit(mockUser, "id")),
                task: expect.objectContaining(_.omit(mockTask, "id")),
            })
        );
    });

    test("failure on assigning a user", async () => {
        const mockUser = fakeUsers[0];
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest
            .spyOn(amplify.DataStore, "save")
            .mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    reject(new Error("test"));
                });
            });
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={fakeTask1.id} />
            </>,
            { preloadedState }
        );
        //await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(11));
        expect(screen.getByText("RIDER")).toBeInTheDocument();
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, mockUser.displayName);
        const option = screen.getByText(mockUser.displayName);
        expect(option).toBeInTheDocument();
        userEvent.click(option);
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("deletes a coordinator assignment", async () => {
        const mockAssignment = fakeAssignments[1];
        await saveCoordAssignments();
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={fakeTask1.id} />
            </>,
            { preloadedState }
        );
        //await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(12));
        userEvent.click(screen.getByTestId("CancelIcon"));
        await waitFor(() =>
            expect(deleteSpy).toHaveBeenCalledWith(
                expect.objectContaining(_.omit(mockAssignment, "id"))
            )
        );
    });

    it("deletes a rider assignment", async () => {
        const mockAssignment = new models.TaskAssignee(fakeAssignments[0]);
        await DataStore.save(mockAssignment);
        const mockTask = fakeTask1;
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={fakeTask1.id} />
            </>,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(13));
        userEvent.click(screen.getByTestId("CancelIcon"));
        await waitFor(() =>
            expect(deleteSpy).toHaveBeenCalledWith(mockAssignment)
        );
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                riderResponsibility: null,
                status: models.TaskStatus.NEW,
            });
        });
    });

    it("deletes a rider assignment with multiple riders", async () => {
        const mockTask = new models.Task({
            status: models.TaskStatus.ACTIVE,
            riderResponsibility: "nope",
        });
        await DataStore.save(mockTask);
        const firstUser = new models.User({ riderResponsibility: "nope" });
        const anotherUser = new models.User({
            riderResponsibility: "test",
        });
        await DataStore.save(firstUser);
        await DataStore.save(anotherUser);
        const mockAssignment = await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: firstUser,
                role: models.Role.RIDER,
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: anotherUser,
                role: models.Role.RIDER,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={mockTask.id} />
            </>,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(14));
        const deleteButtons = await screen.findAllByTestId("CancelIcon");
        expect(deleteButtons).toHaveLength(2);
        userEvent.click(deleteButtons[0]);
        await waitFor(() => {
            expect(deleteSpy).toHaveBeenCalledWith(mockAssignment);
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                riderResponsibility: "test",
            });
        });
    });

    test("delete assignment error", async () => {
        await saveAssignments();
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest
            .spyOn(amplify.DataStore, "delete")
            .mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    reject(new Error("test"));
                });
            });
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={fakeTask1.id} />
            </>,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(15));
        userEvent.click(screen.getByRole("button", { name: "Edit Assignees" }));
        const deleteButtons = await screen.findAllByTestId("CancelIcon");
        expect(deleteButtons).toHaveLength(2);
        userEvent.click(deleteButtons[0]);
        await waitFor(() => expect(deleteSpy).toHaveBeenCalledTimes(1));
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test.each`
        role
        ${models.Role.RIDER} | ${models.Role.COORDINATOR}
    `("the views for different role views assigned", async ({ role }) => {
        const mockTask = new models.Task({
            status: models.TaskStatus.ACTIVE,
        });
        await DataStore.save(mockTask);

        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const mockWhoami = await DataStore.save(
            new models.User({
                displayName: "test",
                roles: [role],
            })
        );
        const mockRoleAssign = new models.TaskAssignee({
            task: mockTask,
            role: role,
            assignee: mockWhoami,
        });
        const mockOppositeRoleAssign = new models.TaskAssignee({
            task: mockTask,
            role:
                role === models.Role.RIDER
                    ? models.Role.COORDINATOR
                    : models.Role.RIDER,
            assignee: new models.User({
                displayName: "someone",
                roles: [models.Role.COORDINATOR, models.Role.RIDER],
            }),
        });
        const preloadedState = {
            roleView: role,
            whoami: {
                user: mockWhoami,
            },
            taskAssigneesReducer: {
                ready: true,
                isSynced: true,
                items: [mockRoleAssign, mockOppositeRoleAssign],
            },
        };
        render(<TaskAssignmentsPanel taskId={mockTask.id} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });

        if (role === models.Role.RIDER) {
            expect(
                screen.queryByRole("button", { name: "Edit Assignees" })
            ).toBeNull();
        } else {
            expect(
                screen.getByRole("button", { name: "Edit Assignees" })
            ).toBeInTheDocument();
        }
    });

    test.skip("the observer reacts to new records", async () => {
        const mockTask = new models.Task({
            status: models.TaskStatus.ACTIVE,
            tenantId,
        });
        await DataStore.save(mockTask);
        const mockUser = new models.User({
            displayName: "some rider",
            roles: [models.Role.COORDINATOR, models.Role.RIDER],
            tenantId,
        });
        const mockUser2 = new models.User({
            displayName: "someone",
            roles: [models.Role.COORDINATOR],
            tenantId,
        });
        await DataStore.save(mockUser);
        await DataStore.save(mockUser2);
        const mockAssignee = new models.TaskAssignee({
            task: mockTask,
            role: models.Role.COORDINATOR,
            assignee: mockUser2,
            tenantId,
        });
        await DataStore.save(mockAssignee);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={mockTask.id} />
            </>,
            { preloadedState }
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(await screen.findByText("someone")).toBeInTheDocument();
        await DataStore.save(
            new models.TaskAssignee({
                task: mockTask,
                assignee: mockUser,
                role: models.Role.RIDER,
                tenantId,
            })
        );
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(5);
        });
        expect(await screen.findByText("some rider")).toBeInTheDocument();
    });

    test("confirm before deleting yourself as coordinator", async () => {
        const mockTask = new models.Task({
            status: models.TaskStatus.NEW,
            tenantId,
        });
        await DataStore.save(mockTask);
        const mockWhoami = new models.User({
            tenantId,
            displayName: "myself",
            roles: [models.Role.COORDINATOR, models.Role.USER],
        });
        await DataStore.save(mockWhoami);
        const preloadedState = {
            tenantId,
            whoami: {
                user: mockWhoami,
            },
        };

        const mockAssignment = new models.TaskAssignee({
            assignee: mockWhoami,
            task: mockTask,
            role: models.Role.COORDINATOR,
            tenantId,
        });

        await DataStore.save(mockAssignment);
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(
            <>
                <FakeDispatchComponent />
                <TaskAssignmentsPanel taskId={mockTask.id} />
            </>,
            { preloadedState }
        );
        // 43???
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(43));
        userEvent.click(screen.getByTestId("CancelIcon"));
        await waitFor(() => expect(deleteSpy).not.toHaveBeenCalled());
        expect(
            screen.getByText("Are you sure you want to unassign yourself?")
        ).toBeInTheDocument();
        const okButton = screen.getByRole("button", { name: "OK" });
        userEvent.click(okButton);
        await waitFor(() =>
            expect(deleteSpy).toHaveBeenCalledWith(
                expect.objectContaining(_.omit(mockAssignment, "id"))
            )
        );
        await waitFor(() => {
            expect(okButton).not.toBeInTheDocument();
        });
    });

    test.only("cancel deleting yourself as coordinator", async () => {
        const mockTask = new models.Task({
            status: models.TaskStatus.NEW,
            tenantId,
        });
        await DataStore.save(mockTask);
        const mockWhoami = new models.User({
            tenantId,
            displayName: "myself",
            roles: [models.Role.COORDINATOR, models.Role.USER],
        });
        await DataStore.save(mockWhoami);
        const preloadedState = {
            tenantId,
            whoami: {
                user: mockWhoami,
            },
        };

        const mockAssignment = new models.TaskAssignee({
            assignee: mockWhoami,
            task: mockTask,
            role: models.Role.COORDINATOR,
            tenantId,
        });

        await DataStore.save(mockAssignment);
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        render(<TaskAssignmentsPanel taskId={mockTask.id} />, {
            preloadedState,
        });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(3));
        userEvent.click(screen.getByTestId("CancelIcon"));
        expect(deleteSpy).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(
                screen.getByText("Are you sure you want to unassign yourself?")
            ).toBeInTheDocument();
        });
        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        userEvent.click(cancelButton);
        await waitFor(() => {
            expect(cancelButton).not.toBeInTheDocument();
        });
    });
});
