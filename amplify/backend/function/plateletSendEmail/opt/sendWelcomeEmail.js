const aws = require("aws-sdk");
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

const getSSMParams = async () => {
    const fromEmailParameterName = `/platelet-supporting-cdk/${process.env.ENV}/fromEmail`;
    const domainParameterName = `/platelet-supporting-cdk/${process.env.ENV}/domainName`;
    const fromEmail = await getParam(fromEmailParameterName);
    const domainName = await getParam(domainParameterName);
    if (!fromEmail) {
        throw new Error("No from email!");
    }
    if (!domainName) {
        throw new Error("No domain name!");
    }
    return { fromEmail, domainName };
};

exports.sendWelcomeEmail = async (emailAddress, recipientName, password) => {
    const { fromEmail, domainName } = await getSSMParams();
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.REGION,
    });
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
                        An admin has created your account for you with a temporary password.
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
                    An admin has created your account for you. A temporary password has been generated for you.
                    Username: ${emailAddress}
                    Password: ${password}
                    This temporary password will expire in one week.
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

    return await ses.sendEmail(params).promise();
};

exports.sendTenantWelcomeEmail = async (
    emailAddress,
    recipientName,
    password
) => {
    const { fromEmail, domainName } = await getSSMParams();
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: process.env.REGION,
    });
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

    return await ses.sendEmail(params).promise();
};
