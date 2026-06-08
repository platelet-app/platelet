import { mockClient } from "aws-sdk-client-mock";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { getTenantWebsite } from "./getTenantWebsite.js";

const sesMock = mockClient(SSMClient);
const mockResponse = { Parameter: { Value: "someURL" } };

describe("getTenantWebsite", () => {
    test("get the tracking URL", async () => {
        sesMock.on(GetParameterCommand).resolves(mockResponse);
        const result = await getTenantWebsite("dev");
        expect(result).toBe("someURL");
        expect(sesMock.call(0).args[0]?.input).toMatchInlineSnapshot(`
            {
              "Name": "/platelet-supporting-cdk/dev/TenantWebsite",
            }
        `);
    });
    test("return undefined if not found", async () => {
        const rejectMock = {
            name: "ParameterNotFound",
        };
        sesMock.on(GetParameterCommand).rejects(rejectMock);
        const result = await getTenantWebsite("dev");
        expect(result).toBe(undefined);
    });
    test("throw if anything else", async () => {
        const rejectMock = new Error("wew");
        sesMock.on(GetParameterCommand).rejects(rejectMock);
        await expect(getTenantWebsite("dev")).rejects.toThrow();
    });
});
