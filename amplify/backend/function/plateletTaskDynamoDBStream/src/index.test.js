import { mockClient } from "aws-sdk-client-mock";
import { SQSClient } from "@aws-sdk/client-sqs";
import { handler } from "./index";
import {
    getTenantName,
    getSQSTrackingURL,
    getTenantWebsite,
} from "@platelet-app/lambda";

jest.mock("@platelet-app/lambda", () => ({
    getSQSTrackingURL: jest.fn().mockResolvedValue("trackingURL"),
    getTenantName: jest.fn().mockResolvedValue("someTenantName"),
    getTenantWebsite: jest.fn().mockResolvedValue("someTenantWebsite"),
}));

const sqsMock = mockClient(SQSClient);

describe("plateletTaskDynamoDBStream", () => {
    afterEach(() => {
        sqsMock.reset();
    });
    test("send task data", async () => {
        const result = await handler({
            Records: [
                {
                    dynamodb: {
                        NewImage: {
                            isBeingTracked: { BOOL: true },
                            id: { S: "someId" },
                            timePickedUp: { S: "someTimePickedUp" },
                            timeDroppedOff: { S: "someTimeDroppedOff" },
                        },
                    },
                },
            ],
        });
        expect(sqsMock.call(0)?.args[0]?.input).toMatchInlineSnapshot(`
            {
              "DelaySeconds": 10,
              "MessageAttributes": {
                "Operation": {
                  "DataType": "String",
                  "StringValue": "UPDATE_TRACKING",
                },
              },
              "MessageBody": "{"task":{"timePickedUp":"someTimePickedUp","timeDroppedOff":"someTimeDroppedOff","id":"someId"},"tenantName":"someTenantName","tenantWebsite":"someTenantWebsite"}",
              "QueueUrl": "trackingURL",
            }
        `);
        expect(result).toBe("Successfully processed DynamoDB record");
        expect(getTenantName).toHaveBeenCalledWith(process.env.ENV);
        expect(getTenantWebsite).toHaveBeenCalledWith(process.env.ENV);
        expect(getSQSTrackingURL).toHaveBeenCalledWith();
    });
    test("delete task data", async () => {
        const result = await handler({
            Records: [
                {
                    dynamodb: {
                        NewImage: {
                            isBeingTracked: { BOOL: false },
                            id: { S: "someId" },
                            timePickedUp: { S: "someTimePickedUp" },
                            timeDroppedOff: { S: "someTimeDroppedOff" },
                        },
                    },
                },
            ],
        });
        expect(sqsMock.call(0)?.args[0]?.input).toMatchInlineSnapshot(`
            {
              "DelaySeconds": 10,
              "MessageAttributes": {
                "Operation": {
                  "DataType": "String",
                  "StringValue": "DELETE_TRACKING",
                },
              },
              "MessageBody": "{"id":"someId"}",
              "QueueUrl": "trackingURL",
            }
        `);
        expect(result).toBe("Successfully processed DynamoDB record");
        expect(getTenantName).toHaveBeenCalledWith(process.env.ENV);
        expect(getTenantWebsite).toHaveBeenCalledWith(process.env.ENV);
        expect(getSQSTrackingURL).toHaveBeenCalledWith();
    });
    test("skip delete if no id", async () => {
        const result = await handler({
            Records: [
                {
                    dynamodb: {
                        NewImage: {
                            isBeingTracked: { BOOL: false },
                            timePickedUp: { S: "someTimePickedUp" },
                            timeDroppedOff: { S: "someTimeDroppedOff" },
                        },
                    },
                },
            ],
        });
        expect(sqsMock.call(0)?.args[0]?.input).toMatchInlineSnapshot(
            `undefined`
        );
        expect(result).toBe("Successfully processed DynamoDB record");
        expect(getTenantName).toHaveBeenCalledWith(process.env.ENV);
        expect(getTenantWebsite).toHaveBeenCalledWith(process.env.ENV);
        expect(getSQSTrackingURL).toHaveBeenCalledWith();
    });
    test("skip update if no id", async () => {
        const result = await handler({
            Records: [
                {
                    dynamodb: {
                        NewImage: {
                            isBeingTracked: { BOOL: true },
                            timePickedUp: { S: "someTimePickedUp" },
                            timeDroppedOff: { S: "someTimeDroppedOff" },
                        },
                    },
                },
            ],
        });
        expect(sqsMock.call(0)?.args[0]?.input).toMatchInlineSnapshot(
            `undefined`
        );
        expect(result).toBe("Successfully processed DynamoDB record");
        expect(getTenantName).toHaveBeenCalledWith(process.env.ENV);
        expect(getTenantWebsite).toHaveBeenCalledWith(process.env.ENV);
        expect(getSQSTrackingURL).toHaveBeenCalledWith();
    });
});
