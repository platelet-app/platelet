import { DataStore } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import VehicleDetail from "./VehicleDetail";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models";
import { render } from "../../../test-utils";
import { userRoles } from "../../../apiConsts";
import { vehicleDetailFields } from "./VehicleProfile";

const testVehicle = {
    manufacturer: "Honda",
    name: "Test Bike",
    model: "CBR1100XX",
    dateOfManufacture: new Date("2020-01-01").toISOString().split("T")[0],
    dateOfRegistration: new Date("2020-02-02").toISOString().split("T")[0],
};

const whoami = new models.User({
    displayName: "whoami",
    roles: [userRoles.admin, userRoles.user],
});

const tenantId = uuidv4();

const preloadedState = {
    whoami: { user: whoami },
    tenantId,
};

describe("VehicleDetail", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        const vehicles = await DataStore.query(models.Vehicle);
        const assigns = await DataStore.query(models.VehicleAssignment);
        await Promise.all(
            [...vehicles, ...assigns].map((item) => DataStore.delete(item))
        );
    });

    it("shows vehicle information", async () => {
        const vehicle = await DataStore.save(new models.Vehicle(testVehicle));
        const querySpy = jest.spyOn(DataStore, "query");
        render(<VehicleDetail vehicleId={vehicle.id} />);
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        expect(querySpy).toHaveBeenCalledWith(models.Vehicle, vehicle.id);
        expect(screen.getByText(vehicle.name)).toBeInTheDocument();
        expect(screen.getByText(vehicle.manufacturer)).toBeInTheDocument();
        expect(screen.getByText(vehicle.model)).toBeInTheDocument();
        expect(screen.getByText(vehicle.dateOfManufacture)).toBeInTheDocument();
        expect(
            screen.getByText(vehicle.dateOfRegistration)
        ).toBeInTheDocument();
    });

    test("change the name", async () => {
        const vehicle = await DataStore.save(new models.Vehicle(testVehicle));
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const more = "more text";
        render(<VehicleDetail vehicleId={vehicle.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Vehicle Name" })
        );
        const textBox = screen.getByRole("textbox", { name: "Name" });
        await waitFor(() => {
            expect(textBox).toHaveValue(vehicle.name);
        });
        userEvent.type(textBox, more);
        expect(textBox).toHaveValue(`${vehicle.name}${more}`);
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...vehicle,
                name: `${vehicle.name}${more}`,
            });
        });
    });

    test("change other details", async () => {
        const vehicle = await DataStore.save(new models.Vehicle(testVehicle));
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        const more = "more text";
        render(<VehicleDetail vehicleId={vehicle.id} />, { preloadedState });
        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledTimes(3);
        });
        userEvent.click(
            screen.getByRole("button", { name: "Edit Vehicle Details" })
        );
        userEvent.type(
            screen.getByRole("textbox", {
                name: vehicleDetailFields.manufacturer,
            }),
            more
        );
        userEvent.type(
            screen.getByRole("textbox", { name: vehicleDetailFields.model }),
            more
        );
        userEvent.click(screen.getByRole("button", { name: "OK" }));
        await waitFor(() => {
            expect(saveSpy).toHaveBeenCalledWith({
                ...vehicle,
                manufacturer: `${vehicle.manufacturer}${more}`,
                model: `${vehicle.model}${more}`,
            });
        });
    });
});
