import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { RiderResponsibilityChips } from "./RiderResponsibilityChips";
import userEvent from "@testing-library/user-event";

describe("RiderResponsibilityChips", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        const types = await DataStore.query(models.RiderResponsibility);
        await Promise.all(types.map((type) => DataStore.delete(type)));
    });

    test("display the rider responsibilities", async () => {
        await Promise.all(
            [
                new models.RiderResponsibility({
                    label: "rider-responsibility-1",
                }),
                new models.RiderResponsibility({
                    label: "rider-responsibility-2",
                }),
            ].map((type) => DataStore.save(type))
        );
        render(<RiderResponsibilityChips />);
        expect(
            await screen.findByText("rider-responsibility-1")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("rider-responsibility-2")
        ).toBeInTheDocument();
    });

    test("display the rider responsibilities failure", async () => {
        const querySpy = jest
            .spyOn(DataStore, "observeQuery")
            .mockReturnValue(new Error());
        render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.RiderResponsibility);
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
    });

    test("edit a rider responsibility", async () => {
        const resp = await DataStore.save(
            new models.RiderResponsibility({
                label: "rider-responsibility-1",
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<RiderResponsibilityChips />);
        expect(
            await screen.findByText("rider-responsibility-1")
        ).toBeInTheDocument();
        const more = "more text";
        userEvent.click(screen.getByText(resp.label));
        userEvent.type(
            screen.getByRole("textbox", { name: "edit label" }),
            more
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...resp,
                label: `${resp.label}${more}`,
            });
        });
    });

    test("edit a rider responsibility failure", async () => {
        const resp = await DataStore.save(
            new models.RiderResponsibility({
                label: "rider-responsibility-1",
            })
        );
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error());
        render(<RiderResponsibilityChips />);
        expect(
            await screen.findByText("rider-responsibility-1")
        ).toBeInTheDocument();
        const more = "more text";
        userEvent.click(screen.getByText(resp.label));
        userEvent.type(
            screen.getByRole("textbox", { name: "edit label" }),
            more
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
        expect(
            screen.getByRole("textbox", { name: "edit label" })
        ).toBeInTheDocument();
    });

    it("disables on empty input", async () => {
        const resp = await DataStore.save(
            new models.RiderResponsibility({
                label: "rider-responsibility-1",
            })
        );
        render(<RiderResponsibilityChips />);
        await screen.findByText("rider-responsibility-1");
        userEvent.click(screen.getByText(resp.label));
        userEvent.clear(screen.getByRole("textbox", { name: "edit label" }));
        expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    });

    it("unsubscribes on unmount", async () => {
        const unsubscribe = jest.fn();

        const observeQuerySpy = jest
            .spyOn(DataStore, "observeQuery")
            .mockImplementation(() => {
                return {
                    subscribe: () => ({ unsubscribe }),
                };
            });
        const { component } = render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(observeQuerySpy).toHaveBeenCalledWith(
                models.RiderResponsibility
            );
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalled();
        });
    });
});
