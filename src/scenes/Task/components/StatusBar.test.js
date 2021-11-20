import React from "react";
import StatusBar from "./StatusBar";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { tasksStatus } from "../../../apiConsts";
import * as models from "../../../models/index";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import * as amplify from "aws-amplify";

jest.mock("aws-amplify");

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
        const newTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
        });
        const mockDeliverables = [
            {
                unit: "ITEM",
                count: 1,
                orderInGrid: 0,
                id: "fc9b0188-096b-48e9-8e1e-0b21c68e4c13",
                deliverableType: {
                    label: "Equipment",
                    icon: "EQUIPMENT",
                    defaultUnit: "ITEM",
                    id: "9d346ba8-12af-46ed-bb60-e807ff92877b",
                },
            },
            {
                unit: "ITEM",
                count: 2,
                orderInGrid: 0,
                id: "ae768ff7-e655-4bfb-bf01-1485d5be6993",
                deliverableType: {
                    label: "Sample",
                    icon: "BUG",
                    defaultUnit: "ITEM",
                    id: "a25551df-693b-40dd-8522-cbd6f161cba5",
                },
            },
            {
                unit: "LITRE",
                count: 3,
                orderInGrid: 0,
                id: "0aa5c205-1260-4e49-824c-abe3f2d0245d",
                deliverableType: {
                    label: "Milk",
                    icon: "CHILD",
                    defaultUnit: "LITRE",
                    id: "414fc9ff-6448-4f3f-a90e-00a53e7a28e8",
                },
            },
        ];
        amplify.DataStore.query
            .mockResolvedValueOnce(newTask)
            .mockResolvedValue(mockDeliverables);
        render(<StatusBar taskId={newTask.id} />);
        const copyButton = screen.getByRole("button", {
            name: "Copy to clipboard",
        });
        expect(copyButton).toBeInTheDocument();
        jest.spyOn(reactRedux, "useDispatch");
        userEvent.click(copyButton);
        jest.spyOn(utils, "copyTaskDataToClipboard");
        await waitFor(() =>
            expect(utils.copyTaskDataToClipboard).toHaveBeenCalledWith({
                ...newTask,
                deliverables: [],
            })
        );
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
