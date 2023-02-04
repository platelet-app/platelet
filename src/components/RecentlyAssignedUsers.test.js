import { render } from "../test-utils";
import * as models from "../models";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import RecentlyAssignedUsers from "./RecentlyAssignedUsers";
import { v4 as uuidv4 } from "uuid";
import { DataStore } from "aws-amplify";

const tenantId = "tenant-id";

const whoami = new models.User({
    roles: [models.Role.USER, models.Role.COORDINATOR],
});

const preloadedState = {
    taskAssigneesReducer: {
        items: [],
        ready: true,
        isSynced: true,
    },
    whoami: {
        user: whoami,
    },
    tenantId,
};

const fakeAssignments = Object.values(models.TaskStatus)
    .filter((s) => s !== models.TaskStatus.NEW)
    .map((status) => ({
        task: new models.Task({
            status,
        }),
        assignee: new models.User({
            displayName: uuidv4(),
            roles: ["USER", "RIDER"],
        }),
        role: models.Role.RIDER,
    }));

const fakeAssignmentsCoordinator = Object.values(models.TaskStatus).map(
    (status) => ({
        task: new models.Task({
            status,
        }),
        assignee: new models.User({
            displayName: uuidv4(),
            roles: ["USER", "COORDINATOR"],
        }),
        role: models.Role.COORDINATOR,
    })
);

const fakeCoord1 = new models.User({
    displayName: "First Coordinator",
    roles: ["USER", "COORDINATOR"],
});
const fakeCoord2 = new models.User({
    displayName: "Second Coordinator",
    roles: ["USER", "COORDINATOR"],
});

const fakeAssignmentsFirstCoord = _.range(0, 5).map((i) => ({
    task: new models.Task({
        status: models.TaskStatus.ACTIVE,
    }),
    assignee: fakeCoord1,
    role: models.Role.COORDINATOR,
}));
const fakeAssignmentsSecondCoord = _.range(0, 5).map((i) => ({
    task: new models.Task({
        status: models.TaskStatus.ACTIVE,
    }),
    assignee: fakeCoord2,
    role: models.Role.COORDINATOR,
}));
const fakeAssignmentsRiders = [
    ...fakeAssignmentsFirstCoord,
    ...fakeAssignmentsSecondCoord,
].map((assignment) => ({
    task: assignment.task,
    assignee: new models.User({
        displayName: uuidv4(),
        roles: ["USER", "RIDER"],
    }),
    role: models.Role.RIDER,
}));

const saveFakeAssignments = async () => {
    return await Promise.all(
        fakeAssignments.map(async (a) => {
            const assignee = await DataStore.save(a.assignee);
            const task = await DataStore.save(a.task);
            return await DataStore.save(
                new models.TaskAssignee({
                    role: a.role,
                    assignee,
                    task,
                })
            );
        })
    );
};

const saveFakeAssignmentsRiders = async () => {
    return await Promise.all(
        fakeAssignmentsRiders.map(async (a) => {
            const assignee = await DataStore.save(a.assignee);
            const task = await DataStore.save(a.task);
            return await DataStore.save(
                new models.TaskAssignee({
                    role: a.role,
                    assignee,
                    task,
                })
            );
        })
    );
};

const saveFakeAssignmentsCoordinator = async () => {
    return await Promise.all(
        fakeAssignmentsCoordinator.map(async (a) => {
            const assignee = await DataStore.save(a.assignee);
            const task = await DataStore.save(a.task);
            return await DataStore.save(
                new models.TaskAssignee({
                    role: a.role,
                    assignee,
                    task,
                })
            );
        })
    );
};

const saveFakeAssignmentsFirstCoordinator = async () => {
    return await Promise.all(
        fakeAssignmentsFirstCoord.map(async (a) => {
            const assignee = await DataStore.save(a.assignee);
            const task = await DataStore.save(a.task);
            return await DataStore.save(
                new models.TaskAssignee({
                    role: a.role,
                    assignee,
                    task,
                })
            );
        })
    );
};

const saveFakeAssignmentsSecondCoordinator = async () => {
    return await Promise.all(
        fakeAssignmentsSecondCoord.map(async (a) => {
            const assignee = await DataStore.save(a.assignee);
            const task = await DataStore.save(a.task);
            return await DataStore.save(
                new models.TaskAssignee({
                    role: a.role,
                    assignee,
                    task,
                })
            );
        })
    );
};

