import { DataStore } from "aws-amplify";
import {
    commentVisibility,
    deliverableUnits,
    priorities,
    tasksStatus,
    userRoles,
} from "../../../apiConsts";
import * as models from "../../../models";
import { v4 as uuidv4 } from "uuid";
import generateReport from "./generateReport";

const locationFields = {
    listed: 1,
    name: null,
    ward: null,
    line1: null,
    line2: null,
    line3: null,
    town: null,
    county: null,
    postcode: null,
    state: null,
    country: null,
};

const getLocFields = () =>
    Object.keys(locationFields).reduce(
        (acc, key) => ({ ...acc, [key]: locationFields[key] || uuidv4() }),
        locationFields
    );

describe("generateReports", () => {
    test("generate a report", async () => {
        const rider1 = new models.User({
            displayName: uuidv4(),
            name: uuidv4(),
            roles: [userRoles.rider],
        });
        const rider2 = new models.User({
            displayName: uuidv4(),
            name: uuidv4(),
            roles: [userRoles.rider],
        });
        const whoami = new models.User({
            displayName: uuidv4(),
            name: uuidv4(),
            roles: [userRoles.coordinator],
        });
        const pickUpLocationData = getLocFields();
        const pickUpLocationData2 = getLocFields();

        const pickUpLocation1 = await DataStore.save(
            new models.Location(pickUpLocationData)
        );
        const pickUpLocation2 = await DataStore.save(
            new models.Location(pickUpLocationData2)
        );
        const dropOffLocationData = Object.keys(locationFields).reduce(
            (acc, key) => ({ ...acc, [key]: locationFields[key] || uuidv4() }),
            locationFields
        );
        const dropOffLocationData2 = Object.keys(locationFields).reduce(
            (acc, key) => ({ ...acc, [key]: locationFields[key] || uuidv4() }),
            locationFields
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
                    name: uuidv4(),
                    telephoneNumber: uuidv4(),
                },
                priority: priorities.medium,
                isRiderUsingOwnVehicle: 0,
                pickUpLocation: pickUpLocation1,
                dropOffLocation: dropOffLocation1,
                riderResponsibility: uuidv4(),
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
                    name: uuidv4(),
                    telephoneNumber: uuidv4(),
                },
                priority: priorities.medium,
                isRiderUsingOwnVehicle: 1,
                pickUpLocation: pickUpLocation2,
                dropOffLocation: dropOffLocation2,
                riderResponsibility: uuidv4(),
                timePickedUp: new Date().toISOString(),
                timeDroppedOff: new Date().toISOString(),
                timeRiderHome: new Date().toISOString(),
            })
        );
        const [coordAssignee1, coordAssignee2] = await Promise.all(
            [task1, task2].map((t) =>
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
        const deli1 = await DataStore.save(
            new models.DeliverableType({ label: uuidv4() })
        );
        const deli2 = await DataStore.save(
            new models.DeliverableType({ label: uuidv4() })
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
        const [comment1, comment2] = await Promise.all(
            [uuidv4(), uuidv4()].map((body) =>
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
        // I don't know why I did this
        const expected = `id,createdAt,isRiderUsingOwnVehicle,timeOfCall,priority,status,riderResponsibility,timePickedUp,timeDroppedOff,timeRiderHome,pickUpLocation_ward,pickUpLocation_line1,pickUpLocation_line2,pickUpLocation_line3,pickUpLocation_town,pickUpLocation_county,pickUpLocation_state,pickUpLocation_country,pickUpLocation_postcode,dropOffLocation_ward,dropOffLocation_line1,dropOffLocation_line2,dropOffLocation_line3,dropOffLocation_town,dropOffLocation_county,dropOffLocation_state,dropOffLocation_country,dropOffLocation_postcode,requesterContact_name,requesterContact_telephoneNumber,comment_0_id,comment_0_createdAt,comment_0_author,comment_0_body,comment_1_id,comment_1_createdAt,comment_1_author,comment_1_body,item_0_id,item_0_createdAt,item_0_label,item_0_count,item_0_unit,assignee_0_id,assignee_0_createdAt,assignee_0_displayName,assignee_0_name,assignee_0_role,assignee_1_id,assignee_1_createdAt,assignee_1_displayName,assignee_1_name,assignee_1_role
${task1.id},${task1.createdAt || ""},${!!task1.isRiderUsingOwnVehicle},${
            task1.timeOfCall
        },${task1.priority},${task1.status},${task1.riderResponsibility},${
            task1.timePickedUp
        },${task1.timeDroppedOff},${task1.timeRiderHome},${
            task1.pickUpLocation.ward
        },${task1.pickUpLocation.line1},${task1.pickUpLocation.line2},${
            task1.pickUpLocation.line3
        },${task1.pickUpLocation.town},${task1.pickUpLocation.county},${
            task1.pickUpLocation.state
        },${task1.pickUpLocation.country},${task1.pickUpLocation.postcode},${
            task1.dropOffLocation.ward
        },${task1.dropOffLocation.line1},${task1.dropOffLocation.line2},${
            task1.dropOffLocation.line3
        },${task1.dropOffLocation.town},${task1.dropOffLocation.county},${
            task1.dropOffLocation.state
        },${task1.dropOffLocation.country},${task1.dropOffLocation.postcode},${
            task1.requesterContact.name
        },${task1.requesterContact.telephoneNumber},${comment1.id},${
            comment1.createdAt || ""
        },${comment1.author.displayName},${comment1.body},${comment2.id},${
            comment2.createdAt || ""
        },${comment2.author.displayName},${comment2.body},${item1.id},${
            item1.createdAt || ""
        },${item1.deliverableType.label},${item1.count},${item1.unit},${
            coordAssignee1.id
        },${coordAssignee1.createdAt || ""},${
            coordAssignee1.assignee.displayName
        },${coordAssignee1.assignee.name},${coordAssignee1.role},${
            riderAssignee1.id
        },${riderAssignee1.createdAt || ""},${
            riderAssignee1.assignee.displayName
        },${riderAssignee1.assignee.name},${riderAssignee1.role}
${task2.id},${task2.createdAt || ""},${!!task2.isRiderUsingOwnVehicle},${
            task2.timeOfCall
        },${task2.priority},${task2.status},${task2.riderResponsibility},${
            task2.timePickedUp
        },${task2.timeDroppedOff},${task2.timeRiderHome},${
            task2.pickUpLocation.ward
        },${task2.pickUpLocation.line1},${task2.pickUpLocation.line2},${
            task2.pickUpLocation.line3
        },${task2.pickUpLocation.town},${task2.pickUpLocation.county},${
            task2.pickUpLocation.state
        },${task2.pickUpLocation.country},${task2.pickUpLocation.postcode},${
            task2.dropOffLocation.ward
        },${task2.dropOffLocation.line1},${task2.dropOffLocation.line2},${
            task2.dropOffLocation.line3
        },${task2.dropOffLocation.town},${task2.dropOffLocation.county},${
            task2.dropOffLocation.state
        },${task2.dropOffLocation.country},${task2.dropOffLocation.postcode},${
            task2.requesterContact.name
        },${task2.requesterContact.telephoneNumber},,,,,,,,,${item2.id},${
            item2.createdAt || ""
        },${item2.deliverableType.label},${item2.count},${item2.unit},${
            coordAssignee2.id
        },${coordAssignee2.createdAt || ""},${
            coordAssignee2.assignee.displayName
        },${coordAssignee2.assignee.name},${coordAssignee2.role},${
            riderAssignee2.id
        },${riderAssignee2.createdAt || ""},${
            riderAssignee2.assignee.displayName
        },${riderAssignee2.assignee.name},${riderAssignee2.role}`;

        const result = await generateReport(
            whoami.id,
            userRoles.coordinator,
            3
        );
        expect(result).toBe(expected);
    });
});
