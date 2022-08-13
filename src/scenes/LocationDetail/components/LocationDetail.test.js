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

    test("change the details", async () => {
        const location = await DataStore.save(
            new models.Location(mockLocation)
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<LocationDetail locationId={location.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Location Details" })
        );
        const more = "more text";
        for (const [key, value] of Object.entries(locationFields)) {
            const textBox = screen.getByRole("textbox", { name: value });
            await waitFor(() => {
                expect(textBox).toHaveValue(location[key]);
            });
            userEvent.type(textBox, more);
            await waitFor(() => {
                expect(textBox).toHaveValue(`${location[key]}${more}`);
            });
        }
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        const newValues = Object.keys(locationFields).reduce((acc, key) => {
            return { ...acc, [key]: `${location[key]}${more}` };
        }, {});
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...location,
                ...newValues,
            });
        });
    });

    test("change the contact information", async () => {
        const location = await DataStore.save(
            new models.Location(mockLocation)
        );
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<LocationDetail locationId={location.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", {
                name: "Edit Location Contact",
            })
        );
        const more = "more text";
        const email = screen.getByRole("textbox", { name: "Email" });
        userEvent.type(email, more);
        await waitFor(() => {
            expect(email).toHaveValue(
                `${mockLocation.contact.emailAddress}${more}`
            );
        });
        const name = screen.getByRole("textbox", { name: "Name" });
        userEvent.type(name, more);
        await waitFor(() => {
            expect(name).toHaveValue(`${mockLocation.contact.name}${more}`);
        });
        const telephone = screen.getByRole("textbox", {
            name: "Telephone",
        });
        userEvent.type(telephone, "12345");
        await waitFor(() => {
            expect(telephone).toHaveValue(
                `${mockLocation.contact.telephoneNumber}12345`
            );
        });
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...location,
                contact: {
                    ...mockLocation.contact,
                    emailAddress: `${mockLocation.contact.emailAddress}${more}`,
                    name: `${mockLocation.contact.name}${more}`,
                    telephoneNumber: `${mockLocation.contact.telephoneNumber}12345`,
                },
            });
        });
    });
});
