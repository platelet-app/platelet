import React from "react";
import StatusBar from "./StatusBar";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { tasksStatus } from "../../../apiConsts";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
const utils = require("../../../utilities");
const reactRedux = require("react-redux");

jest.mock("../../../utilities", () => {
    return {
        ...jest.requireActual("../../../utilities"),
        copyTaskDataToClipboard: () =>
            new Promise((resolve, reject) => {
                resolve();
            }),
    };
});

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: () => mockDispatch,
}));

function createMatchMedia(width) {
    return (query) => ({
        matches: mediaQuery.match(query, {
            width,
        }),
        addListener: () => {},
        removeListener: () => {},
    });
}

describe("StatusBar", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
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
        const timeOfCall = new Date().toISOString();
        const newTask = await DataStore.save(
            new models.Task({
                timeOfCall,
                status: tasksStatus.new,
            })
        );
        render(<StatusBar taskId={newTask.id} />);
        const copyButton = screen.getByRole("button", {
            name: "Copy to clipboard",
        });
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        jest.spyOn(utils, "copyTaskDataToClipboard");
        await waitFor(() =>
            expect(utils.copyTaskDataToClipboard).toHaveBeenCalledWith({
                ...newTask,
                deliverables: [],
            })
        );
        jest.spyOn(reactRedux, "useDispatch");
        await waitFor(() =>
            expect(mockDispatch).toHaveBeenCalledWith(
                displayInfoNotification("Copied to clipboard.")
            )
        );
    });
    it("fails to copy task data to clipboard", async () => {
        jest.restoreAllMocks();
        render(<StatusBar taskId={"nope"} />);
        const copyButton = screen.getByRole("button", {
            name: "Copy to clipboard",
        });
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        jest.spyOn(reactRedux, "useDispatch");
        await waitFor(() =>
            expect(mockDispatch).toHaveBeenCalledWith(
                displayErrorNotification("Copy failed.")
            )
        );
    });
    test("click the close button", async () => {
        const mockClose = jest.fn();
        render(<StatusBar handleClose={mockClose} />);
        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toBeInTheDocument();
        userEvent.click(closeButton);
        expect(mockClose).toHaveBeenCalled();
    });
});
