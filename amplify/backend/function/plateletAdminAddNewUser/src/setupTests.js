process.env.NODE_ENV = "dev";
process.env.AUTH_PLATELET61A0AC07_USERPOOLID = "testPoolId";
process.env.API_PLATELET_GRAPHQLAPIENDPOINTOUTPUT = "testEndpoint";
process.env.PLATELET_WELCOME_EMAIL = "welcome@test.com";
process.env.PLATELET_DOMAIN_NAME = "test.com";

require("jest-fetch-mock").enableMocks();
