import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient();

const getParam = async (paramName: string) => {
    const params = {
        Name: paramName,
    };
    const command = new GetParameterCommand(params);
    try {
        const response = await client.send(command);
        // The value is nested under Parameter.Value
        return response.Parameter?.Value;
    } catch (error) {
        if (error.name === "ParameterNotFound") {
            console.error(`Parameter not found: ${paramName}`);
            return undefined;
        }
        console.error("Error retrieving SSM parameter:", error);
        throw error;
    }
};
export const getEmailSSMParams = async () => {
    const fromEmailParameterName = `/platelet-supporting-cdk/${process.env.ENV}/FromEmail`;
    const domainParameterName = `/platelet-supporting-cdk/${process.env.ENV}/DomainName`;
    const fromEmail = await getParam(fromEmailParameterName);
    const domainName = await getParam(domainParameterName);
    if (!fromEmail) {
        throw new Error(`Missing SSM parameter: ${fromEmailParameterName}`);
    }
    if (!domainName) {
        throw new Error(`Missing SSM parameter: ${domainParameterName}`);
    }
    return { fromEmail, domainName };
};
