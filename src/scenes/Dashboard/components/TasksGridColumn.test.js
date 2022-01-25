import React from "react";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import TasksGridColumn from "./TasksGridColumn";
import { priorities, tasksStatus, userRoles } from "../../../apiConsts";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";
import _ from "lodash";
import { DashboardDetailTabs } from "./DashboardDetailTabs";
import { createMatchMedia } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import * as dashboardUtils from "../utilities/functions";
import { convertListDataToObject } from "../../../utilities";
import ActiveRidersChips from "./ActiveRidersChips";

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
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
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
        const mediumCards = screen.getAllByText("MEDIUM");
        const highCards = screen.getAllByText("HIGH");
        for (const card of mediumCards) {
            expect(card).toBeVisible();
        }
        for (const card of highCards) {
            expect(card).not.toBeVisible();
        }
    });

    it.only("filters by selected rider chip", async () => {
        let mockTasks = _.range(0, 10).map(
            (i) =>
                new models.Task({
                    status: tasksStatus.new,
                    priority: i < 5 ? priorities.medium : priorities.high,
                })
        );

        mockTasks = mockTasks.map((t) => ({
            ...t,
            createdAt: new Date().toISOString(),
        }));

        const fakeUser1 = new models.User({
            id: "fakeId",
            displayName: "Another Individual",
        });
        const fakeUser2 = new models.User({
            id: "fakeId",
            displayName: "Someone Person",
        });
        const mockAssignments = _.range(0, 10).map(
            (i) =>
                new models.TaskAssignee({
                    task: mockTasks[i],
                    assignee: i % 2 === 0 ? fakeUser1 : fakeUser2,
                    role: userRoles.rider,
                })
        );

        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(
            <>
                <ActiveRidersChips />
                <TasksGridColumn
                    title={tasksStatus.new}
                    taskKey={[tasksStatus.new]}
                />
            </>
        );
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(13);
        });
        mockAllIsIntersecting(true);
        screen.getByText("NEW");
        jest.clearAllMocks();
        amplify.DataStore.query
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockAssignments)
            .mockResolvedValueOnce(mockTasks)
            .mockResolvedValue([]);
        expect(screen.queryAllByText("AI")).toHaveLength(5);
        expect(screen.queryAllByText("SP")).toHaveLength(5);
        userEvent.click(screen.getByText(fakeUser1.displayName));
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(8);
        });
        mockAllIsIntersecting(true);
        const firstFakeUser = screen.getAllByText("AI");
        expect(screen.queryAllByText("SP")).toHaveLength(0);
        for (const card of firstFakeUser) {
            expect(card).toBeVisible();
        }
    });
});
