import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./libs/sesClient.js";

const createSendEmailCommand = (
    toAddress: string,
    htmlBody: string,
    textBody: string,
    subject: string
) => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: "noreply@platelet.app",
    });
};

export const sendPlateletEmail = async (
    recipientEmail: string,
    htmlBody: string,
    textBody: string,
    subject: string
) => {
    const sendEmailCommand = createSendEmailCommand(
        recipientEmail,
        htmlBody,
        textBody,
        subject
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};
