import React from "react";

import { render } from "../../../test-utils";

import TasksGridColumn from "./TasksGridColumn";

describe("TasksGridColumn", () => {
    it("renders without crashing", () => {
        render(<TasksGridColumn />);
    });
});
