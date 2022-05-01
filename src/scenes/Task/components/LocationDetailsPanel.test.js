import React from "react";
import LocationDetailsPanel from "./LocationDetailsPanel";
import { DataStore, API } from "aws-amplify";
import { render } from "../../../test-utils";
import { act, screen, waitFor } from "@testing-library/react";
import * as amplify from "aws-amplify";
import userEvent from "@testing-library/user-event";
import * as models from "../../../models/index";
import _ from "lodash";
import { protectedFields } from "../../../apiConsts";
import { v4 as uuidv4 } from "uuid";
import * as mutations from "../../../graphql/mutations";
import * as queries from "../../../graphql/queries";

const errorMessage = "Sorry, something went wrong";

const tenantId = uuidv4();

const preloadedState = {
    tenantId,
    whoami: {
        user: new models.User({ tenantId: "tenant-id", displayName: "test" }),
    },
};

const mockLocations = _.range(0, 10).map((i) => {
    return new models.Location({
        tenantId,
        name: uuidv4(),
        listed: 1,
        contact: {
            telephoneNumber: "01234567890",
            emailAddress: uuidv4(),
            name: uuidv4(),
        },
        ward: uuidv4(),
        line1: uuidv4(),
        line2: uuidv4(),
        town: uuidv4(),
        county: uuidv4(),
        country: uuidv4(),
        postcode: uuidv4(),
        what3words: uuidv4(),
        disabled: 0,
    });
});

