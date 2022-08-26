/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const aws = require("aws-sdk");

async function sendFeedbackEmail(body, senderEmail = null) {
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.REGION,
    });
    const returnEmailAddress =
        senderEmail || process.env.PLATELET_SEND_TO_EMAIL_ADDRESS;
    const params = {
        Destination: {
            ToAddresses: [returnEmailAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: body,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: body,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Feedback from",
            },
        },
        Source: returnEmailAddress,
        ReplyToAddresses: [returnEmailAddress],
        ReturnPath: returnEmailAddress,
    };

    return await ses.sendEmail(params).promise();
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
