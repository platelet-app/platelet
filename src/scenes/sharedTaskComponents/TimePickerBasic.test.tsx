import * as React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../test-utils";
import TimePickerBasic from "./TimePickerBasic";

describe("TimePickerBasic", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2021-01-01T12:00:00Z"));
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    test("choose a time from given options", async () => {
        const onChange = jest.fn();
        render(<TimePickerBasic value="" onChange={onChange} />);
        const input = screen.getByRole("textbox");
        userEvent.click(input);
        expect(screen.getAllByRole("option")).toMatchSnapshot();
        userEvent.click(await screen.findByRole("option", { name: "12:00" }));
        expect(onChange).toHaveBeenCalledWith("12:00");
    });
    test("write a time", async () => {
        const onChange = jest.fn();
        render(<TimePickerBasic value="" onChange={onChange} />);
        const input = screen.getByRole("combobox");
        userEvent.type(input, "12:34");
        expect(onChange.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "1",
              ],
              Array [
                "2",
              ],
              Array [
                ":",
              ],
              Array [
                "3",
              ],
              Array [
                "4",
              ],
            ]
        `);
    });
    test("show only today's times", async () => {
        const onChange = jest.fn();
        render(
            <TimePickerBasic showOnlyTodayTimes value="" onChange={onChange} />
        );
        userEvent.click(screen.getByRole("textbox"));
        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: "12:30" })
            ).toBeInTheDocument();
        });
        expect(screen.queryByRole("option", { name: "11:30" })).toBeNull();
        expect(screen.queryByRole("option", { name: "00:00" })).toBeNull();
        expect(
            screen.getByRole("option", { name: "23:30" })
        ).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toMatchSnapshot();
    });
    test("show if invalid time", async () => {
        const onChange = jest.fn();
        render(
            <TimePickerBasic value="" isValid={false} onChange={onChange} />
        );
        expect(screen.getByText("Invalid time")).toBeInTheDocument();
    });
    test("show +1 day", async () => {
        const onChange = jest.fn();
        render(<TimePickerBasic value="" showPlusOneDay onChange={onChange} />);
        expect(screen.getByText("+1 day")).toBeInTheDocument();
    });
    test("set the start time", async () => {
        const onChange = jest.fn();
        render(
            <TimePickerBasic value="" startValue="12:00" onChange={onChange} />
        );
        userEvent.click(screen.getByRole("textbox"));
        await waitFor(() => {
            expect(
                screen.getByRole("option", { name: "12:00" })
            ).toBeInTheDocument();
        });
        const options = screen.getAllByRole("option");
        expect(options).toMatchSnapshot();
    });
});
