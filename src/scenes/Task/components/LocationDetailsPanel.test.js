import React from "react";
import LocationDetailsPanel from "./LocationDetailsPanel";
import { render } from "../../../test-utils";
import { act, screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models/index";
import _ from "lodash";
import { protectedFields } from "../../../apiConsts";

jest.mock("aws-amplify");

jest.mock("../../../redux/Selectors", () => ({
    dataStoreReadyStatusSelector: () => true,
}));
const errorMessage = "Sorry, something went wrong";

const preloadedState = {
    tenantId: "tenant-id",
    whoami: {
        user: new models.User({ tenantId: "tenant-id", displayName: "test" }),
    },
};

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
        tenantId: "tenant-id",
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
        tenantId: "tenant-id",
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
        tenantId: "tenant-id",
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
        tenantId: "tenant-id",
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
        tenantId: "tenant-id",
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
        tenantId: "tenant-id",
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
        tenantId: "tenant-id",
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: "fake@email.com",
            name: "Someone Person",
            id: "711216d6-54f1-4704-9766-4b67d1a04690",
        },
    },
];

describe("LocationDetailsPanel", () => {
    it("renders without crashing", async () => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<LocationDetailsPanel />, { preloadedState });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
    });
    it.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("renders the correct title", async ({ locationKey }) => {
        amplify.DataStore.query.mockResolvedValue([]);
        render(<LocationDetailsPanel locationKey={locationKey} />, {
            preloadedState,
        });
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
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
            />,
            { preloadedState }
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

    it("expands the location details", async () => {
        const mockLocation = {
            name: "Bristol Royal Infirmary - A&E",
            listed: 1,
            ward: "Accident and Emergency",
            line1: "Bristol Royal Infirmary",
            line2: "Marlborough Street",
            town: "Unique Town",
            county: "Some County",
            country: "UK",
            postcode: "BS2 8HW",
            what3words: "some.what.words",
            id: "66642db5-746a-4fb1-8397-db46b634fadb",
            tenantId: "tenant-id",
            contact: {
                telephoneNumber: "01234567890",
                name: "Someone Person",
                id: "9b346c7d-e579-460b-8106-1866cf139f3c",
            },
        };
        amplify.DataStore.query.mockResolvedValue(mockLocation);
        render(
            <LocationDetailsPanel
                locationId={mockLocation.id}
                locationKey={"pickUpLocation"}
            />,
            { preloadedState }
        );

        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );

        userEvent.click(screen.getByText("Expand to see more"));
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.ward)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.line1)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.line2)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.town)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.county)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.country)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.postcode)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.contact.name)).toBeInTheDocument();
        expect(
            screen.getByText(mockLocation.contact.telephoneNumber)
        ).toBeInTheDocument();
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
        render(<LocationDetailsPanel locationKey={locationKey} />, {
            preloadedState,
        });

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
    `("clear a listed location", async ({ locationKey }) => {
        const task = new models.Task({ [locationKey]: mockLocations[0] });
        amplify.DataStore.query
            .mockResolvedValueOnce(mockLocations[0])
            .mockResolvedValueOnce(task)
            .mockResolvedValue(mockLocations[0]);
        const dummyLocation = new models.Location({});
        amplify.DataStore.save
            .mockResolvedValueOnce(dummyLocation)
            .mockResolvedValueOnce({ ...task, [locationKey]: dummyLocation })
            .mockResolvedValueOnce({ ...task, [locationKey]: null });
        amplify.DataStore.delete.mockResolvedValueOnce(dummyLocation);
        render(
            <LocationDetailsPanel
                locationId={mockLocations[0].id}
                locationKey={locationKey}
            />,
            { preloadedState }
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
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(3)
        );
        await waitFor(() =>
            expect(amplify.DataStore.delete).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.delete).toHaveBeenCalledWith(dummyLocation);
        expect(amplify.DataStore.save).toHaveBeenCalledWith(
            expect.objectContaining(_.omit(dummyLocation, "id"))
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...task,
            [locationKey]: dummyLocation,
        });
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
    `("clear a custom location", async ({ locationKey }) => {
        const task = new models.Task({ [locationKey]: mockLocations[0] });
        const unlistedLocation = new models.Location({
            name: "Custom location",
            line1: "Custom line 1",
            line2: "Custom line 2",
            town: "Custom town",
            county: "Custom county",
            country: "Custom country",
            postcode: "Custom postcode",
            contact: {
                name: "Custom contact name",
                telephoneNumber: "Custom telephone number",
                emailAddress: "Custom email address",
            },
            listed: 0,
        });
        amplify.DataStore.query
            .mockResolvedValueOnce(unlistedLocation)
            .mockResolvedValueOnce(task)
            .mockResolvedValue(unlistedLocation);

        let clearedLocation = {};
        for (const field of Object.keys(
            _.omit(unlistedLocation, ...protectedFields)
        )) {
            clearedLocation[field] = null;
        }
        clearedLocation = { ...unlistedLocation, ...clearedLocation };
        amplify.DataStore.save
            .mockResolvedValueOnce(clearedLocation)
            .mockResolvedValueOnce({ ...task, [locationKey]: null });
        amplify.DataStore.delete.mockResolvedValueOnce(clearedLocation);
        render(
            <LocationDetailsPanel
                locationId={mockLocations[0].id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(
            screen.getAllByText(unlistedLocation.line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() =>
            expect(amplify.DataStore.delete).toHaveBeenNthCalledWith(
                1,
                unlistedLocation
            )
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                1,
                clearedLocation
            )
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenNthCalledWith(2, {
                ...task,
                [locationKey]: null,
            })
        );
        expect(screen.queryByText(mockLocations[0].line1)).toBeNull();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("copy a preset and enable editing", async ({ locationKey }) => {
        const fakeListedLocation = new models.Location({
            ...mockLocations[0],
            listed: 1,
        });
        const task = new models.Task({ [locationKey]: fakeListedLocation });
        amplify.DataStore.query
            .mockResolvedValueOnce(fakeListedLocation)
            .mockResolvedValueOnce(fakeListedLocation)
            .mockResolvedValueOnce(task)
            .mockResolvedValue(mockLocations);
        const fakeLocation = new models.Location({
            ...fakeListedLocation,
            listed: 0,
            name: `Copy of ${mockLocations[0].name}`,
        });
        const fakeTask = new models.Task({
            ...task,
            [locationKey]: fakeLocation,
        });
        amplify.DataStore.save
            .mockResolvedValueOnce(fakeLocation)
            .mockResolvedValueOnce(fakeTask)
            .mockResolvedValueOnce({
                ...fakeLocation,
                listed: 0,
                name: `Copy of ${mockLocations[0].name}`,
            });

        render(
            <LocationDetailsPanel
                locationId={mockLocations[0].id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(
            screen.getAllByText(mockLocations[0].line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getAllByText(mockLocations[0].line1)[1]);
        userEvent.type(screen.getByRole("textbox"), "test");
        userEvent.type(screen.getByRole("textbox"), "{enter}");
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(2)
        );
        expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                ..._.omit(fakeLocation, "id"),
                line1: `${fakeLocation.line1}test`,
            })
        );
        expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining(_.omit(fakeTask, "id"))
        );
        expect(
            screen.getByText(`Copy of ${mockLocations[0].name}`)
        ).toBeInTheDocument();
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
            />,
            { preloadedState }
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(mockLocations[1].ward));
        const textBox = screen.getByRole("textbox");
        expect(textBox).toBeInTheDocument();
        expect(textBox).toHaveValue(mockLocations[1].ward);
        userEvent.type(textBox, " new data");
        userEvent.type(textBox, "{enter}");
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(2)
        );
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...fakeModel,
            ward: `${fakeModel.ward} ${fakeInputData}`,
        });
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "edit the location information when location is null",
        async ({ locationKey }) => {
            const fakeLocationModel = new models.Location({
                line1: "new data",
                listed: 0,
            });
            const fakeTaskModel = new models.Task({});
            amplify.DataStore.query
                .mockResolvedValueOnce(mockLocations)
                .mockResolvedValue(fakeTaskModel);
            amplify.DataStore.save.mockResolvedValue({
                ...fakeLocationModel,
            });
            render(
                <LocationDetailsPanel
                    locationId={null}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            screen.getByText("Line one").click();
            const textBox = screen.getByRole("textbox", { name: "" });
            expect(textBox).toBeInTheDocument();
            expect(textBox).toHaveValue("");
            userEvent.type(textBox, "new data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenCalledTimes(2)
            );
            expect(amplify.DataStore.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    ..._.omit(fakeLocationModel, "id"),
                })
            );
            expect(amplify.DataStore.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    ..._.omit(fakeTaskModel, "id"),
                    [locationKey]: expect.objectContaining({
                        ..._.omit(fakeLocationModel, "id"),
                    }),
                })
            );
        }
    );

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("edit the contact information of a location", async ({ locationKey }) => {
        const fakeInputData = "new data";
        const fakeModel = new models.Location({
            ...mockLocations[1],
            listed: 0,
        });
        amplify.DataStore.query.mockResolvedValue(fakeModel);
        amplify.DataStore.save.mockResolvedValueOnce({
            ...fakeModel,
            contact: { name: fakeInputData },
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
        userEvent.click(screen.getByText("Expand to see more"));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(fakeModel.contact.name));
        const textBox = screen.getByRole("textbox");
        expect(textBox).toBeInTheDocument();
        expect(textBox).toHaveValue(fakeModel.contact.name);
        userEvent.type(textBox, " new data");
        userEvent.type(textBox, "{enter}");
        await waitFor(() =>
            expect(amplify.DataStore.save).toHaveBeenCalledTimes(1)
        );
        expect(amplify.DataStore.save).toHaveBeenCalledWith({
            ...fakeModel,
            contact: {
                ...fakeModel.contact,
                name: `${fakeModel.contact.name} ${fakeInputData}`,
            },
        });
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "add contact information to an empty location",
        async ({ locationKey }) => {
            const fakeInputData = "new data";
            const fakeModel = new models.Location({
                listed: 0,
                tenantId: "tenant-id",
            });
            const fakeTask = new models.Task({
                tenantId: "tenant-id",
            });
            amplify.DataStore.query
                .mockResolvedValue([])
                .mockResolvedValue(fakeTask);
            amplify.DataStore.save
                .mockResolvedValueOnce({
                    ...fakeModel,
                    contact: { name: fakeInputData },
                })
                .mockResolvedValue({
                    ...fakeTask,
                    [locationKey]: {
                        ...fakeModel,
                        ward: "ward data",
                    },
                });
            render(
                <LocationDetailsPanel
                    locationId={null}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() =>
                expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
            );
            userEvent.click(screen.getByText("Expand to see more"));
            userEvent.click(screen.getByText("Name"));
            const textBox = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox, "new data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    1,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeModel,
                                contact: { name: fakeInputData },
                            },
                            "id"
                        )
                    )
                )
            );
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeTask,
                                [locationKey]: {
                                    ...fakeModel,
                                    contact: { name: fakeInputData },
                                },
                            },
                            "id"
                        )
                    )
                )
            );
        }
    );

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "add address information then contact information to an empty location",
        async ({ locationKey }) => {
            const fakeInputData = "new data";
            const fakeTask = new models.Task({
                tenantId: "tenant-id",
            });
            const fakeModel = new models.Location({
                listed: 0,
                tenantId: "tenant-id",
            });
            amplify.DataStore.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce(fakeTask)
                .mockResolvedValue(fakeModel);
            amplify.DataStore.save
                .mockResolvedValueOnce({
                    ...fakeModel,
                    ward: "ward data",
                })
                .mockResolvedValue({
                    ...fakeTask,
                    [locationKey]: {
                        ...fakeModel,
                        ward: "ward data",
                    },
                })
                .mockResolvedValue({
                    ...fakeModel,
                    contact: { name: fakeInputData },
                });
            render(
                <LocationDetailsPanel
                    locationId={null}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() =>
                expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
            );
            userEvent.click(screen.getByText("Expand to see more"));
            userEvent.click(screen.getByText("Ward"));
            const textBox = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox, "ward data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    1,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeModel,
                                ward: "ward data",
                            },
                            "id"
                        )
                    )
                )
            );
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeTask,
                                [locationKey]: {
                                    ...fakeModel,
                                    ward: "ward data",
                                },
                            },
                            "id"
                        )
                    )
                )
            );
            userEvent.click(screen.getByText("Name"));
            const textBox2 = screen.getByRole("textbox");
            userEvent.type(textBox2, fakeInputData);
            userEvent.type(textBox2, "{enter}");
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(3, {
                    ...fakeModel,
                    contact: {
                        ...fakeModel.contact,
                        name: `${fakeInputData}`,
                    },
                })
            );
        }
    );

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `(
        "add contact information then address information to an empty location",
        async ({ locationKey }) => {
            const fakeInputData = "new data";
            const fakeTask = new models.Task({
                tenantId: "tenant-id",
            });
            const fakeModel = new models.Location({
                listed: 0,
                tenantId: "tenant-id",
            });
            const fakeModel2 = new models.Location({
                listed: 0,
                contact: { name: fakeInputData },
                tenantId: "tenant-id",
            });
            amplify.DataStore.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce(fakeTask)
                .mockResolvedValueOnce(fakeModel2)
                .mockResolvedValueOnce(fakeTask)
                .mockResolvedValue({
                    ...fakeModel,
                    contact: { name: fakeInputData },
                });
            amplify.DataStore.save
                .mockResolvedValueOnce({
                    ...fakeModel,
                    contact: { name: fakeInputData },
                })
                .mockResolvedValueOnce({
                    ...fakeTask,
                    [locationKey]: {
                        ...fakeModel,
                        contact: { name: fakeInputData },
                    },
                })
                .mockResolvedValue({
                    ...fakeModel,
                    contact: { name: fakeInputData },
                    ward: "ward data",
                });
            render(
                <LocationDetailsPanel
                    locationId={null}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() =>
                expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
            );
            userEvent.click(screen.getByText("Expand to see more"));
            userEvent.click(screen.getByText("Name"));
            const textBox2 = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox2, fakeInputData);
            userEvent.type(textBox2, "{enter}");
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    1,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeModel,
                                contact: {
                                    ...fakeModel.contact,
                                    name: `${fakeInputData}`,
                                },
                            },
                            "id"
                        )
                    )
                )
            );
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining({
                        ...fakeTask,
                        [locationKey]: {
                            ...fakeModel,
                            contact: {
                                ...fakeModel.contact,
                                name: `${fakeInputData}`,
                            },
                        },
                    })
                )
            );
            userEvent.click(screen.getByText("Ward"));
            const textBox = screen.getByRole("textbox");
            userEvent.type(textBox, "ward data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(amplify.DataStore.save).toHaveBeenNthCalledWith(
                    3,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeModel,
                                contact: { name: fakeInputData },
                                ward: "ward data",
                            },
                            "id"
                        )
                    )
                )
            );
        }
    );

    test("error on location get", async () => {
        const fakeError = new Error("fake error");
        amplify.DataStore.query.mockRejectedValue(fakeError);
        render(
            <LocationDetailsPanel
                locationId={"fakeId"}
                locationKey={"pickUpLocation"}
            />,
            { preloadedState }
        );
        await waitFor(() =>
            expect(amplify.DataStore.query).toHaveBeenCalledTimes(1)
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
