import React from "react";
import StatusBar from "./StatusBar";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { tasksStatus } from "../../../apiConsts";
import * as models from "../../../models/index";
import userEvent from "@testing-library/user-event";
import { createMatchMedia } from "../../../test-utils";
import { DataStore } from "aws-amplify";

const utils = require("../../../utilities");

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
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("renders correctly", () => {
        render(<StatusBar />);
    });

    it.each`
        status
        ${tasksStatus.completed}
        ${tasksStatus.cancelled}
        ${tasksStatus.pickedUp}
        ${tasksStatus.droppedOff}
        ${tasksStatus.abandoned}
        ${tasksStatus.active}
        ${tasksStatus.new}
        ${tasksStatus.rejected}
    `("renders the correct status", async ({ status }) => {
        const mockTask = await DataStore.save(new models.Task({ status }));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<StatusBar taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        if (status === tasksStatus.droppedOff) status = "DELIVERED";
        else if (status === tasksStatus.pickedUp) status = "PICKED UP";
        expect(screen.getByText(status)).toBeInTheDocument();
    });
    test("click the copy to clipboard button", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
        });
        await DataStore.save(mockTask);
        const mockDeliverableType = new models.DeliverableType({
            label: "test deliverable",
        });
        await DataStore.save(mockDeliverableType);
        const mockDeliverables = [
            {
                unit: "ITEM",
                count: 1,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
            {
                unit: "ITEM",
                count: 2,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
            {
                unit: "LITRE",
                count: 3,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
        ];
        const savedDeliverables = await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<StatusBar taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        jest.spyOn(utils, "copyTaskDataToClipboard");
        await waitFor(() =>
            expect(utils.copyTaskDataToClipboard).toHaveBeenCalledWith({
                ...mockTask,
                deliverables: savedDeliverables,
            })
        );
        expect(await screen.findByText("Copy successful!")).toBeInTheDocument();
    });
    it("fails to copy task data to clipboard", async () => {
        jest.restoreAllMocks();
        render(<StatusBar taskId={"nope"} />);
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        expect(await screen.findByText("Copy failed!")).toBeInTheDocument();
    });
    test("click the close button", async () => {
        const mockClose = jest.fn();
        render(<StatusBar handleClose={mockClose} />);
        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toBeInTheDocument();
        userEvent.click(closeButton);
        expect(mockClose).toHaveBeenCalled();
    });

    test("click the back button on mobile", async () => {
        window.matchMedia = createMatchMedia(240);
        const mockClose = jest.fn();
        render(<StatusBar handleClose={mockClose} />);
        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toBeInTheDocument();
        userEvent.click(closeButton);
        expect(mockClose).toHaveBeenCalled();
    });
});