describe("RecentlyAssignedUsers", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await DataStore.clear();
    });
    beforeAll(async () => {
        await DataStore.save(whoami);
    });
    it("renders without crashing", async () => {
        render(<RecentlyAssignedUsers />, { preloadedState });
    });

    it("displays recent riders", async () => {
        const assignees = await saveFakeAssignments();
        render(
            <RecentlyAssignedUsers value={null} role={models.Role.RIDER} />,
            {
                preloadedState,
            }
        );
        await screen.findByTestId("recent-assigned-users");
        for (const assign of assignees) {
            const assignee = await assign.assignee;
            expect(screen.getByText(assignee.displayName)).toBeInTheDocument();
        }
    });

    it("limits display count", async () => {
        await saveFakeAssignments();
        render(
            <RecentlyAssignedUsers
                limit={3}
                value={null}
                role={models.Role.RIDER}
            />,
            {
                preloadedState,
            }
        );
        expect(
            await screen.findByTestId("recent-assigned-users")
        ).toBeInTheDocument();
        expect(
            screen.getByTestId("recent-assigned-users").children.length
        ).toBe(3);
    });

    it("displays recent coordinators", async () => {
        const assignees = await saveFakeAssignmentsCoordinator();
        await saveFakeAssignmentsRiders();
        render(
            <RecentlyAssignedUsers
                value={null}
                role={models.Role.COORDINATOR}
            />,
            {
                preloadedState,
            }
        );
        const parent = await screen.findByTestId("recent-assigned-users");
        for (const assign of assignees) {
            const assignee = await assign.assignee;
            expect(screen.getByText(assignee.displayName)).toBeInTheDocument();
        }
        expect(parent.children.length).toBe(assignees.length);
    });

    test("click on a user", async () => {
        const assignees = await saveFakeAssignmentsCoordinator();
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={null}
                role={models.Role.COORDINATOR}
            />,
            { preloadedState }
        );
        expect(
            await screen.findByTestId("recent-assigned-users")
        ).toBeInTheDocument();
        const first = await assignees[0].assignee;
        userEvent.click(screen.getByText(first.displayName));
        expect(onChange).toHaveBeenCalledWith(first);
    });

    it("highlights the selected user", async () => {
        const assignees = await saveFakeAssignments();
        const first = await assignees[0].assignee;
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={first}
                role={models.Role.RIDER}
            />,
            {
                preloadedState,
            }
        );
        await screen.findByTestId("recent-assigned-users");
        const userChip = screen.getByRole("button", {
            name: first.displayName,
        });
        expect(userChip).toHaveClass("MuiChip-filled");
        const others = [];
        for (const assign of assignees) {
            const assignee = await assign.assignee;
            if (assignee.id !== first.id) {
                others.push(assignee);
            }
        }
        for (const a of others) {
            expect(
                screen.getByRole("button", { name: a.displayName })
            ).toHaveClass("MuiChip-outlined");
        }
    });

    it("nulls on current selected user click", async () => {
        const assignees = await saveFakeAssignments();
        const first = await assignees[0].assignee;
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={first}
                role={models.Role.RIDER}
            />,
            {
                preloadedState,
            }
        );
        await screen.findByTestId("recent-assigned-users");
        userEvent.click(screen.getByText(first.displayName));
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it("excludes users", async () => {
        const assignees = await saveFakeAssignments();
        const first = await assignees[0].assignee;
        render(
            <RecentlyAssignedUsers
                exclude={[first.id]}
                value={null}
                role={models.Role.RIDER}
            />,
            {
                preloadedState,
            }
        );
        await screen.findByTestId("recent-assigned-users");
        const filtered = [];
        for (const assign of assignees) {
            const assignee = await assign.assignee;
            if (assignee.id !== first.id) {
                filtered.push(assignee);
            }
        }
        for (const a of filtered) {
            expect(screen.getByText(a.displayName)).toBeInTheDocument();
        }
        expect(screen.queryByText(first.displayName)).toBeNull();
    });

    it.each`
        role
        ${models.Role.RIDER} | ${models.Role.COORDINATOR}
    `("don't show users that no longer have the role", async ({ role }) => {
        const fakeUserNoRoles = await DataStore.save(
            new models.User({
                displayName: uuidv4(),
                roles: [models.Role.USER],
            })
        );
        const task = await DataStore.save(new models.Task({}));
        await DataStore.save(
            new models.TaskAssignee({
                assignee: fakeUserNoRoles,
                task,
                role: role,
            })
        );

        render(<RecentlyAssignedUsers value={null} role={role} />, {
            preloadedState,
        });
        await screen.findByTestId("recent-assigned-users");
        await waitFor(() => {
            expect(screen.queryByText(fakeUserNoRoles.displayName)).toBeNull();
        });
    });

    test("coordinator roleview shows only intersecting assignments", async () => {
        const firstCoord = await saveFakeAssignmentsFirstCoordinator();
        const secondCoord = await saveFakeAssignmentsSecondCoordinator();
        const riders = await saveFakeAssignmentsRiders();
        const coord = await firstCoord[0].assignee;
        const newPreloadedState = {
            roleView: models.Role.COORDINATOR,
            whoami: { user: coord },
        };
        render(<RecentlyAssignedUsers />, {
            preloadedState: newPreloadedState,
        });
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignmentsRiders[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        const expectedItems = [];
        for (const riderAssign of riders) {
            const rider = await riderAssign.assignee;
            const riderTask = await riderAssign.task;
            for (const coordAssign of firstCoord) {
                const coordTask = await coordAssign.task;
                if (riderTask.id === coordTask.id) {
                    expectedItems.push(rider);
                }
            }
        }
        for (const expected of expectedItems) {
            expect(screen.getByText(expected.displayName)).toBeInTheDocument();
        }
        const unexpectedItems = [];
        for (const riderAssign of riders) {
            const rider = await riderAssign.assignee;
            const riderTask = await riderAssign.task;
            for (const coordAssign of secondCoord) {
                const coordTask = await coordAssign.task;
                if (riderTask.id === coordTask.id) {
                    unexpectedItems.push(rider);
                }
            }
        }
        for (const unexpected of unexpectedItems) {
            expect(screen.queryByText(unexpected.displayName)).toBeNull();
        }
    });
});
