import React from "react";
import { v4 as uuidv4 } from "uuid";
import { render } from "../../../test-utils";
import _ from "lodash";
import "intersection-observer";
import ActiveRidersChips from "./ActiveRidersChips";
import * as amplify from "aws-amplify";
import * as models from "../../../models/index";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import { tasksStatus, userRoles } from "../../../apiConsts";
import moment from "moment";

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

const fakeSingleUser = new models.User({
    displayName: faker.name.findName(),
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
        displayName: faker.name.findName(),
    }),
    role: userRoles.rider,
}));

const preloadedState = {
    taskAssigneesReducer: {
        items: fakeAssignments,
        ready: true,
        isSynced: true,
    },
};
describe("ActiveRiderChips", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it("renders", async () => {
        render(<ActiveRidersChips />);
    });

    test("toggle and untoggle All chip", async () => {
        render(<ActiveRidersChips />, { preloadedState });
        await waitFor(() => {
            expect(
                screen.getByText(fakeAssignments[0].assignee.displayName)
            ).toBeInTheDocument();
        });
        const allChip = screen.getByRole("button", {
            name: "All",
        });
        const userChip = screen.getByRole("button", {
            name: fakeAssignments[0].assignee.displayName,
        });
        expect(userChip).toHaveClass("MuiChip-outlinedDefault");
        expect(allChip).not.toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(userChip);
        expect(allChip).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(allChip);
        expect(allChip).not.toHaveClass("MuiChip-outlinedDefault");
    });

    test.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.abandoned} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
    `(
        "don't display riders from completed jobs older than a week",
        async ({ taskStatus }) => {
            const twoWeeksAgo = moment().subtract(2, "week");
            const fakeUser1 = new models.User({
                displayName: uuidv4(),
            });
            const fakeUser2 = new models.User({
                displayName: uuidv4(),
            });
            const oldAssignmentModel = new models.TaskAssignee({
                task: new models.Task({
                    status: taskStatus,
                }),
                assignee: fakeUser1,
                role: userRoles.rider,
            });
            const oldAssignment = {
                ...oldAssignmentModel,
                task: {
                    ...oldAssignmentModel.task,
                    createdAt: twoWeeksAgo.toISOString(),
                },
            };
            const newAssignmentModel = new models.TaskAssignee({
                task: new models.Task({
                    status: taskStatus,
                }),
                assignee: fakeUser2,
                role: userRoles.rider,
            });
            const newAssignment = {
                ...newAssignmentModel,
                task: {
                    ...newAssignmentModel.task,
                    createdAt: moment().toISOString(),
                },
            };
            const newPreloadedState = {
                ...preloadedState,
                dashboardTabIndex: 1,
                taskAssigneesReducer: {
                    ...preloadedState.taskAssigneesReducer,
                    items: [newAssignment, oldAssignment],
                },
            };
            render(<ActiveRidersChips />, {
                preloadedState: newPreloadedState,
            });
            await waitFor(() => {
                expect(
                    screen.getByText(newAssignment.assignee.displayName)
                ).toBeInTheDocument();
            });
            expect(
                screen.queryByText(oldAssignment.assignee.displayName)
            ).toBeNull();
        }
    );

    test.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.abandoned} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.new}       | ${tasksStatus.pickedUp}  | ${tasksStatus.active}   | ${tasksStatus.droppedOff}
    `(
        "only display riders that match the dashboard index",
        async ({ taskStatus }) => {
            const fakeUser1 = new models.User({
                displayName: uuidv4(),
            });
            const fakeUser2 = new models.User({
                displayName: uuidv4(),
            });
            const shownModel = new models.TaskAssignee({
                task: new models.Task({
                    status: taskStatus,
                }),
                assignee: fakeUser1,
                role: userRoles.rider,
            });
            const shown = { ...shownModel, createdAt: moment().toISOString() };
            const status = [
                tasksStatus.rejected,
                tasksStatus.cancelled,
                tasksStatus.completed,
                tasksStatus.abandoned,
            ].includes(taskStatus)
                ? tasksStatus.new
                : tasksStatus.completed;
            const hiddenModel = new models.TaskAssignee({
                task: new models.Task({
                    status,
                }),
                assignee: fakeUser2,
                role: userRoles.rider,
            });
            const hidden = {
                ...hiddenModel,
                createdAt: moment().toISOString(),
            };
            const dashboardTabIndex = [
                tasksStatus.rejected,
                tasksStatus.cancelled,
                tasksStatus.completed,
                tasksStatus.abandoned,
            ].includes(taskStatus)
                ? 1
                : 0;
            const newPreloadedState = {
                ...preloadedState,
                dashboardTabIndex,
                taskAssigneesReducer: {
                    ...preloadedState.taskAssigneesReducer,
                    items: [shown, hidden],
                },
            };
            render(<ActiveRidersChips />, {
                preloadedState: newPreloadedState,
            });
            await waitFor(() => {
                expect(
                    screen.getByText(shown.assignee.displayName)
                ).toBeInTheDocument();
            });
            expect(screen.queryByText(hidden.assignee.displayName)).toBeNull();
        }
    );

    it("displays no riders when in rider mode", async () => {
        const newPreloadedState = {
            ...preloadedState,
            roleView: userRoles.rider,
            whoami: { user: fakeSingleUser },
        };
        render(<ActiveRidersChips />, { preloadedState: newPreloadedState });
        // get all the text elements
        let textElements = [];
        await waitFor(() => {
            textElements = screen.getAllByRole("button");
        });
        expect(textElements).toHaveLength(1);
        expect(textElements[0]).toHaveTextContent("All");
    });

    it("displays the correct riders when in coordinator view", async () => {
        const newPreloadedState = {
            taskAssigneesReducer: {
                ...preloadedState.taskAssigneesReducer,
                items: [
                    ...fakeAssignmentsRiders,
                    ...fakeAssignmentsFirstCoord,
                    ...fakeAssignmentsSecondCoord,
                ],
            },
            roleView: userRoles.coordinator,
            whoami: { user: fakeCoord1 },
        };
        render(<ActiveRidersChips />, { preloadedState: newPreloadedState });
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

    // left here from when chips were for marking riders home but could be useful later
    test.skip("marking a rider as home with some active tasks", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query
            .mockResolvedValueOnce(fakeAssignmentsOneRider)
            .mockResolvedValueOnce(fakeSingleUser)
            .mockResolvedValue(fakeAssignmentsOneRider);
        amplify.DataStore.save.mockResolvedValue(
            new models.Task({
                status: tasksStatus.completed,
                timeRiderHome: new Date().toISOString(),
            })
        );
        render(<ActiveRidersChips />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByText(fakeSingleUser.displayName));
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3);
        });
        expect(screen.getByText(/6 delivered/)).toBeInTheDocument();
        expect(screen.getByText(/4 tasks still active/)).toBeInTheDocument();
        userEvent.click(screen.getByText("OK"));
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(6);
        });
        for (const assign of fakeAssignmentsOneRider.filter(
            (a) => a.task.status === tasksStatus.droppedOff
        )) {
            expect(amplify.DataStore.save).toHaveBeenCalledWith({
                ...assign.task,
                status: tasksStatus.completed,
                timeRiderHome: expect.any(String),
            });
        }
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(4);
        });
        // they should still be displayed as active
        expect(
            screen.getByText(fakeSingleUser.displayName)
        ).toBeInTheDocument();
    });
});
