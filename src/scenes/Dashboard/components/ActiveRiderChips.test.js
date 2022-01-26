import React from "react";
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

jest.mock("aws-amplify");

const fakeAssignments = Object.values(tasksStatus)
    .filter((s) => s !== tasksStatus.new)
    .map(
        (status) =>
            new models.TaskAssignee({
                task: new models.Task({
                    status,
                }),
                assignee: new models.User({
                    displayName: faker.name.findName(),
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

describe("ActiveRiderChips", () => {
    it("renders", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(<ActiveRidersChips />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });

    it("displays the correct users", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(<ActiveRidersChips />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const assign of fakeAssignments) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
    });

    test("toggle and untoggle All chip", async () => {
        const unsubscribe = jest.fn();
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe }),
        });
        amplify.DataStore.query.mockResolvedValue(fakeAssignments);
        render(<ActiveRidersChips />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
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
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}
    `(
        "don't display riders from completed jobs older than a week",
        async ({ taskStatus }) => {
            const unsubscribe = jest.fn();
            amplify.DataStore.observe.mockReturnValue({
                subscribe: () => ({ unsubscribe }),
            });
            const oldAssignmentModel = new models.TaskAssignee({
                task: new models.Task({
                    status: taskStatus,
                }),
                assignee: fakeSingleUser,
                role: userRoles.rider,
            });
            const oldAssignment = {
                ...oldAssignmentModel,
                task: {
                    ...oldAssignmentModel.task,
                    createdAt: new Date(
                        Date.now() - 1000 * 60 * 60 * 24 * 8
                    ).toISOString(),
                },
            };
            amplify.DataStore.query.mockResolvedValue([
                ...fakeAssignments,
                oldAssignment,
            ]);
            render(<ActiveRidersChips />);
            await waitFor(() => {
                expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
            });
            for (const assign of fakeAssignments) {
                expect(
                    screen.getByText(assign.assignee.displayName)
                ).toBeInTheDocument();
            }
            if (
                [tasksStatus.active, tasksStatus.pickedUp].includes(taskStatus)
            ) {
                expect(
                    screen.queryByText(oldAssignment.assignee.displayName)
                ).toBeInTheDocument();
            } else {
                expect(
                    screen.queryByText(oldAssignment.assignee.displayName)
                ).toBeNull();
            }
        }
    );

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
