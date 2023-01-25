import React from "react";
import { v4 as uuidv4 } from "uuid";
import { render } from "../../../test-utils";
import _ from "lodash";
import "intersection-observer";
import ActiveRidersChips from "./ActiveRidersChips";
import * as amplify from "aws-amplify";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import moment from "moment";

const fakeAssignments = Object.values(models.TaskStatus)
    .filter((s) => s !== models.TaskStatus.NEW)
    .map(
        (status) =>
            new models.TaskAssignee({
                task: new models.Task({
                    status,
                }),
                assignee: new models.User({
                    displayName: uuidv4(),
                }),
                role: models.Role.RIDER,
            })
    );

const fakeSingleUser = new models.User({
    displayName: faker.name.findName(),
});

const fakeAssignmentsOneRider = _.range(0, 10).map(
    (i) =>
        new models.TaskAssignee({
            task: new models.Task({
                status:
                    i > 3
                        ? models.TaskStatus.DROPPED_OFF
                        : models.TaskStatus.ACTIVE,
            }),
            assignee: fakeSingleUser,
            role: models.Role.RIDER,
        })
);

const fakeCoord1 = new models.User({ displayName: "First Coordinator" });
const fakeCoord2 = new models.User({ displayName: "Second Coordinator" });

const fakeAssignmentsFirstCoord = _.range(0, 5).map(
    (i) =>
        new models.TaskAssignee({
            task: new models.Task({
                status: models.TaskStatus.ACTIVE,
            }),
            assignee: fakeCoord1,
            role: models.Role.COORDINATOR,
        })
);
const fakeAssignmentsSecondCoord = _.range(0, 5).map(
    (i) =>
        new models.TaskAssignee({
            task: new models.Task({
                status: models.TaskStatus.ACTIVE,
            }),
            assignee: fakeCoord2,
            role: models.Role.COORDINATOR,
        })
);
const fakeAssignmentsRiders = [
    ...fakeAssignmentsFirstCoord,
    ...fakeAssignmentsSecondCoord,
].map(async (assignment) => {
    const assignee = await amplify.DataStore.save(
        new models.User({
            displayName: faker.name.findName(),
        })
    );
    new models.TaskAssignee({
        task: assignment.task,
        assignee,
        role: models.Role.RIDER,
    });
});

const everything = [
    fakeCoord1,
    fakeCoord2,
    fakeSingleUser,
    ...fakeAssignments,
    ...fakeAssignmentsOneRider,
    ...fakeAssignmentsRiders,
];

