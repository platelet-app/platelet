import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import AdminAddVehicle from "./AdminAddVehicle";

const tenantId = "tenantId";

describe("AdminAddVehicle", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    test("add a vehicle", async () => {
        const whoami = await DataStore.save(
            new models.User({ displayName: "test", roles: [models.Role.ADMIN] })
        );
        const expectedVehicle = new models.Vehicle({
            name: "Test Vehicle",
            manufacturer: "Test Manufacturer",
            model: "Test Model",
            dateOfManufacture: null,
            dateOfRegistration: null,
            disabled: 0,
            tenantId,
            createdBy: whoami,
        });
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
            loadingReducer: {
                GET_WHOAMI: false,
            },
        };
        const saveSpy = jest.spyOn(DataStore, "save");
        render(<AdminAddVehicle />, { preloadedState });
        userEvent.type(
            screen.getByRole("textbox", { name: "Name" }),
            expectedVehicle.name
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Manufacturer" }),
            expectedVehicle.manufacturer
        );
        userEvent.type(
            screen.getByRole("textbox", { name: "Model" }),
            expectedVehicle.model
        );
        // still don't know why this won't work in test
        //const dateOfManufactureInput = screen.getByRole("textbox", {
        //    name: "Date of manufacture input",
        //});
        //userEvent.type(dateOfManufactureInput, "2021-01-01");
        //expect(dateOfManufactureInput).toHaveValue("2021-01-01");
        userEvent.click(screen.getByRole("button", { name: "Add vehicle" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...expectedVehicle,
                id: expect.any(String),
            });
        });
    });

    it("should not let you see the page if you are not an admin", async () => {
        render(<AdminAddVehicle />, {
            preloadedState: {
                whoami: {
                    error: null,
                    user: {
                        id: "user-id",
                        roles: [models.Role.USER],
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
            screen.queryByRole("button", { name: "Add vehicle" })
        ).toBeNull();
    });

    test("add vehicle button should be disabled if no name is set", async () => {
        const whoami = await DataStore.save(
            new models.User({ displayName: "test", roles: [models.Role.ADMIN] })
        );
        const preloadedState = {
            whoami: { user: whoami },
            tenantId,
            loadingReducer: {
                GET_WHOAMI: false,
            },
        };
        render(<AdminAddVehicle />, { preloadedState });
        expect(
            screen.getByRole("button", { name: "Add vehicle" })
        ).toBeDisabled();
        userEvent.type(screen.getByRole("textbox", { name: "Name" }), "Test");
        expect(
            screen.getByRole("button", { name: "Add vehicle" })
        ).toBeEnabled();
    });
});
