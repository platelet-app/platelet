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

const stateMachineArn =
    "arn:aws:states:eu-west-1:130063560692:stateMachine:DeleteUserStateMachinedevD78A4000-L1Y8SISzg4aQ";
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
    const sfnClient = new SFNClient({});
    return await sfnClient.send(
        new StartExecutionCommand({
            stateMachineArn,
            input: JSON.stringify(input),
        })
    );
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
