import { DataStore } from "aws-amplify";
import { deliverableIcons } from "../../apiConsts";
import { render } from "../../test-utils";
import * as models from "../../models";
import { DeliverableTypeChips } from "./DeliverableTypeChips";
import { screen, waitFor } from "@testing-library/react";
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
        render(<DeliverableTypeChips />);
        await waitFor(() =>
            expect(screen.getByText("deliverable-type-1")).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(screen.getByText("deliverable-type-2")).toBeInTheDocument()
        );
        expect(screen.getByTestId("AcUnitIcon")).toBeInTheDocument();
        expect(screen.getByTestId("BugReportIcon")).toBeInTheDocument();
    });
});
