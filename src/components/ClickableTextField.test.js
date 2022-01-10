import React from "react";
import ClickableTextField from "./ClickableTextField";
import { render } from "../test-utils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ClickableTextField", () => {
    it("renders correctly", () => {
        render(<ClickableTextField />);
    });

    it("displays a value", () => {
        render(<ClickableTextField value={"test value"} />);
        expect(screen.getByText("test value")).toBeInTheDocument();
    });

    it("displays a label", () => {
        render(<ClickableTextField label={"test label"} />);
        expect(screen.getByText("test label")).toBeInTheDocument();
    });

    test("clicking the text field to enable edit mode", () => {
        render(<ClickableTextField />);
        const clickableField = screen.getByText("Click to edit");
        expect(clickableField).toBeInTheDocument();
        userEvent.click(clickableField);
        const textField = screen.getByRole("textbox");
        expect(textField).toBeInTheDocument();
    });

    test("enter text with enter", () => {
        const mockOnFinishFunction = jest.fn();
        const mockOnChangeFunction = jest.fn();
        render(
            <ClickableTextField
                onChange={mockOnChangeFunction}
                onFinished={mockOnFinishFunction}
            />
        );
        const clickableField = screen.getByText("Click to edit");
        expect(clickableField).toBeInTheDocument();
        userEvent.click(clickableField);
        const textField = screen.getByRole("textbox");
        expect(textField).toBeInTheDocument();
        userEvent.type(textField, "test text");
        expect(textField).toHaveValue("test text");
        userEvent.type(textField, "{enter}");
        expect(textField).not.toBeInTheDocument();
        expect(mockOnFinishFunction).toHaveBeenCalledWith("test text");
        expect(mockOnChangeFunction).toHaveBeenCalledTimes(9);
        const result = screen.getByText("test text");
        expect(result).toBeInTheDocument();
    });

    test("enter text with onblur", () => {
        const mockOnFinishFunction = jest.fn();
        const mockOnChangeFunction = jest.fn();
        render(
            <ClickableTextField
                onChange={mockOnChangeFunction}
                onFinished={mockOnFinishFunction}
            />
        );
        const clickableField = screen.getByText("Click to edit");
        expect(clickableField).toBeInTheDocument();
        userEvent.click(clickableField);
        const textField = screen.getByRole("textbox");
        expect(textField).toBeInTheDocument();
        userEvent.type(textField, "test text");
        expect(textField).toHaveValue("test text");
        fireEvent.blur(textField);
        expect(textField).not.toBeInTheDocument();
        expect(mockOnFinishFunction).toHaveBeenCalledWith("test text");
        expect(mockOnChangeFunction).toHaveBeenCalledTimes(9);
        const result = screen.getByText("test text");
        expect(result).toBeInTheDocument();
    });

    test("disabled with no value", () => {
        // just check that it renders without crashing
        render(<ClickableTextField disabled />);
    });

    test("disabled with value", () => {
        render(<ClickableTextField value={"test"} disabled />);
        const clickableField = screen.getByText("test");
        expect(clickableField).toBeInTheDocument();
        userEvent.click(clickableField);
        const textField = screen.queryByRole("textbox");
        expect(textField).toBeNull();
    });

    test("cancel edit", () => {
        render(<ClickableTextField value={"initial value"} />);
        const clickableField = screen.getByText("initial value");
        expect(clickableField).toBeInTheDocument();
        userEvent.click(clickableField);
        const textField = screen.getByRole("textbox");
        expect(textField).toBeInTheDocument();
        userEvent.type(textField, " test text");
        expect(textField).toHaveValue("initial value test text");
        userEvent.type(textField, "{esc}");
        expect(textField).not.toBeInTheDocument();
        const result = screen.getByText("initial value");
        expect(result).toBeInTheDocument();
    });
});
