import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import { render, screen } from "../test-utils";
import VehiclesList from "./VehiclesList";
import userEvent from "@testing-library/user-event";

const tenantId = "test-tenant";

describe("VehiclesList", () => {
    afterEach(async () => {
        await DataStore.clear();
    });
    it("should list the vehicles. toggle disabled users.", async () => {
        await DataStore.save(
            new models.Vehicle({
                name: "vehicle1",
                manufacturer: "some manufacturer",
                model: "some model",
                tenantId,
            })
        );
        await DataStore.save(
            new models.Vehicle({
                name: "vehicle2",
                tenantId,
            })
        );
        render(<VehiclesList />);
        expect(await screen.findByText("vehicle1")).toBeInTheDocument();
        expect(screen.getByText("vehicle2")).toBeInTheDocument();
        expect(screen.getByText(/some manufacturer/)).toBeInTheDocument();
        expect(screen.getByText(/some model/)).toBeInTheDocument();
    });
    it("filter vehicles.", async () => {
        await DataStore.save(
            new models.Vehicle({
                name: "some vehicle",
                tenantId,
            })
        );
        await DataStore.save(
            new models.Vehicle({
                name: "another vehicle",
                tenantId,
            })
        );
        await DataStore.save(
            new models.Vehicle({
                name: "Woop Woop",
                tenantId,
            })
        );
        render(<VehiclesList />);
        expect(await screen.findByText("some vehicle")).toBeInTheDocument();
        userEvent.type(screen.getByRole("textbox"), "woop");
        expect(screen.queryByText("some vehicle")).toBeNull();
        expect(screen.queryByText("another vehicle")).toBeNull();
        expect(screen.getByText("Woop Woop")).toBeInTheDocument();
    });
    it("observer responds.", async () => {
        render(<VehiclesList />);
        expect(screen.queryByText("Woop Woop")).toBeNull();
        await DataStore.save(
            new models.Vehicle({
                name: "Woop Woop",
                tenantId,
            })
        );
        expect(await screen.findByText("Woop Woop")).toBeInTheDocument();
    });
});
