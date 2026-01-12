process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT =
    "https://api.example.com/graphql";
process.env.API_PLATELET_GRAPHQLAPIIDOUTPUT = "test";
process.env.REGION = "someregion";
process.env.AWS_DEFAULT_REGION = "eu-west-1";
process.env.AWS_ACCESS_KEY_ID = "someAccessKeyId";
process.env.AWS_SECRET_ACCESS_KEY = "someSecretAccessKey";

require("jest-fetch-mock").enableMocks();
