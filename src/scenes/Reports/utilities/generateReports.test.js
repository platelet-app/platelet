import { API, DataStore } from "aws-amplify";
import _ from "lodash";
import {
    commentVisibility,
    deliverableUnits,
    priorities,
    tasksStatus,
    userRoles,
} from "../../../apiConsts";
import * as models from "../../../models";
import generateReportBasic from "./generateReportBasic";

const pickUpLocationData = {
    listed: 1,
    name: "pickup location",
    ward: "pickup ward1",
    line1: "pickup line1",
    line2: "pickup line2",
    line3: "pickup line3",
    town: "pickup town",
    county: "pickup county",
    postcode: "pickup postcode",
    state: "pickup state",
    country: "pickup country",
};
const dropOffLocationData = {
    listed: 1,
    name: "dropoff location",
    ward: "dropoff ward",
    line1: "dropoff line1",
    line2: "dropoff line2",
    line3: "dropoff line3",
    town: "dropoff town",
    county: "dropoff county",
    postcode: "dropoff postcode",
    state: "dropoff state",
    country: "dropoff country",
};

const tenantId = "tenantId";

const locReducer = (acc, [key, value]) => {
    if (key === "listed") return acc;
    acc[key] = value + " 2";
    return acc;
};

describe("generateReports", () => {
    const isoDate = "2021-11-29T23:24:58.987Z";

    beforeEach(() => {
        jest.useFakeTimers("modern");
        jest.setSystemTime(new Date(isoDate));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(async () => {
        jest.restoreAllMocks();
    });

    test("generate a report with ALL tasks", async () => {
        const rider1 = {
            displayName: "Rider 1",
            name: "Rider 1 name",
            roles: [userRoles.rider],
            _deleted: false,
        };
        const rider2 = {
            displayName: "Rider 2",
            name: "Rider 2 name",
            roles: [userRoles.rider],
            _deleted: false,
        };
        const coord = {
            displayName: "Coordinator",
            name: "Coordinator name",
            roles: [userRoles.coordinator],
            _deleted: false,
        };
        const whoami = {
            displayName: "Whoami",
            name: "Whoami name",
            roles: [userRoles.coordinator],
            _deleted: false,
        };
        const [coordAssignee1, coordAssignee2] = [_.range(2)].map((t) => {
            return {
                assignee: whoami,
                role: userRoles.coordinator,
                _deleted: false,
            };
        });
        const riderAssignee1 = {
            assignee: rider1,
            role: userRoles.rider,
            _deleted: false,
        };
        const riderAssignee2 = {
            assignee: rider2,
            role: userRoles.rider,
            _deleted: false,
        };
        const coordAssignee = {
            assignee: coord,
            role: userRoles.coordinator,
            _deleted: false,
        };
        const deletedAssignee = {
            assignee: coord,
            role: userRoles.coordinator,
            _deleted: true,
        };
        const deli1 = { label: "deliverable 1" };
        const deli2 = { label: "deliverable 2" };
        const deli3 = { label: "deliverable 3" };
        const item1 = {
            deliverableType: deli1,
            unit: deliverableUnits.box,
            count: 5,
            _deleted: false,
        };
        const item2 = {
            deliverableType: deli2,
            unit: deliverableUnits.item,
            count: 6,
            _deleted: false,
        };
        const item3 = {
            deliverableType: deli3,
            unit: deliverableUnits.liter,
            count: 7,
            _deleted: false,
        };
        const deletedItem = {
            deliverableType: deli3,
            unit: deliverableUnits.liter,
            count: 7,
            _deleted: true,
        };
        const [comment1, comment2] = ["body 1", "body 2"].map((body) => {
            return {
                _deleted: false,
                body,
                author: rider1,
                visibility: commentVisibility.everyone,
            };
        });
        const commentDeleted = {
            body: "body 3",
            author: rider1,
            visibility: commentVisibility.everyone,
            _deleted: true,
        };
        const commentPrivate = {
            _deleted: false,
            body: "body 4",
            author: rider1,
            visibility: commentVisibility.me,
        };
        const task1 = {
            _deleted: false,
            createdAt: new Date().toISOString(),
            status: tasksStatus.new,
            timeOfCall: new Date().toISOString(),
            requesterContact: {
                name: "some person",
                telephoneNumber: "0121212121",
            },
            assignees: {
                items: [coordAssignee, coordAssignee1, riderAssignee1],
            },
            deliverables: { items: [item1, item2, deletedItem] },
            comments: { items: [comment1, comment2, commentDeleted] },
            priority: priorities.medium,
            dateCreated: new Date().toISOString().split("T")[0],
            isRiderUsingOwnVehicle: 0,
            pickUpLocation: pickUpLocationData,
            dropOffLocation: dropOffLocationData,
            riderResponsibility: "yay rider role",
            timePickedUp: new Date().toISOString(),
            timeDroppedOff: new Date().toISOString(),
            timeRiderHome: new Date().toISOString(),
            timeCancelled: new Date().toISOString(),
        };
        const task2 = {
            _deleted: false,
            createdAt: new Date().toISOString(),
            status: tasksStatus.active,
            timeOfCall: new Date().toISOString(),
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            assignees: {
                items: [coordAssignee2, riderAssignee2, deletedAssignee],
            },
            deliverables: { items: [item3] },
            comments: { items: [commentPrivate] },
            priority: priorities.medium,
            dateCreated: new Date().toISOString().split("T")[0],
            isRiderUsingOwnVehicle: 0,
            pickUpLocation: pickUpLocationData,
            dropOffLocation: dropOffLocationData,
            riderResponsibility: "yay rider role",
            timePickedUp: new Date().toISOString(),
            timeDroppedOff: new Date().toISOString(),
            timeRiderHome: new Date().toISOString(),
            timeRejected: new Date().toISOString(),
        };
        const taskDeleted = {
            _deleted: true,
            createdAt: new Date().toISOString(),
            status: tasksStatus.active,
            timeOfCall: new Date().toISOString(),
            requesterContact: {
                name: "some name",
                telephoneNumber: "01234567890",
            },
            assignees: {
                items: [coordAssignee2, riderAssignee2, deletedAssignee],
            },
            deliverables: { items: [item3] },
            comments: { items: [commentPrivate] },
            priority: priorities.medium,
            dateCreated: new Date().toISOString().split("T")[0],
            isRiderUsingOwnVehicle: 0,
            pickUpLocation: pickUpLocationData,
            dropOffLocation: dropOffLocationData,
            riderResponsibility: "yay rider role",
            timePickedUp: new Date().toISOString(),
            timeDroppedOff: new Date().toISOString(),
            timeRiderHome: new Date().toISOString(),
            timeRejected: new Date().toISOString(),
        };
        const graphqlSpy = jest.spyOn(API, "graphql").mockResolvedValueOnce({
            data: {
                listTasksByTenantId: {
                    items: [task1, task2, taskDeleted],
                    nextToken: null,
                    startedAt: 1620000000000,
                },
            },
        });
        const date = new Date(isoDate);
        const threeDaysAgo = new Date(date);
        threeDaysAgo.setDate(date.getDate() - 3);
        const resultBasic = await generateReportBasic(
            whoami.id,
            "ALL",
            tenantId,
            threeDaysAgo,
            date
        );
        expect(graphqlSpy).toHaveBeenCalledTimes(1);
        const vars = graphqlSpy.mock.calls[0][0];
        expect(vars).toMatchInlineSnapshot(`
            Object {
              "query": "
                query ListTasksByTenantId(
                    $filter: ModelTaskFilterInput
                    $limit: Int
                    $nextToken: String
                    $tenantId: ID!
                    $sortDirection: ModelSortDirection
                    $startDate: String
                    $endDate: String
                ) {
                    listTasksByTenantId(
                        filter: $filter
                        limit: $limit
                        nextToken: $nextToken
                        tenantId: $tenantId
                        sortDirection: $sortDirection
                        createdAt: { between: [$startDate, $endDate] }
                    ) {
                        items {
                            id
                            timeOfCall
                            dateCreated
                            riderResponsibility
                            priority
                            status
                            createdAt
                            assignees {
                                items {
                                    assignee {
                                        id
                                        _deleted
                                        displayName
                                        name
                                    }
                                    role
                                }
                            }
                            pickUpLocation {
                                ward
                                line1
                                line2
                                line3
                                town
                                county
                                state
                                country
                                postcode
                                what3words
                            }
                            dropOffLocation {
                                ward
                                line1
                                line2
                                line3
                                town
                                county
                                state
                                country
                                postcode
                                what3words
                            }
                            deliverables {
                                items {
                                    count
                                    _deleted
                                    deliverableType {
                                        label
                                        icon
                                    }
                                }
                            }
                            comments {
                                items {
                                    id
                                    _deleted
                                    visibility
                                    author {
                                        displayName
                                        name
                                        id
                                    }
                                }
                            }
                            _version
                            _deleted
                            _lastChangedAt
                        }
                        nextToken
                        startedAt
                    }
                }
            ",
              "variables": Object {
                "endDate": "2021-11-30T00:00:00.000Z",
                "nextToken": null,
                "startDate": "2021-11-26T00:00:00.000Z",
                "tenantId": "tenantId",
              },
            }
        `);
        expect(resultBasic).toMatchSnapshot();
    });

    test("generate a report with a role", async () => {
        const rider1 = new models.User({
            displayName: "Rider 1",
            name: "Rider 1 name",
            roles: [userRoles.rider],
        });
        const rider2 = new models.User({
            displayName: "Rider 2",
            name: "Rider 2 name",
            roles: [userRoles.rider],
        });
        const coord = new models.User({
            displayName: "Coordinator",
            name: "Coordinator name",
            roles: [userRoles.coordinator],
        });
        const whoami = new models.User({
            displayName: "Whoami",
            name: "Whoami name",
            roles: [userRoles.coordinator],
        });

        const date = new Date(isoDate);
        const threeDaysAgo = new Date(date);
        threeDaysAgo.setDate(date.getDate() - 3);

        const pickUpLocation1 = await DataStore.save(
            new models.Location(pickUpLocationData)
        );
        const pickUpLocationData2 = Object.entries(pickUpLocationData).reduce(
            locReducer,
            {}
        );
        const pickUpLocation2 = await DataStore.save(
            new models.Location(pickUpLocationData2)
        );
        const dropOffLocationData2 = Object.entries(dropOffLocationData).reduce(
            locReducer,
            {}
        );

        const dropOffLocation1 = await DataStore.save(
            new models.Location(dropOffLocationData)
        );
        const dropOffLocation2 = await DataStore.save(
            new models.Location({ ...dropOffLocationData2, listed: 0 })
        );
        const task1 = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                timeOfCall: new Date().toISOString(),
                requesterContact: {
                    name: "some person",
                    telephoneNumber: "0121212121",
                },
                priority: priorities.medium,
                isRiderUsingOwnVehicle: 0,
                dateCreated: threeDaysAgo.toISOString().split("T")[0],
                pickUpLocation: pickUpLocation1,
                dropOffLocation: dropOffLocation1,
                riderResponsibility: "yay rider role",
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
                timeRiderHome: new Date().toISOString(),
                timeCancelled: new Date().toISOString(),
            })
        );
        const task2 = await DataStore.save(
            new models.Task({
                status: tasksStatus.active,
                timeOfCall: new Date().toISOString(),
                requesterContact: {
                    name: "some name",
                    telephoneNumber: "01234567890",
                },
                priority: priorities.medium,
                dateCreated: threeDaysAgo.toISOString().split("T")[0],
                isRiderUsingOwnVehicle: 1,
                pickUpLocation: pickUpLocation2,
                dropOffLocation: dropOffLocation2,
                riderResponsibility: "some rider role",
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
                timeRiderHome: new Date().toISOString(),
                timeRejected: new Date().toISOString(),
            })
        );
        const task3 = await DataStore.save(
            new models.Task({
                status: tasksStatus.active,
                timeOfCall: new Date().toISOString(),
                requesterContact: {
                    name: "some name",
                    telephoneNumber: "01234567890",
                },
                priority: priorities.medium,
                dateCreated: "2010-01-01",
                isRiderUsingOwnVehicle: 1,
                pickUpLocation: pickUpLocation2,
                dropOffLocation: dropOffLocation2,
                riderResponsibility: "some rider role",
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
                timeRiderHome: new Date().toISOString(),
            })
        );
        const [coordAssignee1, coordAssignee2, coordAssignee3] =
            await Promise.all(
                [task1, task2, task3].map((t) =>
                    DataStore.save(
                        new models.TaskAssignee({
                            task: t,
                            assignee: whoami,
                            role: userRoles.coordinator,
                        })
                    )
                )
            );
        const riderAssignee1 = await DataStore.save(
            new models.TaskAssignee({
                task: task1,
                assignee: rider1,
                role: userRoles.rider,
            })
        );
        const riderAssignee2 = await DataStore.save(
            new models.TaskAssignee({
                task: task2,
                assignee: rider2,
                role: userRoles.rider,
            })
        );
        const coordAssignee = await DataStore.save(
            new models.TaskAssignee({
                task: task1,
                assignee: coord,
                role: userRoles.coordinator,
            })
        );
        const deli1 = await DataStore.save(
            new models.DeliverableType({ label: "deliverable 1" })
        );
        const deli2 = await DataStore.save(
            new models.DeliverableType({ label: "deliverable 2" })
        );
        const deli3 = await DataStore.save(
            new models.DeliverableType({ label: "deliverable 3" })
        );
        const item1 = await DataStore.save(
            new models.Deliverable({
                task: task1,
                deliverableType: deli1,
                unit: deliverableUnits.box,
                count: 5,
            })
        );
        const item2 = await DataStore.save(
            new models.Deliverable({
                task: task2,
                deliverableType: deli2,
                unit: deliverableUnits.item,
                count: 6,
            })
        );
        const item3 = await DataStore.save(
            new models.Deliverable({
                task: task1,
                deliverableType: deli3,
                unit: deliverableUnits.liter,
                count: 7,
            })
        );
        const [comment1, comment2] = await Promise.all(
            ["body 1", "body 2"].map((body) =>
                DataStore.save(
                    new models.Comment({
                        body,
                        parentId: task1.id,
                        author: rider1,
                        visibility: commentVisibility.everyone,
                    })
                )
            )
        );

        const resultBasic = await generateReportBasic(
            whoami.id,
            userRoles.coordinator,
            tenantId,
            threeDaysAgo,
            date
        );
        expect(resultBasic).toMatchSnapshot();
    });
    test.only("generate report network failure", async () => {
        jest.spyOn(API, "graphql").mockRejectedValue("some error");
        await expect(
            generateReportBasic(
                "someid",
                "ALL",
                tenantId,
                new Date(),
                new Date()
            )
        ).rejects.toEqual("some error");
    });
    test.only("generate report graphql failure", async () => {
        jest.spyOn(API, "graphql").mockRejectedValue({
            errors: [{ message: "some error" }],
        });
        await expect(
            generateReportBasic(
                "someid",
                "ALL",
                tenantId,
                new Date(),
                new Date()
            )
        ).rejects.toEqual({ errors: [{ message: "some error" }] });
    });
});
