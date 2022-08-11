import { DataStore } from "aws-amplify";
import VehicleDetail from "./VehicleDetail";
import { screen, userEvent, waitFor } from "@testing-library/react";
import * as models from "../../../models";
import { render } from "../../../test-utils";

describe("VehicleDetail", () => {
    it("shows vehicle information", async () => {
        const vehicle = await DataStore.save(
            new models.Vehicle({
                manufacturer: "Honda",
                name: "Test Bike",
                model: "CBR1100XX",
                dateOfManufacture: new Date("2020-01-01")
                    .toISOString()
                    .split("T")[0],
                dateOfRegistration: new Date("2020-02-02")
                    .toISOString()
                    .split("T")[0],
            })
        );
        const querySpy = jest.spyOn(DataStore, "query");
        render(<VehicleDetail vehicleId={vehicle.id} />);

        await waitFor(() => {
            expect(querySpy).toHaveBeenCalledWith(models.Vehicle, vehicle.id);
        });
        expect(screen.getByText(vehicle.name)).toBeInTheDocument();
        expect(screen.getByText(vehicle.manufacturer)).toBeInTheDocument();
        expect(screen.getByText(vehicle.model)).toBeInTheDocument();
        expect(screen.getByText(vehicle.dateOfManufacture)).toBeInTheDocument();
        expect(
            screen.getByText(vehicle.dateOfRegistration)
        ).toBeInTheDocument();
    });
});
