import { screen, waitFor } from "@testing-library/dom";
import React from "react";
import { render } from "../../../test-utils";
import AdminAddLocation from "./AdminAddLocation";
import userEvent from "@testing-library/user-event";
import { userRoles } from "../../../apiConsts";
import * as amplify from "aws-amplify";
import * as models from "../../../models";
import _ from "lodash";
import { encodeUUID } from "../../../utilities";

jest.mock("aws-amplify");

const fields = {
    name: "Name",
    ward: "Ward",
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    state: "State",
    postcode: "Postcode",
    what3words: "What 3 Words",
};

const contactFields = {
    name: "Contact name",
    emailAddress: "Contact email",
};

const preloadedState = {
    whoami: {
        error: null,
        user: {
            id: "user-id",
            roles: [userRoles.admin, userRoles.user],
        },
    },
    loadingReducer: {
        GET_WHOAMI: false,
    },
};

const savedData = new models.Location({
    ...fields,
    contact: { ...contactFields, telephoneNumber: "01234567890" },
    listed: 1,
});

describe("AdminAddLocation", () => {
    it("renders", () => {
        render(<AdminAddLocation />);
    });

    test.only("adding a location", async () => {
        amplify.DataStore.save.mockResolvedValue(savedData);
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
            expect(amplify.DataStore.save).toHaveBeenCalledWith(
                expect.objectContaining(_.omit(savedData, "id"))
            )
        );
        expect(screen.getByText("Location added")).toBeInTheDocument();
        const link = screen.getByRole("link", { name: "VIEW" });
        expect(link).toHaveAttribute(
            "href",
            `/location/${encodeUUID(savedData.id)}`
        );
    });
});
