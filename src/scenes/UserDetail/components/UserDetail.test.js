import { DataStore } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { screen, waitFor } from "@testing-library/react";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import UserDetail from "./UserDetail";
import userEvent from "@testing-library/user-event";
import { userRoles } from "../../../apiConsts";

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
});
