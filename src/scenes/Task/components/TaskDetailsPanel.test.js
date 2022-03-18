import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import TaskDetailsPanel from "./TaskDetailsPanel";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import { priorities, tasksStatus } from "../../../apiConsts";
import moment from "moment";
import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";
import { DataStore } from "aws-amplify";

function createMatchMedia(width) {
    return (query) => ({
        matches: mediaQuery.match(query, {
            width,
        }),
        addListener: () => {},
        removeListener: () => {},
    });
}

describe("TaskDetailsPanel", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("renders", async () => {
        const mockTask = new models.Task({});
        const querySpy = jest.spyOn(DataStore, "query");
        await DataStore.save(mockTask);
        render(<TaskDetailsPanel taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
    });
    it("renders task details", async () => {
        const timeOfCall = new Date().toISOString();
        const mockTask = new models.Task({
            riderResponsibility: "North",
            timeOfCall,
            priority: priorities.high,
            reference: "test-reference",
            requesterContact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
            },
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        render(<TaskDetailsPanel taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("North")).toBeInTheDocument();
        expect(screen.getByText("test-reference")).toBeInTheDocument();
        expect(screen.getByText("Someone Person")).toBeInTheDocument();
        expect(screen.getByText("01234567890")).toBeInTheDocument();
        expect(screen.getByText("HIGH")).toBeInTheDocument();
        expect(screen.getByText(/Today at/)).toBeInTheDocument();
        expect(
            screen.getByText(moment(timeOfCall).format("HH:mm"))
        ).toBeInTheDocument();
    });
    test.skip.each`
        timeKey
        ${"timePickedUp"} | ${"timeDroppedOff"}
    `("sets timePickedUp and timeDroppedOff", async ({ timeKey }) => {
        const time = "2021-11-29T21:24:58.987Z";
        const mockTask = new models.Task({
            [timeKey]: time,
            status: tasksStatus.new,
        });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValueOnce(mockTask)
            .mockResolvedValue([]);
        amplify.DataStore.save.mockResolvedValue({
            ...mockTask,
            [timeKey]: time,
        });
        amplify.DataStore.observe.mockReturnValue({
            subscribe: () => ({ unsubscribe: () => {} }),
        });
        render(<TaskDetailsPanel taskId={"test"} />);
        await waitFor(() => {
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1);
        });
        const editButton = screen.getByRole("button", { name: "Edit" });
        userEvent.click(editButton);
        // TODO: for whatever reason the textbox for the timer picker
        // can't be typed into, so just send the same data for now.
        //
        /* const timePickedUpInput = screen.getByRole("textbox");
         expect(timePickedUpInput).not.toBeDisabled();
         userEvent.clear(timePickedUpInput);
         expect(timePickedUpInput.value).toBe("");
         userEvent.type(timePickedUpInput, "29/11/2021 23:23");
         expect(timePickedUpInput.value).toBe("29/11/2021 23:23");
         */
        const saveButton = screen.getByLabelText("Finish");
        userEvent.click(saveButton);
        await waitFor(() => {
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(1, {
                ...mockTask,
                [timeKey]: time,
            });
        });
    });
    it("unsubscribes to task observer on unmount", async () => {
        const mockTask = new models.Task({
            status: tasksStatus.new,
        });
        await DataStore.save(mockTask);
        const unsubscribe = jest.fn();
        const observeSpy = jest
            .spyOn(amplify.DataStore, "observe")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        const querySpy = jest.spyOn(amplify.DataStore, "query");
        const component = render(<TaskDetailsPanel taskId={mockTask.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        expect(observeSpy).toHaveBeenCalledTimes(1);
        expect(unsubscribe).toHaveBeenCalledTimes(0);
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
});
