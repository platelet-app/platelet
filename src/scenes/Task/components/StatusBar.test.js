import React from "react";
import StatusBar from "./StatusBar";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { tasksStatus } from "../../../apiConsts";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import userEvent from "@testing-library/user-event";
const utils = require("../../../utilities");
const flushPromises = () => new Promise(setImmediate);

jest.mock("../../../utilities", () => {
    return {
        ...jest.requireActual("../../../utilities"),
        copyTaskDataToClipboard: () =>
            new Promise((resolve, reject) => {
                resolve();
            }),
    };
});

describe("StatusBar", () => {
    it("renders correctly", () => {
        render(<StatusBar />);
    });
    it("renders with the NEW status", () => {
        render(<StatusBar status={tasksStatus.new} />);
        expect(screen.getByText(/New/)).toBeInTheDocument();
    });
    it("renders with the ACTIVE status", () => {
        render(<StatusBar status={tasksStatus.active} />);
        expect(screen.getByText(/Active/)).toBeInTheDocument();
    });
    it("renders with the PICKED_UP status", () => {
        render(<StatusBar status={tasksStatus.pickedUp} />);
        expect(screen.getByText(/Picked up/)).toBeInTheDocument();
    });
    it("renders with the CANCELLED status", () => {
        render(<StatusBar status={tasksStatus.cancelled} />);
        expect(screen.getByText(/Cancelled/)).toBeInTheDocument();
    });
    it("renders with the REJECTED status", () => {
        render(<StatusBar status={tasksStatus.rejected} />);
        expect(screen.getByText(/Rejected/)).toBeInTheDocument();
    });
    it("renders with the DROPPED_OFF status", () => {
        render(<StatusBar status={tasksStatus.droppedOff} />);
        expect(screen.getByText(/Delivered/)).toBeInTheDocument();
    });
    test("click the copy to clipboard button", async () => {
        const newTask = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
            })
        );
        render(<StatusBar taskId={newTask.id} />);
        const copyButton = screen.getByRole("button");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        jest.spyOn(utils, "copyTaskDataToClipboard");
        await waitFor(() =>
            expect(utils.copyTaskDataToClipboard).toHaveBeenCalled()
        );
    });
});
