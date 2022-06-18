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
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

exports.handler = (event, context) => {
    console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`);
    console.log(`context = ${JSON.stringify(context, null, 2)}`);
    console.log(process.env);
    if (
        //event.identity.claims["custom:tenantId"] === event.source.tenantId &&
        event.identity.claims["cognito:groups"].includes("ADMIN") ||
        event.identity.claims.sub === event.source.cognitoId
    ) {
        return generatePresignedUrl(`public/${event.source.id}.jpg`);
    } else {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
};