describe("LocationDetailsPanel", () => {
    beforeAll(async () => {
        for (const loc of mockLocations) {
            await DataStore.save(loc);
        }
    });
    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    it("renders without crashing", async () => {
        const querySpy = jest.spyOn(DataStore, "query");
        render(<LocationDetailsPanel />, { preloadedState });
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(0));
    });
    it.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("renders the correct title", async ({ locationKey }) => {
        render(<LocationDetailsPanel locationKey={locationKey} />, {
            preloadedState,
        });
        expect(
            screen.getByText(
                locationKey === "pickUpLocation" ? "Collect from" : "Deliver to"
            )
        ).toBeInTheDocument();
    });

    it("renders the correct location name", async () => {
        const mockTask = new models.Task({ pickUpLocation: mockLocations[1] });
        const querySpy = jest.spyOn(DataStore, "query");
        await DataStore.save(mockTask);
        const mockLocation = mockLocations[1];
        render(
            <LocationDetailsPanel
                task={mockTask}
                taskId={mockTask.id}
                locationKey={"pickUpLocation"}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(querySpy).toHaveBeenNthCalledWith(
            1,
            models.Location,
            mockLocation.id
        );
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        expect(screen.getByText(mockLocation.ward)).toBeInTheDocument();
    });

    it.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("expands the location details", async ({ locationKey }) => {
        const mockLocation = mockLocations[0];
        const task = new models.Task({ [locationKey]: mockLocation });
        await DataStore.save(task);
        const querySpy = jest.spyOn(DataStore, "query");
        render(
            <LocationDetailsPanel
                task={task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );

        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));

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
        await DataStore.delete(task);
    });

    test.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("selecting a location from a preset", async ({ locationKey }) => {
        const mockLocation = mockLocations[6];
        const task = new models.Task({});
        await DataStore.save(task);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                task={task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            {
                preloadedState,
            }
        );

        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getByRole("button", { name: "Open" }));
        expect(screen.getByText(mockLocation.name)).toBeInTheDocument();
        userEvent.type(screen.getByRole("textbox"), mockLocation.name);
        userEvent.click(await screen.findByText(mockLocation.name));
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            [locationKey]: mockLocation,
        });
        expect(screen.queryByRole("textbox")).toBeNull();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        expect(
            screen.getByRole("button", { name: "Clear" })
        ).toBeInTheDocument();
    });

    test.skip.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("clear a listed location", async ({ locationKey }) => {
        const task = new models.Task({ [locationKey]: mockLocations[0] });
        await DataStore.save(task);
        const saveSpy = jest.spyOn(DataStore, "save");
        const querySpy = jest.spyOn(DataStore, "query");
        jest.spyOn(amplify, "graphqlOperation").mockReturnValue();
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                getTask: { ...task, _version: 1 },
            },
        });

        render(
            <LocationDetailsPanel
                task={task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(
            screen.getAllByText(mockLocations[0].line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(2));
        expect(saveSpy).toHaveBeenCalledWith({
            ...task,
            [locationKey]: null,
        });
        expect(apiSpy).toHaveBeenNthCalledWith(
            1,
            amplify.graphqlOperation(queries.getTask, {
                id: task.id,
            })
        );
        expect(apiSpy).toHaveBeenNthCalledWith(
            2,
            amplify.graphqlOperation(mutations.updateTask, {
                input: {
                    id: task.id,
                    _version: 1,
                    [`${locationKey}Id`]: null,
                },
            })
        );
        expect(screen.queryByText(mockLocations[0].line1)).toBeNull();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
        expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });

    test.skip.each`
        locationKey
        ${"pickUpLocation"} | ${"dropOffLocation"}
    `("clear a custom location", async ({ locationKey }) => {
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
        const unlisted = await DataStore.save(unlistedLocation);
        const task = new models.Task({ [locationKey]: unlisted });
        await DataStore.save(task);
        const saveSpy = jest.spyOn(DataStore, "save");
        const deleteSpy = jest.spyOn(DataStore, "delete");
        const querySpy = jest.spyOn(DataStore, "query");
        jest.spyOn(amplify, "graphqlOperation").mockReturnValue();
        const apiSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                getTask: { ...task, _version: 1 },
            },
        });

        let clearedLocation = {};
        for (const field of Object.keys(
            _.omit(unlistedLocation, ...protectedFields)
        )) {
            clearedLocation[field] = null;
        }
        clearedLocation = { ...unlistedLocation, ...clearedLocation };
        render(
            <LocationDetailsPanel
                task={task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(
            screen.getAllByText(unlistedLocation.line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByRole("button", { name: "Clear" }));
        const okButton = screen.getByRole("button", { name: "OK" });
        expect(okButton).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
        userEvent.click(okButton);
        await waitFor(() => expect(apiSpy).toHaveBeenCalledTimes(2));
        expect(apiSpy).toHaveBeenNthCalledWith(
            1,
            amplify.graphqlOperation(queries.getTask, {
                id: task.id,
            })
        );
        expect(apiSpy).toHaveBeenNthCalledWith(
            2,
            amplify.graphqlOperation(mutations.updateTask, {
                input: {
                    id: task.id,
                    _version: 1,
                    [`${locationKey}Id`]: null,
                },
            })
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(1, clearedLocation)
        );
        await waitFor(() =>
            expect(saveSpy).toHaveBeenNthCalledWith(2, {
                ...task,
                [locationKey]: null,
            })
        );
        await waitFor(() =>
            expect(deleteSpy).toHaveBeenNthCalledWith(1, unlistedLocation)
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
        const mockListedLocation = mockLocations[0];
        const task = new models.Task({ [locationKey]: mockListedLocation });
        const fakeLocation = new models.Location({
            ...mockListedLocation,
            listed: 0,
            name: `${mockListedLocation.name} (edited)`,
        });
        await DataStore.save(task);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                task={task}
                taskId={task.id}
                locationKey={locationKey}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(
            screen.getAllByText(mockListedLocation.line1)[0]
        ).toBeInTheDocument();
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(mockListedLocation.line1));
        userEvent.type(screen.getByRole("textbox"), "test");
        userEvent.type(screen.getByRole("textbox"), "{enter}");
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(2));
        expect(saveSpy).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                ..._.omit(fakeLocation, "id"),
                line1: `${fakeLocation.line1}test`,
            })
        );
        expect(saveSpy).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                ..._.omit(task, "id"),
                [locationKey]: expect.objectContaining({
                    ..._.omit(fakeLocation, "id"),
                    line1: `${fakeLocation.line1}test`,
                }),
            })
        );
        expect(
            screen.getByText(`${mockListedLocation.name} (edited)`)
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
        const fake = await DataStore.save(fakeModel);
        const mockTask = new models.Task({
            [locationKey]: fake,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                task={mockTask}
                taskId={mockTask.id}
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
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(saveSpy).toHaveBeenCalledWith({
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
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            await DataStore.save(fakeTaskModel);
            render(
                <LocationDetailsPanel
                    task={fakeTaskModel}
                    taskId={fakeTaskModel.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            screen.getByText("Line one").click();
            const textBox = screen.getByRole("textbox", { name: "" });
            expect(textBox).toBeInTheDocument();
            expect(textBox).toHaveValue("");
            userEvent.type(textBox, "new data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(2));
            expect(saveSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    ..._.omit(fakeLocationModel, "id"),
                })
            );
            expect(saveSpy).toHaveBeenCalledWith(
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
        const mockTask = new models.Task({
            [locationKey]: fakeModel,
        });
        await DataStore.save(mockTask);
        const querySpy = jest.spyOn(DataStore, "query");
        const saveSpy = jest.spyOn(DataStore, "save");
        render(
            <LocationDetailsPanel
                task={mockTask}
                taskId={mockTask.id}
                locationKey={locationKey}
            />
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        userEvent.click(screen.getByText("Expand to see more"));
        userEvent.click(screen.getByRole("button", { name: "Edit" }));
        userEvent.click(screen.getByText(fakeModel.contact.name));
        const textBox = screen.getByRole("textbox");
        expect(textBox).toBeInTheDocument();
        expect(textBox).toHaveValue(fakeModel.contact.name);
        userEvent.type(textBox, " new data");
        userEvent.type(textBox, "{enter}");
        await waitFor(() => expect(saveSpy).toHaveBeenCalledTimes(1));
        expect(saveSpy).toHaveBeenCalledWith({
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
                tenantId,
            });
            const fakeTask = new models.Task({
                tenantId,
            });
            await DataStore.save(fakeTask);
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <LocationDetailsPanel
                    task={fakeTask}
                    taskId={fakeTask.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            userEvent.click(screen.getByText("Expand to see more"));
            userEvent.click(screen.getByText("Name"));
            const textBox = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox, "new data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(
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
                expect(saveSpy).toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeTask,
                                [locationKey]: expect.objectContaining(
                                    _.omit(
                                        {
                                            ...fakeModel,
                                            contact: { name: fakeInputData },
                                        },
                                        "id"
                                    )
                                ),
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
                tenantId,
            });
            const fakeModel = new models.Location({
                listed: 0,
                tenantId,
            });
            await DataStore.save(fakeTask);
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <LocationDetailsPanel
                    task={fakeTask}
                    taskId={fakeTask.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            userEvent.click(screen.getByText("Expand to see more"));
            userEvent.click(screen.getByText("Ward"));
            const textBox = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox, "ward data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(
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
                expect(saveSpy).toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining(
                        _.omit(
                            {
                                ...fakeTask,
                                [locationKey]: expect.objectContaining(
                                    _.omit(
                                        {
                                            ...fakeModel,
                                            ward: "ward data",
                                        },
                                        "id"
                                    )
                                ),
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
                expect(saveSpy).toHaveBeenNthCalledWith(
                    3,
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
                tenantId,
            });
            const fakeModel = new models.Location({
                listed: 0,
                tenantId,
            });
            const fakeModel2 = new models.Location({
                listed: 0,
                contact: { name: fakeInputData },
                tenantId,
            });
            await DataStore.save(fakeTask);
            const querySpy = jest.spyOn(DataStore, "query");
            const saveSpy = jest.spyOn(DataStore, "save");
            render(
                <LocationDetailsPanel
                    task={fakeTask}
                    taskId={fakeTask.id}
                    locationKey={locationKey}
                />,
                { preloadedState }
            );
            await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
            userEvent.click(screen.getByText("Expand to see more"));
            userEvent.click(screen.getByText("Name"));
            const textBox2 = screen.getAllByRole("textbox")[1];
            userEvent.type(textBox2, fakeInputData);
            userEvent.type(textBox2, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(
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
                expect(saveSpy).toHaveBeenNthCalledWith(
                    2,
                    expect.objectContaining({
                        ...fakeTask,
                        [locationKey]: expect.objectContaining(
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
                        ),
                    })
                )
            );
            userEvent.click(screen.getByText("Ward"));
            const textBox = screen.getByRole("textbox");
            userEvent.type(textBox, "ward data");
            userEvent.type(textBox, "{enter}");
            await waitFor(() =>
                expect(saveSpy).toHaveBeenNthCalledWith(
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
        const querySpy = jest
            .spyOn(DataStore, "query")
            .mockImplementation(() => {
                throw new Error("error");
            });
        const fakeTask = new models.Task({
            tenantId,
            pickUpLocation: { id: "test" },
        });
        render(
            <LocationDetailsPanel
                task={fakeTask}
                taskId={"fakeId"}
                locationKey={"pickUpLocation"}
            />,
            { preloadedState }
        );
        await waitFor(() => expect(querySpy).toHaveBeenCalledTimes(1));
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
