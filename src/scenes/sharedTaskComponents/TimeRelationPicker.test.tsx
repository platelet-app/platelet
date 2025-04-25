import * as React from "react";
import { render, screen, waitFor } from "../../test-utils";
import TimeRelationPicker from "./TimeRelationPicker";
import * as models from "../../models";
import userEvent from "@testing-library/user-event";

describe("TimeRelationPicker", () => {
    it("should render something", () => {
        render(
            <TimeRelationPicker
                relation={models.TimeRelation.ANYTIME}
                timePrimary={new Date().toISOString()}
                isValid
                handleChange={jest.fn()}
                handleChangeTime={jest.fn()}
                handleChangeSecondaryTime={jest.fn()}
            />
        );

        expect(screen.getByText("ANYTIME")).toBeInTheDocument();
    });
    it("should render before schedule information", () => {
        render(
            <TimeRelationPicker
                relation={models.TimeRelation.BEFORE}
                timePrimary="12:00"
                isValid
                handleChange={jest.fn()}
                handleChangeTime={jest.fn()}
                handleChangeSecondaryTime={jest.fn()}
            />
        );
        expect(screen.getByText("BEFORE")).toBeInTheDocument();
        const textBox = screen.getByRole("textbox");
        expect(textBox).toHaveValue("12:00");
    });
    it("should render between schedule information", () => {
        render(
            <TimeRelationPicker
                relation={models.TimeRelation.BETWEEN}
                timePrimary="14:00"
                timeSecondary="15:00"
                isValid
                handleChange={jest.fn()}
                handleChangeTime={jest.fn()}
                handleChangeSecondaryTime={jest.fn()}
            />
        );
        expect(screen.getByText("BETWEEN")).toBeInTheDocument();
        const textBox = screen.getAllByRole("textbox");
        expect(textBox[0]).toHaveValue("14:00");
        expect(textBox[1]).toHaveValue("15:00");
    });
    it("set the time relation", () => {
        const handleChange = jest.fn();
        render(
            <TimeRelationPicker
                relation={models.TimeRelation.ANYTIME}
                timePrimary="10:00"
                timeSecondary={null}
                isValid
                handleChange={handleChange}
                handleChangeTime={jest.fn()}
                handleChangeSecondaryTime={jest.fn()}
            />
        );
        const select = screen.getByRole("button");
        userEvent.click(select);
        userEvent.click(screen.getByRole("option", { name: "BEFORE" }));
        expect(handleChange).toHaveBeenCalledWith(models.TimeRelation.BEFORE);
    });
    it("set to before a time", async () => {
        const handleChange = jest.fn();
        const handleChangeTime = jest.fn();
        render(
            <TimeRelationPicker
                relation={models.TimeRelation.BEFORE}
                timePrimary=""
                timeSecondary={null}
                isValid
                handleChange={handleChange}
                handleChangeTime={handleChangeTime}
                handleChangeSecondaryTime={jest.fn()}
            />
        );
        expect(screen.getByText("BEFORE")).toBeInTheDocument();
        const textBox = screen.getByRole("textbox");
        userEvent.type(textBox, "12:00");
        expect(handleChangeTime.mock.calls).toMatchInlineSnapshot(`
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
                "0",
              ],
              Array [
                "0",
              ],
            ]
        `);
    });
    it("change secondary time", async () => {
        const handleChange = jest.fn();
        const handleChangeTime = jest.fn();
        const handleChangeSecondaryTime = jest.fn();
        render(
            <TimeRelationPicker
                relation={models.TimeRelation.BETWEEN}
                timePrimary="12:00"
                timeSecondary=""
                isValid
                handleChange={handleChange}
                handleChangeTime={handleChangeTime}
                handleChangeSecondaryTime={handleChangeSecondaryTime}
            />
        );
        expect(screen.getByText("BETWEEN")).toBeInTheDocument();
        const textBox = screen.getAllByRole("textbox");
        userEvent.type(textBox[1], "14:00");
        expect(handleChangeSecondaryTime.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "1",
              ],
              Array [
                "4",
              ],
              Array [
                ":",
              ],
              Array [
                "0",
              ],
              Array [
                "0",
              ],
            ]
        `);
    });
});
