import React from "react";
import { render } from "../test-utils";
import * as models from "../models";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import RecentlyAssignedUsers from "./RecentlyAssignedUsers";
import { tasksStatus, userRoles } from "../apiConsts";
import { v4 as uuidv4 } from "uuid";

jest.mock("aws-amplify");

const preloadedState = {
    taskAssigneesReducer: {
        items: [],
        ready: true,
        isSynced: true,
    },
    whoami: {
        user: new models.User({
            roles: [userRoles.user, userRoles.coordinator],
        }),
    },
    tenantId: "tenant-id",
};

const fakeAssignments = Object.values(tasksStatus)
    .filter((s) => s !== tasksStatus.new)
    .map(
        (status) =>
            new models.TaskAssignee({
                task: new models.Task({
                    status,
                }),
                assignee: new models.User({
                    displayName: uuidv4(),
                    roles: ["USER", "RIDER"],
                }),
                role: userRoles.rider,
            })
    );

const fakeAssignmentsCoordinator = Object.values(tasksStatus).map(
    (status) =>
        new models.TaskAssignee({
            task: new models.Task({
                status,
            }),
            assignee: new models.User({
                displayName: uuidv4(),
                roles: ["USER", "COORDINATOR"],
            }),
            role: userRoles.coordinator,
        })
);

const fakeSingleUser = new models.User({
    displayName: uuidv4(),
    roles: ["USER", "RIDER"],
});

