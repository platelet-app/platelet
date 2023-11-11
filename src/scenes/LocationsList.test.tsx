import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../models";
import { render, screen } from "../test-utils";
import LocationsList from "./LocationsList";
import userEvent from "@testing-library/user-event";

const tenantId = "test-tenant";

describe("LocationsList", () => {
    afterEach(async () => {
        await DataStore.clear();
    });
    it("should list the location. toggle disabled location.", async () => {
        await DataStore.save(
            new models.Location({
                name: "location1",
                tenantId,
                listed: 1,
            })
        );
        await DataStore.save(
            new models.Location({
                name: "location2",
                tenantId,
                listed: 1,
            })
        );
        await DataStore.save(
            new models.Location({
                name: "disabled location",
                tenantId,
                disabled: 1,
                listed: 1,
            })
        );
        await DataStore.save(
            new models.Location({
                name: "unlisted location",
                tenantId,
                listed: 0,
            })
        );
        render(<LocationsList />);
        expect(await screen.findByText("location1")).toBeInTheDocument();
        expect(screen.getByText("location2")).toBeInTheDocument();
        expect(screen.queryByText("disabled location")).toBeNull();
        expect(screen.queryByText("unlisted location")).toBeNull();
        userEvent.click(
            screen.getByRole("checkbox", { name: "Show disabled" })
        );
        expect(screen.getByText("disabled location")).toBeInTheDocument();
    });
    it("filter locations.", async () => {
        await DataStore.save(
            new models.Location({
                name: "some location",
                tenantId,
                listed: 1,
            })
        );
        await DataStore.save(
            new models.Location({
                name: "another place",
                tenantId,
                listed: 1,
            })
        );
        await DataStore.save(
            new models.Location({
                name: "Woop Woop",
                listed: 1,
                tenantId,
            })
        );
        render(<LocationsList />);
        expect(await screen.findByText("some location")).toBeInTheDocument();
        userEvent.type(screen.getByRole("textbox"), "woop");
        expect(screen.queryByText("some location")).toBeNull();
        expect(screen.queryByText("another place")).toBeNull();
        expect(screen.getByText("Woop Woop")).toBeInTheDocument();
    });
    it("observer responds.", async () => {
        render(<LocationsList />);
        expect(screen.queryByText("Woop Woop")).toBeNull();
        await DataStore.save(
            new models.Location({
                name: "Woop Woop",
                tenantId,
                listed: 1,
            })
        );
        expect(await screen.findByText("Woop Woop")).toBeInTheDocument();
    });
});
