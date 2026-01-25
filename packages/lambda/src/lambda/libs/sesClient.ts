import { SESClient } from "@aws-sdk/client-ses";
const REGION = process.env.REGION || "eu-west-1";
const sesClient = new SESClient({ region: REGION });
export { sesClient };
