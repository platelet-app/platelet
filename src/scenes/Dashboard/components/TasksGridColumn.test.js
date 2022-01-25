import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import { priorities, tasksStatus } from "../../../apiConsts";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import { DashboardDetailTabs } from "./DashboardDetailTabs";
import { createMatchMedia } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import * as dashboardUtils from "../utilities/functions";
import { convertListDataToObject } from "../../../utilities";

jest.mock("aws-amplify");

describe("TasksGridColumn", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
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
    it("filters tasks with the search textbox", async () => {
        const filterTaskSpy = jest.spyOn(dashboardUtils, "filterTasks");
        const mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i < 5 ? priorities.medium : priorities.high,
                })
        );
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(
            <>
                <DashboardDetailTabs />
                <TasksGridColumn
                    title={tasksStatus.active}
                    taskKey={[tasksStatus.active]}
                />
            </>
        );
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(12);
        });
        mockAllIsIntersecting(true);
        const searchTerm = "medium";
        userEvent.type(screen.getByRole("textbox"), searchTerm);
        await waitFor(async () => {
            expect(filterTaskSpy).toHaveBeenCalledTimes(3);
            expect(filterTaskSpy).toHaveBeenCalledWith(
                convertListDataToObject(
                    mockTasks.map((t) => ({ ...t, assignees: {} }))
                ),
                searchTerm
            );
        });
        const links = screen.getAllByRole("link");
        const mediumCards = screen.getAllByText("MEDIUM");
        const highCards = screen.getAllByText("HIGH");
        for (const card of mediumCards) {
            expect(card).toBeVisible();
        }
        for (const card of highCards) {
            expect(card).not.toBeVisible();
        }
    });
});
