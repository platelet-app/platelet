import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient();

export const getSQSTrackingURL = async () => {
    const parameterName = "/platelet-platform-cdk/TrackingQueueURL";
    const params = {
        Name: parameterName,
    };
    const command = new GetParameterCommand(params);
    try {
        const response = await ssmClient.send(command);

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
