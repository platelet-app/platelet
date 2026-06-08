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
    getTenantName: jest.fn().mockResolvedValue("tenantName"),
    getTenantWebsite: jest.fn().mockResolvedValue("tenantWebsite"),
}));

const sqsMock = mockClient(SQSClient);

describe("plateletAdminSendTrackingLink", () => {
    test("send a tracking link", async () => {
        const result = await handler({ arguments: { something: "message" } });
        expect(sqsMock.call(0).args[0].input).toMatchInlineSnapshot(`
            {
              "DelaySeconds": 10,
              "MessageAttributes": {
                "Operation": {
                  "DataType": "String",
                  "StringValue": "SEND_TRACKING_LINK",
                },
              },
              "MessageBody": "{"something":"message","tenantName":"tenantName","tenantWebsite":"tenantWebsite"}",
              "QueueUrl": "trackingURL",
            }
        `);
        expect(result).toBe(true);
        expect(getTenantName).toHaveBeenCalledWith(process.env.ENV);
        expect(getTenantWebsite).toHaveBeenCalledWith(process.env.ENV);
        expect(getSQSTrackingURL).toHaveBeenCalledWith();
    });
});
