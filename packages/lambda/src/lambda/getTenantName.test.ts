import { mockClient } from "aws-sdk-client-mock";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { getTenantName } from "./getTenantName.js";

const sesMock = mockClient(SSMClient);
const mockResponse = { Parameter: { Value: "someURL" } };

describe("getTenantName", () => {
    test("get the tracking URL", async () => {
        sesMock.on(GetParameterCommand).resolves(mockResponse);
        const result = await getTenantName("dev");
        expect(result).toBe("someURL");
        expect(sesMock.call(0).args[0]?.input).toMatchInlineSnapshot(`
            {
              "Name": "/platelet-supporting-cdk/dev/TenantName",
            }
        `);
    });
    test("return undefined if not found", async () => {
        const rejectMock = {
            name: "ParameterNotFound",
        };
        sesMock.on(GetParameterCommand).rejects(rejectMock);
        const result = await getTenantName("dev");
        expect(result).toBe(undefined);
    });
    test("throw if anything else", async () => {
        const rejectMock = new Error("wew");
        sesMock.on(GetParameterCommand).rejects(rejectMock);
        await expect(getTenantName("dev")).rejects.toThrow();
    });
});
