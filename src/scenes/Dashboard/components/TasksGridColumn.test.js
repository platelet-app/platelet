import React from "react";
import { render, screen } from "../../../test-utils";
import TasksGridColumn from "./TasksGridColumn";
import { priorities, tasksStatus } from "../../../apiConsts";
import * as amplify from "aws-amplify";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/dom";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";

jest.mock("aws-amplify");

const mockTasks = [
    {
        id: "test1",
        status: tasksStatus.NEW,
        createdAt: "2020-01-01T00:00:00.000Z",
        updatedAt: "2020-01-01T00:00:00.000Z",
        pickUpLocation: {
            id: "testLoc1",
            line1: "123 Fake Street",
            ward: "Fake Ward",
            createdAt: "2020-01-01T00:00:00.000Z",
            updatedAt: "2020-01-01T00:00:00.000Z",
        },
        dropOffLocation: {
            id: "testLoc2",
            line1: "321 Not Fake Street",
            ward: "Second Ward",
            createdAt: "2020-01-01T00:00:00.000Z",
            updatedAt: "2020-01-01T00:00:00.000Z",
        },
        riderResponsibility: { label: "Test Responsibility" },
        priority: priorities.medium,
        timeOfCall: "2020-01-01T00:00:00.000Z",
    },
];

describe("TasksGridColumn", () => {
    it("renders without crashing", () => {
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValue(mockTasks);
        render(<TasksGridColumn taskKey={[tasksStatus.new]} />);
    });
    it("renders the correct number of tasks", async () => {
        amplify.DataStore.query
            .mockResolvedValueOnce([])
            .mockResolvedValue(mockTasks);
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(
            <TasksGridColumn
                title={tasksStatus.new}
                taskKey={[tasksStatus.new]}
            />
        );
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        mockAllIsIntersecting(true);
        expect(screen.getByText(tasksStatus.new)).toBeInTheDocument();
        expect(await screen.findByText(priorities.medium)).toBeInTheDocument();
    });
});
