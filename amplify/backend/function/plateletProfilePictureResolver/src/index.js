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

const {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const S3 = new AWS.S3({
    signatureVersion: "v4",
});

const { Sha256 } = require("@aws-crypto/sha256-js");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { default: fetch, Request } = require("node-fetch");

const GRAPHQL_ENDPOINT = process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT;

const getUser = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            profilePicture {
                bucket
                key
                region
            }
        }
    }
`;

const expiryTime = 3600;

const getObjectParams = {
    Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
};

let makeNewRequest = async (query, variables) => {
    const endpoint = new URL(GRAPHQL_ENDPOINT);
    const signer = new SignatureV4({
        credentials: defaultProvider(),
        region: process.env.REGION,
        service: "appsync",
        sha256: Sha256,
    });

    const requestToBeSigned = new HttpRequest({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            host: endpoint.host,
        },
        hostname: endpoint.host,
        body: JSON.stringify({
            query,
            variables,
        }),
        path: endpoint.pathname,
    });

    const signed = await signer.sign(requestToBeSigned);
    return new Request(endpoint, signed);
};

const client = new S3Client({ region: process.env.REGION });

async function generatePresignedUrl(Key) {
    // Create a presigned URL for the bucket and key.
    const command = new GetObjectCommand({ ...getObjectParams, Key });
    return await getSignedUrl(client, command, { expiresIn: expiryTime });
}

async function resizeImage(image, width, height) {
    const imageBuffer = await sharp(image).resize(width, height).toBuffer();
    return imageBuffer;
}

async function downloadImageFromBucket(Key) {
    const getObjectParams = {
        Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
        Key,
    };
    const response = await S3.getObject(getObjectParams).promise();
    // convert to an image that can be used by sharp
    return response.Body;
}

async function getCachedImageKey(key, bucket, width, height) {
    key = key.split(".")[0];
    const imageKey = `${key}-${width}-${height}.jpg`;
    // check if image exists on the bucket
    const getObjectParams = {
        Bucket: bucket,
        Key: imageKey,
    };
    const command = new GetObjectCommand({ ...getObjectParams });
    try {
        await client.send(command);
    } catch (error) {
        if (error.Code === "NoSuchKey") {
            console.log("NoSuchKey");
            return null;
        } else {
            throw error;
        }
    }
    console.log("Key exists", imageKey);
    return imageKey;
}

const getUserProfilePicture = async (id) => {
    const variables = { id };
    const request = await makeNewRequest(getUser, variables);
    console.log("Get use variables:", variables);
    const response = await fetch(request);
    const data = await response.json();
    console.log(data);
    return data.data.getUser.profilePicture || null;
};

exports.handler = async (event) => {
    console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`);
    try {
        let { width, height, userId } = event.arguments || {
            width: null,
            height: null,
        };
        const profilePicture = await getUserProfilePicture(userId);
        const imageKey = profilePicture ? profilePicture.key || null : null;
        const bucket = profilePicture ? profilePicture.bucket || null : null;
        if (!imageKey) return null;
        if (!width || !height) {
            return generatePresignedUrl(imageKey);
        }

        let cachedImageKey = null;
        if (bucket) {
            cachedImageKey = await getCachedImageKey(
                imageKey,
                bucket,
                width,
                height
            );
        }

        if (cachedImageKey) {
            return generatePresignedUrl(cachedImageKey);
        } else {
            console.log("making image");
            const image = await downloadImageFromBucket(imageKey);
            const resized = await resizeImage(image, width, height);
            const key = imageKey.split(".")[0];
            const newKey = `${key}-${width}-${height}.jpg`;
            const putObjectParams = {
                Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
                Key: newKey,
                Body: resized,
            };
            const command = new PutObjectCommand(putObjectParams);
            await client.send(command);
            return generatePresignedUrl(newKey);
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};
