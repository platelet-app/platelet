import { screen, waitFor } from "@testing-library/react";
import { render } from "../../test-utils";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
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
        const querySpy = jest.spyOn(DataStore, "query");
        render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.RiderResponsibility);
        });
        expect(screen.getByText("rider-responsibility-1")).toBeInTheDocument();
        expect(screen.getByText("rider-responsibility-2")).toBeInTheDocument();
    });

    test("edit a rider responsibility", async () => {
        const resp = await DataStore.save(
            new models.RiderResponsibility({
                label: "rider-responsibility-1",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.RiderResponsibility);
        });
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
        await waitFor(() => {
            expect(
                screen.getByText(`${resp.label}${more}`)
            ).toBeInTheDocument();
        });
    });

    test("observer works", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.RiderResponsibility);
        });
        const resp = await DataStore.save(
            new models.RiderResponsibility({ label: "something" })
        );
        expect(await screen.findByText("something")).toBeInTheDocument();
        await DataStore.save(
            models.RiderResponsibility.copyOf(
                resp,
                (upd) => (upd.label = "other")
            )
        );
        expect(await screen.findByText("other")).toBeInTheDocument();
        await DataStore.delete(resp);
        await waitFor(() => {
            expect(screen.queryByText("other")).toBeNull();
        });
    });

    it("disables on empty input", async () => {
        const resp = await DataStore.save(
            new models.RiderResponsibility({
                label: "rider-responsibility-1",
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.RiderResponsibility);
        });
        userEvent.click(screen.getByText(resp.label));
        userEvent.clear(screen.getByRole("textbox", { name: "edit label" }));
        expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    });

    it("unsubscribes on unmount", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        const unsubscribe = jest.fn();

        jest.spyOn(DataStore, "observe").mockImplementation(() => {
            return {
                subscribe: () => ({ unsubscribe }),
            };
        });
        const { component } = render(<RiderResponsibilityChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.RiderResponsibility);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalled();
        });
    });
});
