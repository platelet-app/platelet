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
        await waitFor(async () => {
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
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        for (const assign of fakeAssignments.filter((a) =>
            [
                tasksStatus.cancelled,
                tasksStatus.rejected,
                tasksStatus.completed,
            ].includes(a.task.status)
        )) {
            expect(screen.queryByText(assign.assignee.displayName)).toBeNull();
        }
        for (const assign of fakeAssignments.filter((a) =>
            [
                tasksStatus.new,
                tasksStatus.active,
                tasksStatus.pickedUp,
            ].includes(a.task.status)
        )) {
            expect(
                screen.getByText(assign.assignee.displayName)
            ).toBeInTheDocument();
        }
    });

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
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByText(fakeSingleUser.displayName));
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(3);
        });
        expect(screen.getByText(/6 delivered/)).toBeInTheDocument();
        expect(screen.getByText(/4 tasks still active/)).toBeInTheDocument();
        userEvent.click(screen.getByText("OK"));
        await waitFor(async () => {
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
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(4);
        });
        // they should still be displayed as active
        expect(
            screen.getByText(fakeSingleUser.displayName)
        ).toBeInTheDocument();
    });
});
