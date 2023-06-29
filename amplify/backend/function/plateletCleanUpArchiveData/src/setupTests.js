process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT =
    "https://api.example.com/graphql";
process.env.API_PLATELET_GRAPHQLAPIIDOUTPUT = "test";
process.env.REGION = "someregion";
process.env.PLATELET_ARCHIVE_DAYS = "30";

require("jest-fetch-mock").enableMocks();
