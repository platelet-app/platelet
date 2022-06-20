/* Amplify Params - DO NOT EDIT
	API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT
	API_PLATELET_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
	STORAGE_PLATELETSTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
require("isomorphic-fetch");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const AWS = require("aws-sdk/global");
const AUTH_TYPE = require("aws-appsync").AUTH_TYPE;
const AWSAppSyncClient = require("aws-appsync").default;
const gql = require("graphql-tag");

const getUserQuery = gql`
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            cognitoId
            tenantId
        }
    }
`;

const getUserByCognitoIdQuery = gql`
    query GetUserByCognitoId($cognitoId: ID!) {
        getUserByCognitoId(cognitoId: $cognitoId) {
            items {
                id
                tenantId
            }
        }
    }
`;

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

const expiryTime = 3600;

const putObjectParams = {
    Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
};

async function generatePresignedUrl(Key) {
    // Create a presigned URL for the bucket and key.
    const client = new S3Client({ region: process.env.REGION });
    const command = new PutObjectCommand({ ...putObjectParams, Key });
    return await getSignedUrl(client, command, { expiresIn: expiryTime });
}

async function getUser(userId) {
    return await appSyncClient.query({
        query: getUserQuery,
        variables: {
            id: userId,
        },
    });
}
async function getUserByCognitoId(cognitoId) {
    return await appSyncClient.query({
        query: getUserByCognitoIdQuery,
        variables: {
            cognitoId,
        },
    });
}

exports.handler = async (event) => {
    console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`);
    if (!event.arguments.userId)
        return new Promise((_, reject) => reject("No userId provided"));
    const userResult = await getUser(event.arguments.userId);
    const user = userResult.data.getUser;
    console.log("user:", user);
    if (!user) return new Promise((_, reject) => reject("User not found"));
    if (event.identity.claims["cognito:groups"].includes("ADMIN")) {
        let tenantId = event.identity.claims["custom:tenantId"];
        // for some reason this isn't always defined
        // get it from the API if it isn't
        if (!tenantId) {
            const adminResult = await getUserByCognitoId(
                event.identity.claims.sub
            );
            const admin = adminResult.data.getUserByCognitoId.items[0];
            console.log("admin:", admin);
            tenantId = admin.tenantId;
        }
        if (user.tenantId === tenantId) {
            return generatePresignedUrl(`public/${event.arguments.userId}.jpg`);
        } else {
            return new Promise((_, reject) =>
                reject("User is not part of this tenant")
            );
        }
    }
    console.log("user:", user);
    if (event.identity.claims.sub === user.cognitoId) {
        return generatePresignedUrl(`public/${event.arguments.userId}.jpg`);
    } else {
        return new Promise((_, reject) => reject("User is not authorized"));
    }
};
