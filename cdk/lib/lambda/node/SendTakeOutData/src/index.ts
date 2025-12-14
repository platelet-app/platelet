import type { LambdaEvent, LambdaReturn } from "./interfaces.js";
import nodemailer from "nodemailer";
import {
    request,
    errorCheck,
    getUserProfilePictures,
} from "@platelet-app/lambda";
import { getUser } from "./queries.js";
import type { User } from "@platelet-app/types";
import {
    S3Client,
    DeleteObjectCommand,
    PutObjectCommand,
    type ListObjectsV2CommandOutput,
    CopyObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const TAKE_OUT_BUCKET = process.env.TAKE_OUT_BUCKET;
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const REGION = process.env.REGION;

const writeToBucket = async (data: User, key: string) => {
    const json = JSON.stringify(data);
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });
    await s3Client.send(
        new PutObjectCommand({
            Bucket: TAKE_OUT_BUCKET,
            Body: json,
            Key: key,
        })
    );
};

const writeProfilePictures = async (
    pictures: ListObjectsV2CommandOutput,
    sourceBucket: string,
    userId: string
) => {
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });
    for (const pic of pictures.Contents || []) {
        const command = new CopyObjectCommand({
            CopySource: `/${sourceBucket}/${pic.Key}`,
            Bucket: TAKE_OUT_BUCKET,
            Key: `${userId}/${pic.Key}`,
        });
        await s3Client.send(command);
    }
};

const deleteTakeOutFile = async (key: string) => {
    const config = {};
    const client = new S3Client(config);
    const input = {
        Bucket: TAKE_OUT_BUCKET,
        Key: key,
    };
    const command = new DeleteObjectCommand(input);
    await client.send(command);
};

const getUserFunction = async (userId: string, endpoint: string) => {
    const variables = {
        id: userId,
    };
    const response = await request({ query: getUser, variables }, endpoint);
    const body = await response.json();
    errorCheck(body);
    return body?.data?.getUser;
};

function getS3File(item: string) {
    const s3Client = new S3Client({ region: REGION || "eu-west-1" });
    const input = {
        Bucket: TAKE_OUT_BUCKET,
        Key: item,
    };
    const command = new GetObjectCommand(input);
    return s3Client.send(command);
}

const sendEmail = async (
    emailAddress: string,
    recipientName: string,
    attachmentKey: string
) => {
    const html = `
<p>
    Dear ${recipientName}
</p>
<p>
    Please find attached your requested take out data.
</p>
<p>
    Thank you.
</p>
`;

    const file = await getS3File(attachmentKey);
    const content = await file.Body?.transformToString();
    var mailOptions = {
        from: "noreply@platelet.app",
        subject: "Your requested take out data",
        html,
        to: emailAddress,
        // bcc: Any BCC address you want here in an array,
        attachments: [
            {
                filename: "An Attachment.pdf",
                content,
            },
        ],
    };

    console.log("Creating SES transporter");
    // create Nodemailer SES transporter
    //
    const sesClient = new SESv2Client({ region: REGION || "eu-west-1" });
    var transporter = nodemailer.createTransport({
        SES: { sesClient, SendEmailCommand },
    });

    // send email
    transporter.sendMail(mailOptions);
};

export const handler = async (event: LambdaEvent): Promise<LambdaReturn> => {
    console.log("send take out data", event);
    const { userId, retryCount } = event;
    if (!GRAPHQL_ENDPOINT) {
        throw new Error("Missing env variables");
    }
    const user = await getUserFunction(userId, GRAPHQL_ENDPOINT);
    writeToBucket(user, `${userId}/user.json`);
    if (user?.profilePicture) {
        const pictures = await getUserProfilePictures(user.profilePicture);
        await writeProfilePictures(
            pictures,
            user.profilePicture.bucket,
            userId
        );
    }
    await sendEmail(user?.contact?.emailAddress, user?.name, user.id);
    await deleteTakeOutFile(user.id);
    return { retryCount, userId };
};
