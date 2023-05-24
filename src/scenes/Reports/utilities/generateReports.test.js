import { DataStore } from "aws-amplify";
import {
    commentVisibility,
    deliverableUnits,
    priorities,
    tasksStatus,
    userRoles,
} from "../../../apiConsts";
import * as models from "../../../models";
import generateReport from "./generateReport";
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

    test("generate a report", async () => {
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
});
