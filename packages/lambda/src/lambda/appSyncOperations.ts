import awsCrypto from "@aws-crypto/sha256-js";
import awsProvider from "@aws-sdk/credential-provider-node";
import sig from "@aws-sdk/signature-v4";
import http from "@aws-sdk/protocol-http";
import { Request } from "node-fetch";
import fetch from "node-fetch";

const { Sha256 } = awsCrypto;
const { defaultProvider } = awsProvider;
const { SignatureV4 } = sig;
const { HttpRequest } = http;

export const request = async (
    queryDetails: { query: string; variables: any },
    appsyncUrl: string
) => {
    const endpoint = new URL(appsyncUrl);
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
        body: JSON.stringify(queryDetails),
        path: endpoint.pathname,
    });

    const signed = await signer.sign(requestToBeSigned);
    const request = new Request(endpoint, signed);
    console.log("Signed request: ", request);
    return await fetch(request);
};

export const errorCheck = (body: any) => {
    if (body?.errors) {
        console.error(body?.errors);
        throw new Error(body?.errors[0].message);
    }
};
