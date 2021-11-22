import React from "react";
import LocationDetailsPanel from "./LocationDetailsPanel";
import { render } from "../../../test-utils";
import { screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models/index";
import _ from "lodash";

jest.mock("aws-amplify");

jest.mock("../../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));

const mockLocations = [
    {
        name: "Bristol Royal Infirmary",
        listed: 1,
        line1: "Bristol Royal Infirmary",
        line2: "Marlborough Street",
        town: "Bristol",
        county: "Bristol",
        country: "UK",
        postcode: "BS2 8HW",
        what3words: "some.what.words",
        id: "9d27b9a1-e6b7-451d-9a2e-3a8a31579216",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "28a43a33-597d-4623-848e-ae364beb8826",
        },
    },
    {
        name: "Bristol Royal Infirmary - A&E",
        listed: 1,
        ward: "Accident and Emergency",
        line1: "Bristol Royal Infirmary",
        line2: "Marlborough Street",
        town: "Bristol",
        county: "Bristol",
        country: "UK",
        postcode: "BS2 8HW",
        what3words: "some.what.words",
        id: "66642db5-746a-4fb1-8397-db46b634fadb",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "9b346c7d-e579-460b-8106-1866cf139f3c",
        },
    },
    {
        name: "Southmead Hospital - Pathology",
        listed: 1,
        ward: "Pathology",
        line1: "Southmead Hospital",
        line2: "Southmead Road",
        town: "Bristol",
        county: "Bristol",
        country: "UK",
        postcode: "BS10 5NB",
        what3words: "some.what.words",
        id: "38c39ae4-caad-4991-9a2a-66f93c8dd9a5",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "47423e73-f397-4c51-8f79-ef0e80a13969",
        },
    },
    {
        name: "Southmead Hospital - NICU",
        listed: 1,
        ward: "Neonatal Intensive Care",
        line1: "Southmead Hospital",
        line2: "Southmead Road",
        town: "Bristol",
        county: "Bristol",
        country: "UK",
        postcode: "BS10 5NB",
        what3words: "some.what.words",
        id: "db3e3054-61a3-45f5-82c5-15961264f58d",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "927b74e3-6756-42b9-8170-5094cc5b2ad8",
        },
    },
    {
        name: "Callington Road Hospital - Aspen",
        listed: 1,
        ward: "Aspen Unit",
        line1: "Callington Road Hospital",
        line2: "Marmalade Lane",
        town: "Brislington",
        county: "Bristol",
        country: "UK",
        postcode: "BS4 5BJ",
        what3words: "some.what.words",
        id: "3a1af74d-8ede-4539-a7f0-9313b24d4f1f",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "db49640b-2cab-4e20-b230-cf16fb70487e",
        },
    },
    {
        name: "Callington Road Hospital - Silverpine",
        listed: 1,
        ward: "Silverpine Unit",
        line1: "Callington Road Hospital",
        line2: "Marmalade Lane",
        town: "Brislington",
        county: "Bristol",
        country: "UK",
        postcode: "BS4 5BJ",
        what3words: "some.what.words",
        id: "d33d03d9-ed71-4947-8dff-8a76469c5790",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "f87fe8a4-50f3-4b6a-8702-25b46e1a7956",
        },
    },
    {
        name: "Great Western Hospital - A&E",
        listed: 1,
        ward: "Accident and Emergency",
        line1: "Great Western Hospital",
        line2: "Marlborough Road",
        town: "Swindon",
        county: "Swindon",
        country: "UK",
        postcode: "SN3 6BB",
        what3words: "some.what.words",
        id: "645d242f-7835-4392-81e5-ab6cd4fb442d",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "711216d6-54f1-4704-9766-4b67d1a04690",
        },
    },
];

