import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import { priorities, tasksStatus } from "../../../apiConsts";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";

jest.mock("aws-amplify");

describe("TasksGridColumn", () => {
    it("renders without crashing", async () => {
        amplify.DataStore.query.mockResolvedValueOnce([]).mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2);
        });
    });

    it.each`
        taskStatus
        ${tasksStatus.completed} | ${tasksStatus.droppedOff} | ${tasksStatus.rejected} | ${tasksStatus.cancelled}
        ${tasksStatus.active}    | ${tasksStatus.pickedUp}
    `("renders the tasks for each status", async ({ taskStatus }) => {
        const mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: taskStatus,
                    priority: priorities.medium,
                })
        );
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TasksGridColumn title={taskStatus} taskKey={[taskStatus]} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(12);
        });
        mockAllIsIntersecting(true);
        expect(screen.getByText(taskStatus)).toBeInTheDocument();
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(10);
        for (const link of links) {
            expect(link.firstChild.className).toMatch(
                new RegExp(`makeStyles-${taskStatus}`)
            );
        }
    });
});
