/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

import { request, errorCheck } from "@platelet-app/lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { mutations } from "@platelet-app/graphql";

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;
const USER_POOL_ID = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;

const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    isPrimaryAdmin
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
`;

const getStateMachineArn = async (envName) => {
    const client = new SSMClient();
    const parameterName = `/platelet-supporting-cdk/${envName}/DeleteUserStateMachineArn`;
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

const getUserFunction = async (userId) => {
    const variables = {
        id: userId,
    };
    const response = await request(
        { query: getUser, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
    return body?.data?.getUser;
};

const startStepFunctionExecution = async (input) => {
    console.log("StepFunction input:", JSON.stringify(input));

    let stateMachineArn = await getStateMachineArn(process.env.ENV);

    console.log("ENV", process.env.ENV);

    if (!stateMachineArn) {
        console.log("No arn found for this environment, trying dev");
        stateMachineArn = await getStateMachineArn("dev");
    }
    if (!stateMachineArn) {
        throw new Error("Could not find any state machine ARN parameter");
    }

    const sfnClient = new SFNClient({});
    return await sfnClient.send(
        new StartExecutionCommand({
            stateMachineArn,
            input: JSON.stringify(input),
        })
    );
};

const markUserBeingDeleted = async (user) => {
    const variables = {
        input: {
            id: user.id,
            _version: user._version,
            isBeingDeleted: 1,
        },
    };
    const response = await request(
        { query: mutations.updateUser, variables },
        GRAPHQL_ENDPOINT
    );
    const body = await response.json();
    errorCheck(body);
};

export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const { userId } = event.arguments;

    if (!userId) {
        throw new Error("No userId");
    }

    const user = await getUserFunction(userId);

    if (user.isPrimaryAdmin) {
        throw new Error("Cannot delete the primary admin");
    }

    if (user._deleted) {
        throw new Error("User not found");
    }

    if (user.isBeingDeleted) {
        throw new Error("User is already being deleted");
    }

    await markUserBeingDeleted(user);

    const sfnParams = {
        userId,
        userPoolId: USER_POOL_ID,
        graphQLEndpoint: GRAPHQL_ENDPOINT,
    };

    const { executionArn, startDate } = await startStepFunctionExecution(
        sfnParams
    );

    return { executionArn, startDate };
};
