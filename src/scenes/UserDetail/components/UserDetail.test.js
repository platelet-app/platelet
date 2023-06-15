import { API, DataStore, graphqlOperation } from "aws-amplify";
import * as mutations from "../../../graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import { screen, waitFor } from "@testing-library/react";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import UserDetail from "./UserDetail";
import userEvent from "@testing-library/user-event";
import { userRoles } from "../../../apiConsts";
import { userAddressFields } from "./UserProfile";
import { userContactFields } from "./UserProfile";

const tenantId = uuidv4();
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
    roles: [userRoles.user, userRoles.rider],
    tenantId,
});

const whoami = new models.User({
    displayName: "whoami",
    roles: [userRoles.admin, userRoles.user],
});

const preloadedState = {
    whoami: { user: whoami },
    tenantId,
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
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.User, user.id);
        });
        for (const value of Object.values(testUser.contact)) {
            expect(screen.getByText(value)).toBeInTheDocument();
        }
    });

    test("user not found", async () => {
        const user = new models.User(testUser);
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.User, user.id);
        });
        expect(screen.getByText(/could not be found/)).toBeInTheDocument();
    });

    test("changing the display name", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
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

    test("failure on changing the display name", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest
            .spyOn(DataStore, "save")
            .mockRejectedValue(new Error());
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
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
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
        expect(
            screen.queryByText(`${user.displayName}${moreDisplayName}`)
        ).toBeNull();
    });

    test("trying to change to an already taken display name", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const takenName = "taken name";
        await DataStore.save(
            new models.User({ ...testUser, displayName: takenName })
        );
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Display Name" })
        );
        const textBox = screen.getByRole("textbox", { name: "display name" });
        await waitFor(() => {
            expect(textBox).toHaveValue(testUser.displayName);
        });
        userEvent.clear(textBox);
        userEvent.type(textBox, takenName);
        expect(textBox).toHaveValue(takenName);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, that display name is already taken")
            ).toBeInTheDocument();
        });
        expect(updateSpy).toHaveBeenCalledTimes(0);
        expect(screen.queryByText(takenName)).toBeNull();
        // it doesn't close the dialog
        expect(textBox).toBeInTheDocument();
        // check it works if you use your own name
        userEvent.clear(textBox);
        userEvent.type(textBox, user.displayName);
        expect(textBox).toHaveValue(user.displayName);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByText(user.displayName)).toBeInTheDocument();
    });

    test("changing the contact information name", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const updateSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
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
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Contact Information" })
        );
        const extraNumbers = "12345";
        const telephoneField = screen.getByRole("textbox", {
            name: userContactFields.telephoneNumber,
        });
        const mobileField = screen.getByRole("textbox", {
            name: userContactFields.mobileNumber,
        });
        userEvent.type(telephoneField, extraNumbers);
        userEvent.type(mobileField, extraNumbers);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(updateSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                contact: {
                    ...user.contact,
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
            expect(querySpy).toHaveBeenCalledTimes(2);
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
            expect(querySpy).toHaveBeenCalledTimes(2);
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

    test("display available rider responsibilities", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const riderResponsibility = await DataStore.save(
            new models.RiderResponsibility({ label: "testResp" })
        );
        const riderResponsibility2 = await DataStore.save(
            new models.RiderResponsibility({ label: "second one" })
        );
        await DataStore.save(
            new models.PossibleRiderResponsibilities({
                user,
                riderResponsibility,
            })
        );
        await DataStore.save(
            new models.PossibleRiderResponsibilities({
                user,
                riderResponsibility: riderResponsibility2,
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(
            screen.getByRole("button", { name: "testResp" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "second one" })
        ).toBeInTheDocument();
    });

    test("add to and remove rider responsibilities from a user", async () => {
        const user = await DataStore.save(
            new models.User({ ...testUser, riderResponsibility: "testResp" })
        );
        const riderResponsibility = await DataStore.save(
            new models.RiderResponsibility({ label: "testResp", tenantId })
        );
        const riderResponsibility2 = await DataStore.save(
            new models.RiderResponsibility({ label: "second one", tenantId })
        );
        const mockResultOne = new models.PossibleRiderResponsibilities({
            user,
            riderResponsibility,
            tenantId,
        });
        const mockResultTwo = new models.PossibleRiderResponsibilities({
            user,
            riderResponsibility: riderResponsibility2,
            tenantId,
        });
        const querySpy = jest.spyOn(DataStore, "query");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryByText("testResp")).toBeNull();
        expect(screen.queryByText("second one")).toBeNull();
        userEvent.click(
            screen.getByRole("button", { name: "Edit Rider Roles" })
        );
        const addRiderRoleButton = await screen.findByRole("button", {
            name: `Add Rider Role ${riderResponsibility.label}`,
        });
        const addRiderRoleButton2 = await screen.findByRole("button", {
            name: `Add Rider Role ${riderResponsibility2.label}`,
        });
        userEvent.click(addRiderRoleButton);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...mockResultOne,
                    id: expect.any(String),
                })
            );
        });
        userEvent.click(addRiderRoleButton2);
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...mockResultTwo,
                    id: expect.any(String),
                })
            );
        });
        userEvent.click(addRiderRoleButton);
        await waitFor(() => {
            expect(deleteSpy).toHaveBeenCalledWith({
                ...mockResultOne,
                id: expect.any(String),
            });
        });
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...user,
                riderResponsibility: null,
            });
        });
        await waitFor(() => {
            expect(addRiderRoleButton).toHaveClass("MuiChip-outlined");
        });
        expect(addRiderRoleButton2).toHaveClass("MuiChip-default");
        userEvent.click(screen.getByRole("button", { name: "Finish" }));
        await waitFor(() => {
            expect(screen.queryByText(riderResponsibility.label)).toBeNull();
        });
        expect(screen.getAllByText(riderResponsibility2.label)).toHaveLength(2);
    });

    test("change the current rider responsibility", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const riderResponsibility = await DataStore.save(
            new models.RiderResponsibility({ label: "testResp" })
        );
        await DataStore.save(
            new models.PossibleRiderResponsibilities({
                user,
                riderResponsibility,
            })
        );
        const saveSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "testResp" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenNthCalledWith(1, {
                ...user,
                riderResponsibility: riderResponsibility.label,
            });
        });
    });

    test("disallow editing when not an admin", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, {
            preloadedState: {
                whoami: {
                    user: {
                        displayName: "test",
                        roles: [userRoles.user],
                    },
                },
            },
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(
            screen.queryByRole("button", { name: "Edit Display Name" })
        ).toBeNull();
        expect(
            screen.queryByRole("button", { name: "Edit Contact Information" })
        ).toBeNull();
        expect(
            screen.queryByRole("button", { name: "Edit Rider Roles" })
        ).toBeNull();
        expect(screen.queryByRole("button", { name: "Edit Roles" })).toBeNull();
        expect(
            screen.queryByRole("button", { name: "Edit Address Information" })
        ).toBeNull();
        expect(
            screen.queryByRole("button", { name: "Edit Rider Roles" })
        ).toBeNull();
    });

    test("change the user's roles", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({});
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit Roles" }));
        const adminButton = screen.getByRole("button", { name: "ADMIN" });
        expect(adminButton).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(adminButton);
        expect(adminButton).toHaveAttribute("aria-disabled", "true");
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith(
                graphqlOperation(mutations.updateUserRoles, {
                    userId: user.id,
                    roles: [userRoles.user, userRoles.rider, userRoles.admin],
                })
            );
        });
        expect(adminButton).not.toHaveAttribute("aria-disabled", "true");
        await waitFor(() => {
            expect(adminButton).toHaveClass("MuiChip-filled");
        });
    });

    test("can't remove admin role if they are primary admin", async () => {
        const user = await DataStore.save(
            new models.User({
                ...testUser,
                isPrimaryAdmin: 1,
                roles: [userRoles.admin, userRoles.user],
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit Roles" }));
        const adminButton = screen.getByRole("button", { name: "ADMIN" });
        expect(adminButton).toHaveClass("MuiChip-filled");
        expect(adminButton).toHaveAttribute("aria-disabled", "true");
    });

    test("change the user's roles failure", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        const apiSpy = jest.spyOn(API, "graphql").mockRejectedValueOnce({});
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        userEvent.click(screen.getByRole("button", { name: "Edit Roles" }));
        const adminButton = screen.getByRole("button", { name: "ADMIN" });
        expect(adminButton).toHaveClass("MuiChip-outlinedDefault");
        userEvent.click(adminButton);
        expect(adminButton).toHaveAttribute("aria-disabled", "true");
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
        expect(adminButton).not.toHaveAttribute("aria-disabled", "true");
        expect(adminButton).toHaveClass("MuiChip-outlinedDefault");
    });

    it("updates the name on remote change", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(screen.getByText(testUser.name)).toBeInTheDocument();
        await DataStore.save(
            models.User.copyOf(user, (upd) => (upd.name = "new name"))
        );
        await waitFor(() => {
            expect(screen.getByText("new name")).toBeInTheDocument();
        });
    });

    it("updates the roles on remote change", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryByText("ADMIN")).toBeNull();
        await DataStore.save(
            models.User.copyOf(
                user,
                (upd) => (upd.roles = [...user.roles, userRoles.admin])
            )
        );
        await waitFor(() => {
            expect(screen.getByText("ADMIN")).toBeInTheDocument();
        });
    });

    it("updates the current responsibility on remote change", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const riderResponsibility = await DataStore.save(
            new models.RiderResponsibility({ label: "testResp" })
        );
        await DataStore.save(
            new models.PossibleRiderResponsibilities({
                user,
                riderResponsibility,
            })
        );
        render(<UserDetail userId={user.id} />, { preloadedState });
        const respButton = await screen.findByRole("button", {
            name: "testResp",
        });
        expect(respButton).toHaveClass("MuiChip-outlinedDefault");
        await DataStore.save(
            models.User.copyOf(
                user,
                (upd) => (upd.riderResponsibility = riderResponsibility.label)
            )
        );
        await waitFor(() => {
            expect(respButton).toHaveClass("MuiChip-default");
        });
    });

    test("don't show profile picture button if not admin or owner", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const whoami = new models.User({
            displayName: "whoami",
            roles: [userRoles.user],
        });
        const querySpy = jest.spyOn(DataStore, "query");
        render(<UserDetail userId={user.id} />, {
            ...preloadedState,
            whoami: { user: whoami },
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        expect(screen.queryByText("Upload Picture")).toBeNull();
    });

    test("show upload picture if owner", async () => {
        const user = await DataStore.save(whoami);
        render(<UserDetail userId={user.id} />, { preloadedState });
        expect(await screen.findByText("Upload Picture")).toBeInTheDocument();
    });

    test("unsubscribe observers on unmount", async () => {
        const user = await DataStore.save(new models.User(testUser));
        const querySpy = jest.spyOn(DataStore, "query");
        const unsubscribe = jest.fn();
        jest.spyOn(DataStore, "observe").mockImplementation(() => {
            return {
                subscribe: () => ({ unsubscribe: unsubscribe }),
            };
        });
        const { component } = render(<UserDetail userId={user.id} />, {
            preloadedState,
        });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(2);
        });
        component.unmount();
        expect(unsubscribe).toHaveBeenCalledTimes(3);
    });
    test("no enable to disable buttons if user is not admin", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                disabled: 1,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        render(<UserDetail userId={user.id} />, { preloadedState });
        await screen.findByText("displayName");
        expect(screen.queryByRole("button")).toBeNull();
    });
    test("enable a user", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER, models.Role.ADMIN],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                disabled: 1,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        render(<UserDetail userId={user.id} />, { preloadedState });
        userEvent.click(
            await screen.findByRole("button", { name: "Enable this user" })
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: mutations.enableUser,
                variables: {
                    userId: user.id,
                },
            });
        });
    });
    test("disable a user", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER, models.Role.ADMIN],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        render(<UserDetail userId={user.id} />, { preloadedState });
        userEvent.click(
            await screen.findByRole("button", { name: "Disable this user" })
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: mutations.disableUser,
                variables: {
                    userId: user.id,
                },
            });
        });
    });
    test("change a user email", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER, models.Role.ADMIN],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                contact: {
                    emailAddress: "some@email.com",
                },
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        render(<UserDetail userId={user.id} />, { preloadedState });
        userEvent.click(
            await screen.findByRole("button", { name: "Edit Email Address" })
        );
        const textBox = screen.getByRole("textbox");
        userEvent.clear(textBox);
        userEvent.type(textBox, "another@email.com");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: mutations.updateUserEmail,
                variables: {
                    userId: user.id,
                    emailAddress: "another@email.com",
                },
            });
        });
    });
    test("change a user email failure", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER, models.Role.ADMIN],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                contact: {
                    emailAddress: "some@email.com",
                },
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        jest.spyOn(API, "graphql").mockRejectedValue(new Error("error"));
        render(<UserDetail userId={user.id} />, { preloadedState });
        userEvent.click(
            await screen.findByRole("button", { name: "Edit Email Address" })
        );
        const textBox = screen.getByRole("textbox");
        userEvent.clear(textBox);
        userEvent.type(textBox, "another@email.com");
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(
                screen.getByText("Sorry, something went wrong")
            ).toBeInTheDocument();
        });
    });
    test("resend user invite email", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER, models.Role.ADMIN],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        render(<UserDetail userId={user.id} />, { preloadedState });
        userEvent.click(
            await screen.findByRole("button", { name: "Reset Password" })
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: mutations.resetUserPassword,
                variables: {
                    userId: user.id,
                },
            });
        });
        expect(screen.getByText("Message sent")).toBeInTheDocument();
    });
    test("resend user invite failure", async () => {
        const whoami = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER, models.Role.ADMIN],
                username: "username",
                displayName: "displayName",
            })
        );
        const user = await DataStore.save(
            new models.User({
                tenantId,
                cognitoId: "cognitoId",
                roles: [models.Role.USER],
                username: "username",
                displayName: "displayName",
                disabled: 0,
            })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
        };
        const apiSpy = jest
            .spyOn(API, "graphql")
            .mockRejectedValue(new Error("some error"));
        render(<UserDetail userId={user.id} />, { preloadedState });
        userEvent.click(
            await screen.findByRole("button", { name: "Reset Password" })
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: mutations.resetUserPassword,
                variables: {
                    userId: user.id,
                },
            });
        });
        expect(
            screen.getByText("Sorry, something went wrong")
        ).toBeInTheDocument();
    });
});
