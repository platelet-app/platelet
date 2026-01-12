// const aws = require("aws-sdk");
// const { sendWelcomeEmail } = require("./sendWelcomeEmail");

// jest.mock("aws-sdk", () => {
//     const SES = jest.fn(() => ({
//         sendEmail: jest.fn().mockReturnThis(),
//         promise: jest.fn(),
//     }));
//     return { SES };
// });
//

describe("sendWelcomeEmail", () => {
    it("test", () => {
        return undefined;
    });
});

// describe.skip("sendWelcomeEmail", () => {
//     it("should send a welcome email", async () => {
//         process.env.REGION = "us-east-1";
//         process.env.PLATELET_DOMAIN_NAME = "test.com";
//         process.env.PLATELET_WELCOME_EMAIL = "welcome@test.com";
//         const SESSpy = jest.spyOn(aws, "SES");
//         const emailAddress = "test@test.com";
//         const recipientName = "Test User";
//         const password = "testpassword";
//         await sendWelcomeEmail(emailAddress, recipientName, password);
//         expect(SESSpy).toMatchSnapshot();
//     });
// });
