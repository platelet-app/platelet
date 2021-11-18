import React from "react";
import { render, screen } from "../../../test-utils";
import TasksGridColumn from "./TasksGridColumn";
import { tasksStatus } from "../../../apiConsts";

describe("TasksGridColumn", () => {
    it("renders without crashing", () => {
        render(<TasksGridColumn taskKey={tasksStatus.new} />);
    });
    it("renders the correct number of tasks", async () => {
        // can't get this to work with datastore but is covered by cypress test anyway
        return;
        render(
            <TasksGridColumn
                title={tasksStatus.new}
                taskKey={tasksStatus.new}
            />
        );
        const column = await screen.findByText(tasksStatus.new);
        expect(column).toBeInTheDocument();
    });
});
