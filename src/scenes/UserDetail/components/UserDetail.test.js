import { DataStore } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { screen, waitFor } from "@testing-library/react";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import UserDetail from "./UserDetail";

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

describe("UserDetail", () => {
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
});
