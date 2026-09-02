import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./libs/sesClient.js";
import { getEmailSSMParams } from "./getEmailSSMParams.js";

export const sendTenantWelcomeEmail = async (
    emailAddress: string,
    recipientName: string,
    password: string
) => {
    const { fromEmail, domainName } = await getEmailSSMParams();
    const params = {
        Destination: {
            ToAddresses: [emailAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <p>
                        Welcome to https://${domainName}, ${recipientName}!
                    </p>
                    <p>
                        Your account has been created. You can now start adding users to your team.
                    </p>
                    <p>
                        You will be asked to change your password on first log in.
                    </p>
                    <p>
                        <b>Username:</b> ${emailAddress}
                    </p>
                    <p>
                        <b>Password:</b> ${password}
                    </p>
                    <p>
                        <b>This temporary password will expire in one week.</b>
                    </p>
                    <p>
                        Thank you.
                    </p>
                    `,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: `Welcome to https://${domainName}, ${recipientName}!
                    Your account has been created. You can now start adding users to your team.
                    You will be asked to change your password on first log in.
                    Username: ${emailAddress}
                    Password: ${password}
                    Thank you.`,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Welcome to Platelet!",
            },
        },
        Source: fromEmail,
        ReplyToAddresses: [fromEmail],
        ReturnPath: fromEmail,
    };
    const sendEmailCommand = new SendEmailCommand(params);
    return await sesClient.send(sendEmailCommand);
};
