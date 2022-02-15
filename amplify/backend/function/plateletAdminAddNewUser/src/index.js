/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	AUTH_PLATELET61A0AC07_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require("isomorphic-fetch");
const aws = require("aws-sdk");
const gql = require("graphql-tag");
const AWS = require("aws-sdk/global");
const AUTH_TYPE = require("aws-appsync").AUTH_TYPE;
const AWSAppSyncClient = require("aws-appsync").default;
const uuid = require("uuid");

const createUser = gql`
    mutation CreateUser(
        $input: CreateUserInput!
        $condition: ModelUserConditionInput
    ) {
        createUser(input: $input, condition: $condition) {
            id
            cognitoId
            tenantId
            contact {
                name
                telephoneNumber
                mobileNumber
                emailAddress
                ward
                line1
                line2
                line3
                town
                county
                state
                country
                postcode
                what3words
            }
            displayName
            name
            roles
            dateOfBirth
            active
        }
    }
`;

async function inviteNewUserToTeam(newUser, tenantId) {
    const userPoolId = process.env.AUTH_PLATELET61A0AC07_USERPOOLID;
    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const cognitoClient = new CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
    });

    const cognitoResp = await cognitoClient
        .adminCreateUser({
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            UserAttributes: [
                {
                    Name: "email",
                    Value: newUser.email,
                },
                {
                    Name: "custom:tenantId",
                    Value: tenantId,
                },
            ],
            UserPoolId: userPoolId,
            Username: uuid.v4(),
        })
        .promise();

    if (!cognitoResp.User) {
        throw new Error(
            `Failure to create new user with email ${newUser.email}`
        );
    }
    const newUsername = cognitoResp.User.Username;
    const config = {
        url: process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT,
        region: process.env.REGION,
        auth: {
            type: AUTH_TYPE.AWS_IAM,
            credentials: AWS.config.credentials,
        },
        disableOffline: true,
    };

    const appSyncClient = new AWSAppSyncClient(config);
    // const listUsers = gql`
    //     query ListUsers {
    //         listUsers(filter: { tenantId: { eq: ${tenantId} } }) {
    //             items {
    //                 displayName
    //             }
    //         }
    //     }
    // `;
    // const listUsersResp = await appSyncClient.query({
    //     query: listUsers,
    // });
    // let displayName = null;
    // const userCheck = listUsersResp.items;
    // let counter = 0;
    // while (!displayName) {
    //     const current =
    //         counter === 0 ? newUser.name : `${newUser.name}-${counter}`;
    //     if (userCheck.map((u) => u.displayName).includes(current)) {
    //         counter++;
    //     } else {
    //         displayName = current;
    //         break;
    //     }
    // }
    // console.log(displayName);
    // if (!newUsername) {
    //     throw new Error(`missing username attribute for newly created user`);
    // }
    // console.log(newUser);
    const subFind = cognitoResp.User.Attributes.find(
        (attr) => attr.Name === "sub"
    );
    if (!subFind) {
        throw new Error(`missing sub attribute for newly created user`);
    }
    const cognitoId = subFind.Value;
    if (!cognitoId) {
        throw new Error(`missing cognitoId attribute for newly created user`);
    }
    const createUserInput = {
        tenantId: tenantId,
        active: 1,
        cognitoId,
        name: newUser.name,
        displayName: newUser.name,
        roles:
            newUser.roles && newUser.roles.includes("USER")
                ? newUser.roles
                : ["USER"],
        contact: { emailAddress: newUser.email },
    };

    await appSyncClient.mutate({
        mutation: createUser,
        variables: { input: createUserInput },
    });
}

exports.handler = async (event) => {
    const tenantId = event.arguments.tenantId;
    const user = {
        name: event.arguments.name,
        email: event.arguments.email,
        roles: event.arguments.roles || ["USER"],
    };
    await inviteNewUserToTeam(user, tenantId);
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
        //  },
        body: JSON.stringify("user created"),
    };
    return response;
};