const preloadedState = {
    taskAssigneesReducer: {
        items: fakeAssignments,
        ready: true,
        isSynced: true,
    },
};
describe("ActiveRiderChips", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        await amplify.DataStore.clear();
    });

    it("renders", async () => {
        render(<ActiveRidersChips />);
    });

    test("toggle and untoggle All chip", async () => {
        const task = await DataStore.save(
            new models.Task({
                status: models.TaskStatus.ACTIVE,
            })
        );
        const assignee = await DataStore.save(
            new models.User({
                displayName: "someone",
            })
        );
        await DataStore.save(
            new models.TaskAssignee({
                task,
                assignee,
                role: models.Role.RIDER,
            })
        );
        render(<ActiveRidersChips />);
        await waitFor(() => {
            expect(screen.getByText(assignee.displayName)).toBeInTheDocument();
        });
        const allChip = screen.getByRole("button", {
            name: "All",
        });
        const userChip = screen.getByRole("button", {
            name: assignee.displayName,
        });
        expect(userChip).toHaveClass("MuiChip-outlinedDefault");
        expect(allChip).not.toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(userChip);
        expect(allChip).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(allChip);
        expect(allChip).not.toHaveClass("MuiChip-outlinedDefault");
    });

    // since moving to observeQuery instead of reducer, createdAt is always undefined
    // so skip for now
    test.skip.each`
        taskStatus
        ${models.TaskStatus.COMPLETED} | ${models.TaskStatus.ABANDONED} | ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
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
                role: models.Role.RIDER,
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
                role: models.Role.RIDER,
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
        ${models.TaskStatus.COMPLETED} | ${models.TaskStatus.ABANDONED} | ${models.TaskStatus.REJECTED} | ${models.TaskStatus.CANCELLED}
        ${models.TaskStatus.NEW}       | ${models.TaskStatus.PICKED_UP} | ${models.TaskStatus.ACTIVE}   | ${models.TaskStatus.DROPPED_OFF}
    `(
        "only display riders that match the dashboard index",
        async ({ taskStatus }) => {
            const fakeUser1 = await DataStore.save(
                new models.User({
                    displayName: uuidv4(),
                })
            );
            const fakeUser2 = await DataStore.save(
                new models.User({
                    displayName: uuidv4(),
                })
            );
            const task = await DataStore.save(
                new models.Task({
                    status: taskStatus,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task,
                    assignee: fakeUser1,
                    role: models.Role.RIDER,
                })
            );
            const status = [
                models.TaskStatus.REJECTED,
                models.TaskStatus.CANCELLED,
                models.TaskStatus.COMPLETED,
                models.TaskStatus.ABANDONED,
            ].includes(taskStatus)
                ? models.TaskStatus.NEW
                : models.TaskStatus.COMPLETED;
            const task2 = await DataStore.save(
                new models.Task({
                    status,
                })
            );
            await DataStore.save(
                new models.TaskAssignee({
                    task: task2,
                    assignee: fakeUser2,
                    role: models.Role.RIDER,
                })
            );
            const dashboardTabIndex = [
                models.TaskStatus.REJECTED,
                models.TaskStatus.CANCELLED,
                models.TaskStatus.COMPLETED,
                models.TaskStatus.ABANDONED,
            ].includes(taskStatus)
                ? 1
                : 0;
            const newPreloadedState = {
                dashboardTabIndex,
            };
            render(<ActiveRidersChips />, {
                preloadedState: newPreloadedState,
            });
            await waitFor(() => {
                expect(
                    screen.getByText(fakeUser1.displayName)
                ).toBeInTheDocument();
            });
            expect(screen.queryByText(fakeUser2.displayName)).toBeNull();
        }
    );

    it("displays no riders when in rider mode", async () => {
        const newPreloadedState = {
            roleView: models.Role.RIDER,
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
        const fakeCoord1 = await DataStore.save(
            new models.User({ displayName: "First Coordinator" })
        );
        const fakeCoord2 = await DataStore.save(
            new models.User({ displayName: "Second Coordinator" })
        );

        const fakeAssignmentsFirstCoord = await Promise.all(
            _.range(0, 5).map(async (i) => {
                const task = await DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.ACTIVE,
                        priority: models.Priority.LOW,
                    })
                );
                return await DataStore.save(
                    new models.TaskAssignee({
                        task,
                        assignee: fakeCoord1,
                        role: models.Role.COORDINATOR,
                    })
                );
            })
        );
        const fakeAssignmentsSecondCoord = await Promise.all(
            _.range(0, 5).map(async (i) => {
                const task = await DataStore.save(
                    new models.Task({
                        status: models.TaskStatus.ACTIVE,
                        priority: models.Priority.HIGH,
                    })
                );
                return await DataStore.save(
                    new models.TaskAssignee({
                        task,
                        assignee: fakeCoord2,
                        role: models.Role.COORDINATOR,
                    })
                );
            })
        );
        const fakeAssignmentsRiders = await Promise.all(
            [...fakeAssignmentsFirstCoord, ...fakeAssignmentsSecondCoord].map(
                async (assignment) => {
                    const assignee = await amplify.DataStore.save(
                        new models.User({
                            displayName: faker.name.findName(),
                        })
                    );
                    const task = await assignment.task;
                    return await DataStore.save(
                        new models.TaskAssignee({
                            task,
                            assignee,
                            role: models.Role.RIDER,
                        })
                    );
                }
            )
        );

        const newPreloadedState = {
            roleView: models.Role.COORDINATOR,
            whoami: { user: fakeCoord1 },
        };
        render(<ActiveRidersChips />, { preloadedState: newPreloadedState });
        const rider = await fakeAssignmentsRiders[0].assignee;
        await waitFor(() => {
            expect(screen.getByText(rider.displayName)).toBeInTheDocument();
        });
        const fakeAssignmentsRidersResolved = await Promise.all(
            fakeAssignmentsRiders.map(async (assignment) => {
                const task = await assignment.task;
                const assignee = await assignment.assignee;
                return { ...assignment, task, assignee };
            })
        );
        const fakeAssignmentsFirstCoordResolved = await Promise.all(
            fakeAssignmentsFirstCoord.map(async (assignment) => {
                const task = await assignment.task;
                return { ...assignment, task };
            })
        );
        const fakeAssignmentsSecondCoordResolved = await Promise.all(
            fakeAssignmentsSecondCoord.map(async (assignment) => {
                const task = await assignment.task;
                return { ...assignment, task };
            })
        );
        for (const assign of fakeAssignmentsRidersResolved.filter((a) =>
            fakeAssignmentsFirstCoordResolved
                .map((a2) => a2.task.id)
                .includes(a.task.id)
        )) {
            //console.log(assign.task);
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }

        const filteredSecond = fakeAssignmentsRidersResolved.filter((a) =>
            fakeAssignmentsSecondCoordResolved
                .map((a2) => a2.task.id)
                .includes(a.task.id)
        );
        await waitFor(
            () => {
                expect(
                    screen.queryByText(filteredSecond[0].assignee.displayName)
                ).toBeNull();
            },
            { timeout: 3000 }
        );
        for (const assign of filteredSecond) {
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
                status: models.TaskStatus.COMPLETED,
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
            (a) => a.task.status === models.TaskStatus.DROPPED_OFF
        )) {
            expect(amplify.DataStore.save).toHaveBeenCalledWith({
                ...assign.task,
                status: models.TaskStatus.COMPLETED,
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
