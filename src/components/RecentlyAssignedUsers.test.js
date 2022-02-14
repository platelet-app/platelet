import React from "react";
import { render } from "../test-utils";
import * as amplify from "aws-amplify";
import * as models from "../models";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _ from "lodash";
import RecentlyAssignedUsers from "./RecentlyAssignedUsers";
import { tasksStatus, userRoles } from "../apiConsts";
import { v4 as uuidv4 } from "uuid";

jest.mock("aws-amplify");

const preloadedState = {
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
            }),
            role: userRoles.coordinator,
        })
);

const fakeSingleUser = new models.User({
    displayName: uuidv4(),
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

const fakeCoord1 = new models.User({ displayName: "First Coordinator" });
const fakeCoord2 = new models.User({ displayName: "Second Coordinator" });

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
    }),
    role: userRoles.rider,
}));

describe("RecentlyAssignedUsers", () => {
    it("renders without crashing", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(<RecentlyAssignedUsers />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenNthCalledWith(
                1,
                models.TaskAssignee,
                expect.any(Function),
                { limit: 100, sort: expect.any(Function) }
            );
        });
    });

    it("displays recent riders", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(<RecentlyAssignedUsers value={null} role={userRoles.rider} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const assign of fakeAssignments) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
    });

    it("limits display count", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(
            <RecentlyAssignedUsers
                limit={3}
                value={null}
                role={userRoles.rider}
            />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
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
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignmentsCoordinator);
        render(
            <RecentlyAssignedUsers value={null} role={userRoles.coordinator} />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const assign of fakeAssignmentsCoordinator) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
    });

    test("click on a user", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignmentsCoordinator);
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={null}
                role={userRoles.coordinator}
            />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByText(fakeAssignmentsCoordinator[0].assignee.displayName)
        );
        expect(onChange).toHaveBeenCalledWith(
            fakeAssignmentsCoordinator[0].assignee.id
        );
    });

    it("highlights the selected user", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={fakeAssignments[0].assignee.id}
                role={userRoles.rider}
            />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const userChip = screen.getByRole("button", {
            name: fakeAssignments[0].assignee.displayName,
        });
        expect(userChip).toHaveClass("MuiChip-default");
    });

    it("nulls on current selected user click", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        const onChange = jest.fn();
        render(
            <RecentlyAssignedUsers
                onChange={onChange}
                value={fakeAssignments[0].assignee.id}
                role={userRoles.rider}
            />,
            {
                preloadedState,
            }
        );
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(
            screen.getByText(fakeAssignments[0].assignee.displayName)
        );
        expect(onChange).toHaveBeenCalledWith(null);
    });

    test("coordinator roleview shows only intersecting assignments", async () => {
        amplify.DataStore.query
            .mockResolvedValueOnce([...fakeAssignmentsRiders])
            .mockResolvedValue([
                ...fakeAssignmentsSecondCoord,
                ...fakeAssignmentsFirstCoord,
            ]);
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        const preloadedState = {
            roleView: userRoles.coordinator,
            whoami: { user: fakeCoord1 },
        };
        render(<RecentlyAssignedUsers />, { preloadedState });
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
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
});
