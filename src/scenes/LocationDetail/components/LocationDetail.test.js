import { v4 as uuidv4 } from "uuid";
import { locationFields } from "./LocationProfile";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test-utils";
import LocationDetail from "./LocationDetail";
import userEvent from "@testing-library/user-event";
import { userRoles } from "../../../apiConsts";

const mockAddress = Object.keys(locationFields).reduce((acc, key) => {
    return { ...acc, [key]: uuidv4() };
}, {});

const mockLocation = {
    name: "Test Location",
    contact: {
        name: "Test Contact",
        telephoneNumber: "0123456789",
        emailAddress: "test@test.com",
    },
    ...mockAddress,
};

const whoami = new models.User({
    displayName: "whoami",
    roles: [userRoles.admin, userRoles.user],
});

const preloadedState = {
    whoami: { user: whoami },
};

describe("LocationDetail", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        const locations = await DataStore.query(models.Location);
        await Promise.all(locations.map((item) => DataStore.delete(item)));
    });

    test("render location details", async () => {
        const location = await DataStore.save(
            new models.Location(mockLocation)
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<LocationDetail locationId={location.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        for (const value of Object.values(mockAddress)) {
            expect(screen.getByText(value)).toBeInTheDocument();
        }
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.contact.name)).toBeInTheDocument();
        expect(
            screen.getByText(mockLocation.contact.telephoneNumber)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockLocation.contact.emailAddress)
        ).toBeInTheDocument();
    });

    test("change the name", async () => {
        const location = await DataStore.save(
            new models.Location(mockLocation)
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<LocationDetail locationId={location.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        const more = "more text";
        userEvent.click(
            screen.getByRole("button", { name: "Edit Location Name" })
        );
        const textBox = screen.getByRole("textbox", { name: "Name" });
        userEvent.type(textBox, more);
        expect(textBox.value).toBe(`${mockLocation.name}${more}`);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...location,
                name: `${mockLocation.name}${more}`,
            });
        });
    });
});
