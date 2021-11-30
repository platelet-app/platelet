import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import TaskDetailsPanel from "./TaskDetailsPanel";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { priorities } from "../../../apiConsts";
import moment from "moment";

jest.mock("aws-amplify");

jest.mock("../../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

describe("TaskDetailsPanel", () => {
    const isoDate = "2021-11-29T23:24:58.987Z";

    it("renders", async () => {
        amplify.DataStore.query.mockResolvedValue({});
        render(<TaskDetailsPanel taskId={"test"} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
    });
    it("renders task details", async () => {
        const timePickedUp = "2021-11-29T21:24:58.987Z";
        const timeDroppedOff = "2021-11-29T22:24:58.987Z";
        const timeOfCall = isoDate;
        amplify.DataStore.query.mockResolvedValue({
            riderResponsibility: { label: "North" },
            timePickedUp,
            timeDroppedOff,
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        render(<TaskDetailsPanel taskId={"test"} />);
        await waitFor(async () => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("North")).toBeInTheDocument();
        expect(screen.getByText("test-reference")).toBeInTheDocument();
        expect(screen.getByText("Someone Person")).toBeInTheDocument();
        expect(screen.getByText("01234567890")).toBeInTheDocument();
        expect(screen.getByText("HIGH")).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).calendar())
        ).toBeInTheDocument();
        expect(
            screen.getByText(moment(timePickedUp).calendar())
        ).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeDroppedOff).calendar())
        ).toBeInTheDocument();
    });
});
