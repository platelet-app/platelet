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

const expiryTime = 3600;

const getObjectParams = {
    Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
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

async function getCachedImageKey(key, width, height) {
    key = key.split(".")[0];
    const imageKey = `${key}-${width}-${height}`;
    // check if image exists on the bucket
    const getObjectParams = {
        Bucket: process.env.STORAGE_PLATELETSTORAGE_BUCKETNAME,
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

exports.handler = async (event) => {
    console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`);
    try {
        let { width, height } = event.arguments || {
            width: null,
            height: null,
        };
        const imageKey = event.source.profilePicture
            ? event.source.profilePicture.key || null
            : null;
        if (!imageKey) return null;
        if (!width || !height) {
            return generatePresignedUrl(imageKey);
        }
        const cachedImageKey = await getCachedImageKey(imageKey, width, height);

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
        console.log(error);
        return null;
    }
};
