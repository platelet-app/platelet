/* Amplify Params - DO NOT EDIT
	API_PLATELET_ADDRESSANDCONTACTDETAILSTABLE_ARN
	API_PLATELET_ADDRESSANDCONTACTDETAILSTABLE_NAME
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	API_PLATELET_USERTABLE_ARN
	API_PLATELET_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var aws = require("aws-sdk"),
    documentClient = new aws.DynamoDB.DocumentClient();
var ddb = new aws.DynamoDB();

exports.handler = async (event, context) => {
    const date = new Date();
    console.log(event);
    console.log(event.request);

    if (event.request.userAttributes.sub) {
        const contactDetailsParams = {
            Item: {
                id: { S: context.awsRequestId },
                emailAddress: { S: event.request.userAttributes.email },
                createdAt: { S: date.toISOString() },
                updatedAt: { S: date.toISOString() },
                _lastChangedAt: { N: date.getTime().toString() },
                _version: { N: "1" },
            },
            TableName:
                process.env.API_PLATELET_ADDRESSANDCONTACTDETAILSTABLE_NAME,
            ReturnValues: "ALL_OLD",
        };

        const userParams = {
            Item: {
                id: { S: event.request.userAttributes.sub },
                userContactId: { S: context.awsRequestId },
                __typename: { S: "User" },
                name: { S: event.request.userAttributes.name },
                displayName: { S: event.request.userAttributes.name },
                active: { N: "1" },
                roles: { SS: ["COORDINATOR"] },
                username: { S: event.userName },
                createdAt: { S: date.toISOString() },
                updatedAt: { S: date.toISOString() },
                _lastChangedAt: { N: date.getTime().toString() },
                _version: { N: "1" },
            },
            TableName: process.env.API_PLATELET_USERTABLE_NAME,
        };

        // Call DynamoDB
        try {
            await ddb.putItem(contactDetailsParams).promise();
            await ddb.putItem(userParams).promise();
            console.log("Success");
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Success: Everything executed correctly");
        context.done(null, event);
    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Error: Nothing was written to DynamoDB");
        context.done(null, event);
    }
};
