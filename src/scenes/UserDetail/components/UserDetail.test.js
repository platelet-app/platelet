import { DataStore } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { screen, waitFor } from "@testing-library/react";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import UserDetail from "./UserDetail";
import userEvent from "@testing-library/user-event";
import { userRoles } from "../../../apiConsts";
import { userAddressFields } from "./UserProfile";
import { userContactFields } from "./UserProfile";

const testUser = new models.User({
    contact: {
        emailAddress: uuidv4(),
        telephoneNumber: "0123123",
        mobileNumber: "987987",
        line1: uuidv4(),
        line2: uuidv4(),
        line3: uuidv4(),
        town: uuidv4(),
        county: uuidv4(),
        country: uuidv4(),
        postcode: uuidv4(),
    },
    name: uuidv4(),
    displayName: uuidv4(),
});

const whoami = new models.User({
    displayName: "whoami",
    roles: [userRoles.admin, userRoles.user],
});

const preloadedState = {
    whoami: { user: whoami },
};

describe("UserDetail", () => {
    afterEach(async () => {
        jest.restoreAllMocks();
        const users = await DataStore.query(models.User);
        const possibleRiderResponsibilities = await DataStore.query(
            models.RiderResponsibility
        );
        await Promise.all(
            [...users, ...possibleRiderResponsibilities].map((u) =>
                DataStore.delete(u)
            )
        );
    });

    it("should display user information", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.User, user.id);
        });
        for (const value of Object.values(testUser.contact)) {
            expect(screen.getByText(value)).toBeInTheDocument();
        }
    });

    test("changing the display name", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        const moreDisplayName = "more name";
        userEvent.click(
            screen.getByRole("button", { name: "Edit Display Name" })
        );
        const textBox = screen.getByRole("textbox", { name: "display name" });
        await waitFor(() => {
            expect(textBox).toHaveValue(testUser.displayName);
        });
        userEvent.type(textBox, moreDisplayName);
        expect(textBox).toHaveValue(`${user.displayName}${moreDisplayName}`);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                displayName: `${user.displayName}${moreDisplayName}`,
            });
        });
    });

    test("changing the contact information name", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Contact Information" })
        );
        const textBox = screen.getByRole("textbox", { name: "Name" });
        await waitFor(() => {
            expect(textBox).toHaveValue(testUser.name);
        });
        userEvent.type(textBox, "stuff");
        await waitFor(() => {
            expect(textBox).toHaveValue(`${user.name}stuff`);
        });
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                name: `${user.name}stuff`,
            });
        });
        await waitFor(() => {
            expect(screen.getByText(`${user.name}stuff`)).toBeInTheDocument();
        });
    });

    test("changing the contact information", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Contact Information" })
        );
        const extra = "more stuff";
        const extraNumbers = "12345";
        const emailField = screen.getByRole("textbox", {
            name: userContactFields.emailAddress,
        });
        const telephoneField = screen.getByRole("textbox", {
            name: userContactFields.telephoneNumber,
        });
        const mobileField = screen.getByRole("textbox", {
            name: userContactFields.mobileNumber,
        });
        userEvent.type(emailField, extra);
        userEvent.type(telephoneField, extraNumbers);
        userEvent.type(mobileField, extraNumbers);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                contact: {
                    ...user.contact,
                    emailAddress: `${user.contact.emailAddress}${extra}`,
                    telephoneNumber: `${user.contact.telephoneNumber}${extraNumbers}`,
                    mobileNumber: `${user.contact.mobileNumber}${extraNumbers}`,
                },
            });
        });
    });

    test("changing the contact information name and telephone", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Contact Information" })
        );
        const textBox = screen.getByRole("textbox", { name: "Name" });
        await waitFor(() => {
            expect(textBox).toHaveValue(testUser.name);
        });
        userEvent.type(textBox, "stuff");
        await waitFor(() => {
            expect(textBox).toHaveValue(`${user.name}stuff`);
        });
        const telephoneField = screen.getByRole("textbox", {
            name: userContactFields.telephoneNumber,
        });
        userEvent.type(telephoneField, "12345");
        await waitFor(() => {
            expect(telephoneField).toHaveValue(
                `${user.contact.telephoneNumber}12345`
            );
        });

        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                name: `${user.name}stuff`,
                contact: {
                    ...user.contact,
                    telephoneNumber: `${user.contact.telephoneNumber}12345`,
                },
            });
        });
        await waitFor(() => {
            expect(screen.getByText(`${user.name}stuff`)).toBeInTheDocument();
        });
    });

    test("changing the address", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Address Information" })
        );
        const extra = "more stuff";
        for (const [key, value] of Object.entries(userAddressFields)) {
            const textBox = screen.getByRole("textbox", { name: value });
            await waitFor(() => {
                expect(textBox).toHaveValue(user.contact[key]);
            });
            userEvent.type(textBox, extra);
            await waitFor(() => {
                expect(textBox).toHaveValue(`${testUser.contact[key]}${extra}`);
            });
        }
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                contact: {
                    ...user.contact,
                    line1: `${user.contact.line1}${extra}`,
                    line2: `${user.contact.line2}${extra}`,
                    line3: `${user.contact.line3}${extra}`,
                    town: `${user.contact.town}${extra}`,
                    county: `${user.contact.county}${extra}`,
                    country: `${user.contact.country}${extra}`,
                    postcode: `${user.contact.postcode}${extra}`,
                },
            });
        });
        await waitFor(() => {
            expect(
                screen.getByText(`${user.contact.line1}${extra}`)
            ).toBeInTheDocument();
        });
    });
});
