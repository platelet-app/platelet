import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export const getTenantName = async (envName: string) => {
    const client = new SSMClient();
    const parameterName = `/platelet-supporting-cdk/${envName}/TenantName`;
    const params = {
        Name: parameterName,
    };
    const command = new GetParameterCommand(params);
    try {
        const response = await client.send(command);

        // The value is nested under Parameter.Value
        return response.Parameter?.Value;
    } catch (error) {
        if (error.name === "ParameterNotFound") {
            console.error(`Parameter not found: ${parameterName}`);
            return undefined;
        }
        console.error("Error retrieving SSM parameter:", error);
        throw error;
    }
};
