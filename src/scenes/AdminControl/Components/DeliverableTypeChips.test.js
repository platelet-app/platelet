import { DataStore } from "aws-amplify";
import { deliverableIcons, deliverableUnits } from "../../../apiConsts";
import { render } from "../../../test-utils";
import * as models from "../../../models";
import { DeliverableTypeChips } from "./DeliverableTypeChips";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DeliverableTypeChips", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        const types = await DataStore.query(models.DeliverableType);
        await Promise.all(types.map((type) => DataStore.delete(type)));
    });

    test("display the deliverable types", async () => {
        await Promise.all(
            [
                new models.DeliverableType({
                    label: "deliverable-type-1",
                    icon: deliverableIcons.other,
                }),
                new models.DeliverableType({
                    label: "deliverable-type-2",
                    icon: deliverableIcons.bug,
                }),
            ].map((type) => DataStore.save(type))
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<DeliverableTypeChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.DeliverableType);
        });
        expect(screen.getByText("deliverable-type-1")).toBeInTheDocument();
        expect(screen.getByText("deliverable-type-2")).toBeInTheDocument();
        expect(screen.getByTestId("AcUnitIcon")).toBeInTheDocument();
        expect(screen.getByTestId("BugReportIcon")).toBeInTheDocument();
    });

    test("edit a deliverable type", async () => {
        const deliverable = await DataStore.save(
            new models.DeliverableType({
                label: "deliverable-type-1",
                icon: deliverableIcons.other,
                tags: ["tag-1", "tag-2"],
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<DeliverableTypeChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const moreText = "more text";
        userEvent.click(screen.getByText(deliverable.label));
        userEvent.type(
            screen.getByRole("textbox", { name: "edit label" }),
            moreText
        );
        userEvent.click(screen.getByRole("button", { name: "ITEM" }));
        userEvent.click(screen.getByRole("button", { name: "Bug icon" }));
        const someTag = "someTag";
        const combobox = screen.getByRole("combobox", {
            name: "add deliverable type tag",
        });
        userEvent.type(combobox, someTag);
        userEvent.type(combobox, "{enter}");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...deliverable,
                tags: ["tag-1", "tag-2", someTag],
                defaultUnit: deliverableUnits.item,
                label: `${deliverable.label}${moreText}`,
                icon: deliverableIcons.bug,
            });
        });
        expect(
            await screen.findByText(`${deliverable.label}${moreText}`)
        ).toBeInTheDocument();
        expect(screen.getByTestId("BugReportIcon")).toBeInTheDocument();
    });

    it("disables OK if the label is empty", async () => {
        const deliverable = await DataStore.save(
            new models.DeliverableType({
                label: "deliverable-type-1",
                icon: deliverableIcons.other,
                tags: ["tag-1", "tag-2"],
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<DeliverableTypeChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        userEvent.click(screen.getByText(deliverable.label));
        expect(screen.getByRole("button", { name: "OK" })).toBeEnabled();
        userEvent.clear(screen.getByRole("textbox", { name: "edit label" }));
        expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
    });

    test("updates from observer", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<DeliverableTypeChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        const deliverable = await DataStore.save(
            new models.DeliverableType({
                label: "test",
                icon: deliverableIcons.other,
            })
        );
        expect(await screen.findByText("test")).toBeInTheDocument();
        expect(screen.getByTestId("AcUnitIcon")).toBeInTheDocument();
        await DataStore.save(
            models.DeliverableType.copyOf(deliverable, (upd) => {
                upd.label = "test2";
                upd.icon = deliverableIcons.bug;
            })
        );
        expect(await screen.findByText("test2")).toBeInTheDocument();
        expect(screen.getByTestId("BugReportIcon")).toBeInTheDocument();
        await DataStore.delete(deliverable);
        await waitFor(() => {
            expect(screen.queryByText("test2")).toBeNull();
        });
    });

    test("unsubscribe on unmount", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        const unsubscribe = jest.fn();

        jest.spyOn(DataStore, "observe").mockImplementation(() => {
            return {
                subscribe: () => ({ unsubscribe }),
            };
        });
        const { component } = render(<DeliverableTypeChips />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(1);
        });
        component.unmount();
        await waitFor(() => {
            expect(unsubscribe).toHaveBeenCalledTimes(1);
        });
    });
});
