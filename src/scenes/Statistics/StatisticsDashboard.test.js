import React from "react";
import StatisticsDashboard from "./StatisticsDashboard";
import { render } from "../../test-utils";

describe("StatisticsDashboard", () => {
    it("renders without crashing", () => {
        render(<StatisticsDashboard />);
    });
});
