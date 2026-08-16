import * as React from "react";
import { render, screen, waitFor } from "../../../test-utils";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models";
import { TaskScheduleDetails } from "./TaskScheduleDetails";

describe("TaskScheduleDetails", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2021-01-01T12:00:00Z"));
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test("display the schedule", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-01T10:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                schedule={schedule}
                onClear={jest.fn()}
                onChange={jest.fn()}
            />
        );
        expect(screen.getByText("Today at any time")).toBeInTheDocument();
    });
    test("don't show edit controls when canEdit is false", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-01T10:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                schedule={schedule}
                onClear={jest.fn()}
                onChange={jest.fn()}
            />
        );
        expect(screen.queryByTestId("ClearIcon")).toBeNull();
        expect(screen.queryByTestId("EditIcon")).toBeNull();
    });
    test("show edit controls when canEdit is true", () => {
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-01T10:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                canEdit
                schedule={schedule}
                onClear={jest.fn()}
                onChange={jest.fn()}
            />
        );
        expect(screen.getByTestId("ClearIcon")).toBeInTheDocument();
        expect(screen.getByTestId("EditIcon")).toBeInTheDocument();
    });
    test("show nothing when there is no schedule and canEdit is false", () => {
        render(
            <TaskScheduleDetails
                schedule={null}
                onClear={jest.fn()}
                onChange={jest.fn()}
            />
        );
        expect(screen.queryByText("No schedule set")).toBeNull();
        expect(screen.queryByRole("button")).toBeNull();
    });
    test("show the add schedule button when there is no schedule", () => {
        render(
            <TaskScheduleDetails
                canEdit
                schedule={null}
                onClear={jest.fn()}
                onChange={jest.fn()}
            />
        );
        expect(screen.getByText("No schedule set")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Add schedule" })
        ).toBeInTheDocument();
    });
    test("clear the schedule", async () => {
        const onClear = jest.fn();
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-01T10:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                canEdit
                schedule={schedule}
                onClear={onClear}
                onChange={jest.fn()}
            />
        );
        userEvent.click(screen.getByTestId("ClearIcon"));
        expect(
            screen.getByText("Are you sure you want to clear the schedule?")
        ).toBeInTheDocument();
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(onClear).toHaveBeenCalled();
    });
    test("cancel clearing the schedule", async () => {
        const onClear = jest.fn();
        const schedule = new models.Schedule({
            relation: models.TimeRelation.ANYTIME,
            timePrimary: "2021-01-01T10:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                canEdit
                schedule={schedule}
                onClear={onClear}
                onChange={jest.fn()}
            />
        );
        userEvent.click(screen.getByTestId("ClearIcon"));
        userEvent.click(screen.getByTestId("confirmation-cancel-button"));
        expect(onClear).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(
                screen.queryByText(
                    "Are you sure you want to clear the schedule?"
                )
            ).toBeNull();
        });
    });
    test("edit the schedule time", async () => {
        const onChange = jest.fn();
        const schedule = new models.Schedule({
            relation: models.TimeRelation.AT,
            timePrimary: "2021-01-01T14:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                canEdit
                schedule={schedule}
                onClear={jest.fn()}
                onChange={onChange}
            />
        );
        userEvent.click(screen.getByTestId("EditIcon"));
        expect(screen.getByText("Edit schedule")).toBeInTheDocument();
        expect(screen.getByDisplayValue("01/01/2021")).toBeInTheDocument();
        const timeInput = screen.getByLabelText("Time");
        expect(timeInput).toHaveValue("14:00");
        userEvent.clear(timeInput);
        userEvent.type(timeInput, "15:30");
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(onChange).toHaveBeenCalledWith(
            new models.Schedule({
                relation: models.TimeRelation.AT,
                timePrimary: "2021-01-01T15:30:00.000Z",
                timeSecondary: null,
            })
        );
        await waitFor(() => {
            expect(screen.queryByText("Edit schedule")).toBeNull();
        });
    });
    test("change the relation to between and set a second time", async () => {
        const onChange = jest.fn();
        const schedule = new models.Schedule({
            relation: models.TimeRelation.AT,
            timePrimary: "2021-01-01T14:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                canEdit
                schedule={schedule}
                onClear={jest.fn()}
                onChange={onChange}
            />
        );
        userEvent.click(screen.getByTestId("EditIcon"));
        userEvent.click(screen.getByRole("button", { name: "AT" }));
        userEvent.click(screen.getByRole("option", { name: "BETWEEN" }));
        // the end time defaults to half an hour after the primary time
        const secondTimeInput = screen.getByLabelText("End time");
        expect(secondTimeInput).toHaveValue("14:30");
        userEvent.clear(secondTimeInput);
        userEvent.type(secondTimeInput, "16:00");
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(onChange).toHaveBeenCalledWith(
            new models.Schedule({
                relation: models.TimeRelation.BETWEEN,
                timePrimary: "2021-01-01T14:00:00.000Z",
                timeSecondary: "2021-01-01T16:00:00.000Z",
            })
        );
    });
    test("add a new schedule", async () => {
        const onChange = jest.fn();
        render(
            <TaskScheduleDetails
                canEdit
                schedule={null}
                onClear={jest.fn()}
                onChange={onChange}
            />
        );
        userEvent.click(screen.getByRole("button", { name: "Add schedule" }));
        expect(screen.getByText("Edit schedule")).toBeInTheDocument();
        // defaults to today's date with the ANYTIME relation
        expect(screen.getByDisplayValue("01/01/2021")).toBeInTheDocument();
        expect(screen.getByText("ANYTIME")).toBeInTheDocument();
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(onChange).toHaveBeenCalledWith(
            new models.Schedule({
                relation: models.TimeRelation.ANYTIME,
                timePrimary: "2021-01-01T12:30:00.000Z",
                timeSecondary: null,
            })
        );
    });
    test("add a new schedule with the date hidden", async () => {
        const onChange = jest.fn();
        render(
            <TaskScheduleDetails
                canEdit
                hideDate
                schedule={null}
                onClear={jest.fn()}
                onChange={onChange}
            />
        );
        userEvent.click(screen.getByRole("button", { name: "Add schedule" }));
        // no date picker and no time inputs for the ANYTIME relation
        expect(screen.queryByRole("textbox")).toBeNull();
        userEvent.click(screen.getByTestId("confirmation-ok-button"));
        expect(onChange).toHaveBeenCalledWith(
            new models.Schedule({
                relation: models.TimeRelation.ANYTIME,
                timePrimary: "2099-01-01T12:30:00.000Z",
                timeSecondary: null,
            })
        );
    });
    test("cancel editing the schedule", async () => {
        const onChange = jest.fn();
        const schedule = new models.Schedule({
            relation: models.TimeRelation.AT,
            timePrimary: "2021-01-01T14:00:00.000Z",
            timeSecondary: null,
        });
        render(
            <TaskScheduleDetails
                canEdit
                schedule={schedule}
                onClear={jest.fn()}
                onChange={onChange}
            />
        );
        userEvent.click(screen.getByTestId("EditIcon"));
        userEvent.click(screen.getByTestId("confirmation-cancel-button"));
        expect(onChange).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.queryByText("Edit schedule")).toBeNull();
        });
    });
});
