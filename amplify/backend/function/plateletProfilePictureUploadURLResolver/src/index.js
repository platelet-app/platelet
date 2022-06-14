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
const AWS = require("aws-sdk");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const expiryTime = 3600;

const bucketParams = {
    Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
    Key: null,
    Expires: expiryTime,
};

async function generatePresignedUrl(Key) {
    // Create a presigned URL for the bucket and key.
    return s3.getSignedUrl("putObject", { ...bucketParams, Key });
}

exports.handler = (event, context, callback) => {
    console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`);
    console.log(`context = ${JSON.stringify(context, null, 2)}`);
    console.log(process.env);
    if (
        //event.identity.claims["custom:tenantId"] === event.source.tenantId &&
        event.identity.claims["cognito:groups"].includes("ADMIN") ||
        event.identity.claims.sub === event.source.cognitoId
    ) {
        return generatePresignedUrl(`public/${event.source.id}`);
    } else {
        return null;
    }
};
