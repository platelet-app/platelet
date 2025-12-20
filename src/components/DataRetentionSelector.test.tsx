import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataRetentionSelector, {
    TimeUnit,
    DataRetentionValue,
} from "./DataRetentionSelector";

describe("DataRetentionSelector", () => {
    const defaultValue: DataRetentionValue = {
        value: 30,
        unit: TimeUnit.DAYS,
    };

    test("renders with default value", () => {
        const onChange = jest.fn();
        render(<DataRetentionSelector value={defaultValue} onChange={onChange} />);

        expect(screen.getByLabelText("Retention Time")).toHaveValue(30);
        expect(screen.getByLabelText("Unit")).toHaveTextContent("Days");
    });

    test("calls onChange when value changes", () => {
        const onChange = jest.fn();
        render(<DataRetentionSelector value={defaultValue} onChange={onChange} />);

        const valueInput = screen.getByLabelText("Retention Time");
        userEvent.clear(valueInput);
        userEvent.type(valueInput, "60");

        expect(onChange).toHaveBeenCalledWith({
            value: 60,
            unit: TimeUnit.DAYS,
        });
    });

    test("calls onChange when unit changes", () => {
        const onChange = jest.fn();
        render(<DataRetentionSelector value={defaultValue} onChange={onChange} />);

        const unitSelect = screen.getByLabelText("Unit");
        userEvent.click(unitSelect);
        userEvent.click(screen.getByText("Weeks"));

        expect(onChange).toHaveBeenCalledWith({
            value: 30,
            unit: TimeUnit.WEEKS,
        });
    });

    test("displays all time unit options", () => {
        const onChange = jest.fn();
        render(<DataRetentionSelector value={defaultValue} onChange={onChange} />);

        const unitSelect = screen.getByLabelText("Unit");
        userEvent.click(unitSelect);

        expect(screen.getByText("Days")).toBeInTheDocument();
        expect(screen.getByText("Weeks")).toBeInTheDocument();
        expect(screen.getByText("Months")).toBeInTheDocument();
        expect(screen.getByText("Years")).toBeInTheDocument();
    });

    test("can be disabled", () => {
        const onChange = jest.fn();
        render(
            <DataRetentionSelector
                value={defaultValue}
                onChange={onChange}
                disabled={true}
            />
        );

        const valueInput = screen.getByLabelText("Retention Time");
        const unitSelect = screen.getByLabelText("Unit");

        expect(valueInput).toBeDisabled();
        expect(unitSelect).toBeDisabled();
    });

    test("minimum allowed value is 1", () => {
        const onChange = jest.fn();
        render(<DataRetentionSelector value={defaultValue} onChange={onChange} />);

        const valueInput = screen.getByLabelText("Retention Time");
        expect(valueInput).toHaveAttribute("min", "1");
    });
});
