import { screen, waitFor } from "@testing-library/dom";
import { render } from "../../../test-utils";
import AdminAddLocation from "./AdminAddLocation";
import userEvent from "@testing-library/user-event";
import { userRoles } from "../../../apiConsts";
import * as models from "../../../models";
import _ from "lodash";
import { encodeUUID } from "../../../utilities";
import { DataStore } from "aws-amplify";

const fields = {
    name: "Name",
    ward: "Ward",
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
    what3words: "What 3 Words",
};

const contactFields = {
    name: "Contact name",
    emailAddress: "Contact email",
};

const tenantId = "tenant-id";

describe("AdminAddLocation", () => {
    it("renders", () => {
        render(<AdminAddLocation />);
    });

    test("adding a location", async () => {
        const whoami = await DataStore.save(
            new models.User({
                displayName: "someone person",
                roles: [userRoles.admin, userRoles.user],
            })
        );
        const savedData = new models.Location({
            ...fields,
            contact: { ...contactFields, telephoneNumber: "01234567890" },
            listed: 1,
            state: "",
            createdBy: whoami,
            tenantId: "tenant-id",
            disabled: 0,
        });
        const preloadedState = {
            loadingReducer: {
                GET_WHOAMI: false,
            },
            tenantId,
            whoami: { user: whoami },
        };
        const saveSpy = jest
            .spyOn(DataStore, "save")
            .mockResolvedValue(savedData);

        render(<AdminAddLocation />, { preloadedState });
        for (const value of Object.values(fields)) {
            userEvent.type(screen.getByRole("textbox", { name: value }), value);
        }
        for (const value of Object.values(contactFields)) {
            userEvent.type(screen.getByRole("textbox", { name: value }), value);
        }
        userEvent.type(
            screen.getByRole("textbox", { name: "Telephone number" }),
            "01234567890"
        );
        userEvent.click(screen.getByRole("button", { name: "Add location" }));
        await waitFor(() =>
            expect(saveSpy).toHaveBeenCalledWith({
                ...savedData,
                id: expect.any(String),
            })
        );
        expect(screen.getByText("Location added")).toBeInTheDocument();
        const link = screen.getByRole("link", { name: "VIEW" });
        expect(link).toHaveAttribute(
            "href",
            `/location/${encodeUUID(savedData.id)}`
        );
    });

    it("should not let you see the page if you are not an admin", async () => {
        render(<AdminAddLocation />, {
            preloadedState: {
                whoami: {
                    error: null,
                    user: {
                        id: "user-id",
                        roles: [userRoles.user],
                    },
                },
                tenantId,
                loadingReducer: {
                    GET_WHOAMI: false,
                },
            },
        });
        expect(
            screen.getByText("You don't have permission to view this page.")
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Add location" })
        ).toBeNull();
    });

    test("Add location button should be disabled if the name is not set", async () => {
        const preloadedState = {
            whoami: {
                error: null,
                user: {
                    id: "user-id",
                    roles: [userRoles.user, userRoles.admin],
                },
            },
            tenantId: "tenant-id",
            loadingReducer: {
                GET_WHOAMI: false,
            },
        };
        render(<AdminAddLocation />, { preloadedState });
        userEvent.type(screen.getByRole("textbox", { name: "Name" }), "");
        expect(
            screen.getByRole("button", { name: "Add location" })
        ).toBeDisabled();
    });
});
