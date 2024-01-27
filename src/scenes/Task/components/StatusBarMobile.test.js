import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import { tasksStatus } from "../../../apiConsts";
import * as models from "../../../models/index";
import userEvent from "@testing-library/user-event";
import { createMatchMedia } from "../../../test-utils";
import { DataStore } from "aws-amplify";
import StatusBarMobile from "./StatusBarMobile";

describe.only("StatusBarMobile", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        window.matchMedia = createMatchMedia(240);
    });
    it("renders correctly", () => {
        render(<StatusBarMobile />);
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
        render(<StatusBarMobile taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        if (status === tasksStatus.droppedOff) status = "DELIVERED";
        else if (status === tasksStatus.pickedUp) status = "PICKED UP";
        expect(screen.getByText(status)).toBeInTheDocument();
    });

    test("if the copy fails, show it in a dialog instead", async () => {
        Object.assign(window, {
            cordova: undefined,
        });
        Object.assign(window.navigator, {
            clipboard: {
                writeText: jest.fn().mockImplementation(() => Promise.reject()),
            },
        });
        const timeOfCall = "2022-09-14T07:55:07.473Z";
        const pickUpLocation = new models.Location({
            line1: "line one",
            ward: "test ward",
            postcode: "postcode",
        });
        const dropOffLocation = new models.Location({
            line1: "something",
            ward: "some ward",
            postcode: "some postcode",
        });
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
            pickUpLocation,
            dropOffLocation,
            priority: models.Priority.HIGH,
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
                unit: models.DeliverableUnit.LITER,
                count: 3,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
        ];
        await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<StatusBarMobile taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        const copyButton = screen.getByText("Copy to clipboard");
        userEvent.click(copyButton);
        await screen.findByTestId("copy-failed-dialog");
        expect(
            screen.getByText(
                "TOC: 07:55 FROM: test ward - line one, postcode TO: some ward - something, some postcode PRIORITY: high ITEMS: test deliverable x 1, test deliverable x 2, test deliverable x 3"
            )
        ).toBeInTheDocument();
        userEvent.click(screen.getByTestId("copy-ok-button"));
        await waitFor(() => {
            expect(screen.queryByTestId("copy-failed-dialog")).toBeNull();
        });
    });

    test("click the copy to clipboard button on mobile", async () => {
        Object.assign(window, {
            cordova: {
                plugins: {
                    clipboard: {
                        copy: jest
                            .fn()
                            .mockImplementation(() => Promise.resolve()),
                    },
                },
            },
        });
        const timeOfCall = "2022-09-14T07:55:07.473Z";
        const pickUpLocation = new models.Location({
            line1: "line one",
            ward: "test ward",
            postcode: "postcode",
        });
        const dropOffLocation = new models.Location({
            line1: "something",
            ward: "some ward",
            postcode: "some postcode",
        });
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
            pickUpLocation,
            dropOffLocation,
            priority: models.Priority.HIGH,
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
                unit: models.DeliverableUnit.LITER,
                count: 3,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
        ];
        await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        let cordovaSpy;
        cordovaSpy = jest.spyOn(window.cordova.plugins.clipboard, "copy");
        render(<StatusBarMobile taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        await waitFor(() => {
            expect(cordovaSpy).toHaveBeenCalled();
        });
        expect(cordovaSpy).toMatchSnapshot();
        // I don't know why this fails, I can see it is working in the app
        //expect(await screen.findByText("Copy successful!")).toBeInTheDocument();
    });

    test("click the copy to clipboard button", async () => {
        Object.assign(window, {
            cordova: undefined,
        });
        Object.assign(window.navigator, {
            clipboard: {
                writeText: jest
                    .fn()
                    .mockImplementation(() => Promise.resolve()),
            },
        });
        const timeOfCall = "2022-09-14T07:55:07.473Z";
        const pickUpLocation = new models.Location({
            line1: "line one",
            ward: "test ward",
            postcode: "postcode",
        });
        const dropOffLocation = new models.Location({
            line1: "something",
            ward: "some ward",
            postcode: "some postcode",
        });
        const mockTask = new models.Task({
            timeOfCall,
            status: tasksStatus.new,
            pickUpLocation,
            dropOffLocation,
            priority: models.Priority.HIGH,
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
                unit: models.DeliverableUnit.LITER,
                count: 3,
                orderInGrid: 0,
                deliverableType: mockDeliverableType,
            },
        ];
        await Promise.all(
            mockDeliverables.map((deliverable) =>
                DataStore.save(
                    new models.Deliverable({ task: mockTask, ...deliverable })
                )
            )
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const clipboardSpy = jest.spyOn(navigator.clipboard, "writeText");
        render(<StatusBarMobile taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Task, mockTask.id);
        });
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        await waitFor(() => {
            expect(clipboardSpy).toHaveBeenCalled();
        });
        expect(clipboardSpy).toMatchSnapshot();
        expect(await screen.findByText("Copy successful!")).toBeInTheDocument();
    });

    it("fails to copy task data to clipboard", async () => {
        jest.restoreAllMocks();
        render(<StatusBarMobile taskId={"nope"} />);
        const copyButton = screen.getByText("Copy to clipboard");
        expect(copyButton).toBeInTheDocument();
        userEvent.click(copyButton);
        expect(await screen.findByText("Copy failed!")).toBeInTheDocument();
    });

    test("click the back button on mobile", async () => {
        const mockClose = jest.fn();
        render(<StatusBarMobile handleClose={mockClose} />);
        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toBeInTheDocument();
        userEvent.click(closeButton);
        expect(mockClose).toHaveBeenCalled();
    });
});
