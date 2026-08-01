/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const client = new SSMClient();

const getParam = async (paramName) => {
    const params = {
        Name: paramName,
    };
    const command = new GetParameterCommand(params);
    try {
        const response = await client.send(command);
        // The value is nested under Parameter.Value
        return response.Parameter?.Value;
    } catch (error) {
        if (error.name === "ParameterNotFound") {
            console.error(`Parameter not found: ${paramName}`);
            return undefined;
        }
        console.error("Error retrieving SSM parameter:", error);
        throw error;
    }
};

const getEmailParam = async () => {
    const fromEmailParameterName = `/platelet-supporting-cdk/${process.env.ENV}/FromEmail`;
    const fromEmail = await getParam(fromEmailParameterName);
    if (!fromEmail) {
        throw new Error(`Missing SSM parameter: ${fromEmailParameterName}`);
    }
    return fromEmail;
};

const PLATELET_SEND_TO_EMAIL_ADDRESS = "info@platelet.app";

async function sendFeedbackEmail(body, senderEmail = null) {
    const fromEmail = await getEmailParam();
    const ses = new SESClient({
        region: process.env.REGION,
    });
    const plateletEmail = PLATELET_SEND_TO_EMAIL_ADDRESS;
    const Source = fromEmail;
    const returnEmailAddress = senderEmail || PLATELET_SEND_TO_EMAIL_ADDRESS;

    const sender = senderEmail || "No email.";

    let actualBody = `From: ${sender}

    ${body}`;

    actualBody = actualBody.split("\n").join("<br />");

    const params = {
        Destination: {
            ToAddresses: [plateletEmail],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: actualBody,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: actualBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Feedback from",
            },
        },
        Source,
        ReplyToAddresses: [returnEmailAddress],
    };

    const command = new SendEmailCommand(params);
    return await ses.send(command);
}

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const emailData = {
        emailAddress: event.arguments.emailAddress,
        body: event.arguments.body,
    };
    try {
        await sendFeedbackEmail(emailData.body, emailData.emailAddress);
        return { successState: true };
    } catch (e) {
        throw e;
    }
};