const fakeAssignmentsOneRider = _.range(0, 10).map(
    (i) =>
        new models.TaskAssignee({
            task: new models.Task({
                status: i > 3 ? tasksStatus.droppedOff : tasksStatus.active,
            }),
            assignee: fakeSingleUser,
            role: userRoles.rider,
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

const fakeAssignmentsFirstCoord = _.range(0, 5).map(
    (i) =>
        new models.TaskAssignee({
            task: new models.Task({
                status: tasksStatus.active,
            }),
            assignee: fakeCoord1,
            role: userRoles.coordinator,
        })
);
const fakeAssignmentsSecondCoord = _.range(0, 5).map(
    (i) =>
        new models.TaskAssignee({
            task: new models.Task({
                status: tasksStatus.active,
            }),
            assignee: fakeCoord2,
            role: userRoles.coordinator,
        })
);
const fakeAssignmentsRiders = [
    ...fakeAssignmentsFirstCoord,
    ...fakeAssignmentsSecondCoord,
].map((assignment) => ({
    task: assignment.task,
    assignee: new models.User({
        displayName: uuidv4(),
        roles: ["USER", "RIDER"],
    }),
    role: userRoles.rider,
}));

describe("RecentlyAssignedUsers", () => {
    it("renders without crashing", async () => {
        render(<RecentlyAssignedUsers />, { preloadedState });
    });

    it("displays recent riders", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(<RecentlyAssignedUsers value={null} role={userRoles.rider} />, {
            preloadedState: newPreloadedState,
        });
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignments[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        for (const assign of fakeAssignments) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
    });

    it("limits display count", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <RecentlyAssignedUsers
                limit={3}
                value={null}
                role={userRoles.rider}
            />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignments[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        // separate fakeAssignments into first 3 and the rest
        const firstThree = fakeAssignments.slice(0, 3);
        const rest = fakeAssignments.slice(3);
        for (const assign of firstThree) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
        for (const assign of rest) {
            expect(screen.queryByText(assign.assignee.displayName)).toBeNull();
        }
    });

    it("displays recent coordinators", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignmentsCoordinator,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <RecentlyAssignedUsers value={null} role={userRoles.coordinator} />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText(
                    fakeAssignmentsCoordinator[0].assignee.displayName
                )
            ).toBeInTheDocument();
        });
        for (const assign of fakeAssignmentsCoordinator) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
    });

    test("click on a user", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignmentsCoordinator,
                ready: true,
                isSynced: true,
            },
        };
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={null}
                role={userRoles.coordinator}
            />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText(
                    fakeAssignmentsCoordinator[0].assignee.displayName
                )
            ).toBeInTheDocument();
        });
        userEvent.click(
            screen.getByText(fakeAssignmentsCoordinator[0].assignee.displayName)
        );
        expect(onChange).toHaveBeenCalledWith(
            fakeAssignmentsCoordinator[0].assignee
        );
    });

    it("highlights the selected user", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignments,
                ready: true,
                isSynced: true,
            },
        };
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={fakeAssignments[0].assignee}
                role={userRoles.rider}
            />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignments[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        const userChip = screen.getByRole("button", {
            name: fakeAssignments[0].assignee.displayName,
        });
        expect(userChip).toHaveClass("MuiChip-default");
    });

    it("nulls on current selected user click", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignments,
                ready: true,
                isSynced: true,
            },
        };
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={fakeAssignments[0].assignee}
                role={userRoles.rider}
            />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignments[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        userEvent.click(
            screen.getByText(fakeAssignments[0].assignee.displayName)
        );
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it("excludes users", async () => {
        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignments,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <RecentlyAssignedUsers
                exclude={[fakeAssignments[0].assignee.id]}
                value={null}
                role={userRoles.rider}
            />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignments[1].assignee.displayName)
            ).toBeInTheDocument();
        });
        for (const assign of fakeAssignments.filter(
            (a) => a.assignee.id !== fakeAssignments[0].assignee.id
        )) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
        expect(
            screen.queryByText(fakeAssignments[0].assignee.displayName)
        ).toBeNull();
    });

    it.each`
        role
        ${userRoles.rider} | ${userRoles.coordinator}
    `("don't show users that no longer have the role", async ({ role }) => {
        const fakeUserNoRoles = new models.User({
            displayName: uuidv4(),
            roles: ["USER"],
        });
        const fakeAssignmentsNew = [
            new models.TaskAssignee({
                assignee: fakeUserNoRoles,
                task: new models.Task({}),
                role: role,
            }),
        ];

        const newPreloadedState = {
            ...preloadedState,
            taskAssigneesReducer: {
                items: fakeAssignmentsNew,
                ready: true,
                isSynced: true,
            },
        };
        render(
            <RecentlyAssignedUsers
                exclude={[fakeAssignments[0].assignee.id]}
                value={null}
                role={role}
            />,
            {
                preloadedState: newPreloadedState,
            }
        );
        await waitFor(() => {
            expect(screen.queryByText(fakeUserNoRoles.displayName)).toBeNull();
        });
    });

    test("coordinator roleview shows only intersecting assignments", async () => {
        const newPreloadedState = {
            roleView: userRoles.coordinator,
            whoami: { user: fakeCoord1 },
            taskAssigneesReducer: {
                items: [
                    ...fakeAssignmentsRiders,
                    ...fakeAssignmentsFirstCoord,
                    ...fakeAssignmentsSecondCoord,
                ],
                ready: true,
                isSynced: true,
            },
        };
        render(<RecentlyAssignedUsers />, {
            preloadedState: newPreloadedState,
        });
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignmentsRiders[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        for (const assign of fakeAssignmentsRiders.filter((a) =>
            fakeAssignmentsFirstCoord
                .map((a2) => a2.task.id)
                .includes(a.task.id)
        )) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
        for (const assign of fakeAssignmentsRiders.filter((a) =>
            fakeAssignmentsSecondCoord
                .map((a2) => a2.task.id)
                .includes(a.task.id)
        )) {
            expect(screen.queryByText(assign.assignee.displayName)).toBeNull();
        }
    });

    test("exclude users while in coordinator roleview", async () => {
        const newPreloadedState = {
            roleView: userRoles.coordinator,
            whoami: { user: fakeCoord1 },
            taskAssigneesReducer: {
                items: [
                    ...fakeAssignmentsRiders,
                    ...fakeAssignmentsFirstCoord,
                    ...fakeAssignmentsSecondCoord,
                ],
                ready: true,
                isSynced: true,
            },
        };
        render(
            <RecentlyAssignedUsers
                exclude={[fakeAssignmentsRiders[0].assignee.id]}
            />,
            { preloadedState: newPreloadedState }
        );
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignmentsRiders[1].assignee.displayName)
            ).toBeInTheDocument();
        });
        expect(
            screen.queryByText(fakeAssignmentsRiders[0].assignee.displayName)
        ).toBeNull();
    });
});