describe("LocationDetailsPanel", () => {
    it("renders without crashing", () => {
        render(<LocationDetailsPanel />);
    });
    it.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("renders the correct title", ({ locationKey }) => {
        render(<LocationDetailsPanel locationKey={locationKey} />);
        expect(
            screen.getByText(
                locationKey === "pickUpLocation" ? "Collect from" : "Deliver to"
            )
        ).toBeInTheDocument();
    });

    it("renders the correct location name", async () => {
        amplify.DataStore.query.mockResolvedValueOnce(mockLocations[1]);
        const mockLocation = mockLocations[1];
        render(
            <LocationDetailsPanel
                locationId={mockLocation.id}
                locationKey={"pickUpLocation"}
            />
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.query).toHaveBeenCalledWith(
            models.Location,
            mockLocation.id
        );
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.ward)).toBeInTheDocument();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("selecting a location from a preset", async ({ locationKey }) => {
        const task = new models.Task({});
        amplify.DataStore.query
            .mockResolvedValueOnce(mockLocations)
            .mockResolvedValue(task);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...task,
            [locationKey]: mockLocations[6],
        });
        render(<LocationDetailsPanel locationKey={locationKey} />);
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        userEvent.click(screen.getByRole("button", { name: "Open" }));
        expect(
            screen.getByText("Bristol Royal Infirmary - A&E")
        ).toBeInTheDocument();
        userEvent.type(screen.getByRole("textbox"), "Great Western Hospital");
        userEvent.click(
            await screen.findByText("Great Western Hospital - A&E")
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...task,
            [locationKey]: mockLocations[6],
        });
        expect(screen.queryByRole("textbox")).toBeNull();
        expect(
            screen.getByRole("button", { name: "Edit" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Clear" })
        ).toBeInTheDocument();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("clear the location", async ({ locationKey }) => {
        const task = new models.Task({ [locationKey]: mockLocations[0] });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockLocations[0])
            .mockResolvedValueOnce(task)
            .mockResolvedValue(mockLocations);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...task,
            [locationKey]: null,
        });
        render(
            <LocationDetailsPanel
                locationId={mockLocations[0].id}
                locationKey={locationKey}
            />
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(
            screen.getAllByText(mockLocations[0].line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...task,
            [locationKey]: null,
        });
        expect(screen.queryByText(mockLocations[0].line1)).toBeNull();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("copy a preset and enable editing", async ({ locationKey }) => {
        const task = new models.Task({ [locationKey]: mockLocations[0] });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockLocations[0])
            .mockResolvedValueOnce(task)
            .mockResolvedValue(mockLocations);
        const fakeContact = new models.AddressAndContactDetails({
            ...mockLocations[0].contact,
        });
        const fakeLocation = new models.Location({
            ...mockLocations[0],
            listed: 0,
            contact: fakeContact,
            name: `Copy of ${mockLocations[0].name}`,
        });
        const fakeTask = new models.Task({
            ...task,
            [locationKey]: fakeLocation,
        });
        amplify.DataStore.save
            .mockResolvedValueOnce(fakeContact)
            .mockResolvedValueOnce(fakeLocation)
            .mockResolvedValueOnce(fakeTask);

        render(
            <LocationDetailsPanel
                locationId={mockLocations[0].id}
                locationKey={locationKey}
            />
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(
            screen.getAllByText(mockLocations[0].line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(3)
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(fakeContact, "id"))
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(fakeLocation, "id"))
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(fakeTask, "id"))
        );
        expect(
            screen.getByText(`Copy of ${mockLocations[0].name}`)
        ).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
    });
    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("edit the details of a location", async ({ locationKey }) => {
        const fakeInputData = "new data";
        const fakeModel = new models.Location({
            ...mockLocations[1],
            listed: 0,
        });
        amplify.DataStore.query.mockResolvedValue(fakeModel);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...fakeModel,
            ward: fakeInputData,
        });
        render(
            <LocationDetailsPanel
                locationId={fakeModel.id}
                locationKey={locationKey}
            />
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        screen.getByText(mockLocations[1].ward).click();
        const textBox = screen.getByRole("textbox");
        expect(textBox).toBeInTheDocument();
        expect(textBox).toHaveValue(mockLocations[1].ward);
        userEvent.type(textBox, " new data");
        userEvent.type(textBox, "{enter}");
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...fakeModel,
            ward: `${fakeModel.ward} ${fakeInputData}`,
        });
    });
});
