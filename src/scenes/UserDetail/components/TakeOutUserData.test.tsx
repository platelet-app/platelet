import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "../../../test-utils";
import TakeOutUserData from "./TakeOutUserData";
import * as models from "@platelet-app/models";
import { queries } from "@platelet-app/graphql";
import { API } from "aws-amplify";

describe("TakeOutData", () => {
    test("take out some data", async () => {
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValue({});
        const fakeUser = new models.User({
            username: "test",
            cognitoId: "subid",
            tenantId: "tenantId",
            displayName: "test",
            roles: [models.Role.USER],
        });

        render(<TakeOutUserData user={fakeUser} />);
        const button = screen.getByRole("button", { name: "Take out data" });
        expect(button).toBeEnabled();
        userEvent.click(button);
        const confirmButton = screen.getByRole("button", {
            name: "Send my data",
        });
        userEvent.click(confirmButton);
        expect(confirmButton).toHaveProperty("disabled");
        await waitFor(() => {
            expect(apiSpy).toHaveBeenCalledWith({
                query: queries.userTakeOutData,
                variables: {
                    userId: fakeUser.id,
                },
            });
        });
    });
});
