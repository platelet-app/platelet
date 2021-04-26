import * as factoryFunctions from "./reduxActionsFactory";

const actions = {
    request: "TEST_PREFIX_REQUEST",
    success: "TEST_PREFIX_SUCCESS",
    failure: "TEST_PREFIX_FAILURE",
    notFound: "TEST_PREFIX_NOT_FOUND",
    forbidden: "TEST_PREFIX_FORBIDDEN",
};

describe("check factory functions for redux requests", () => {
    it("takes a prefix and generates request and failure actions for it", () => {
        const prefix = "test_prefix";
        expect(factoryFunctions.createRequestActions(prefix)).toEqual(actions);
    });

    it("takes a set of actions and creates action functions for them", () => {
        const expected = {
            testPrefixRequest: input => ({type: "TEST_PREFIX_REQUEST", input}),
            testPrefixSuccess: data => ({type: "TEST_PREFIX_SUCCESS", data}),
            testPrefixFailure: error => ({type: "TEST_PREFIX_FAILURE", error}),
            testPrefixNotFound: error => ({type: "TEST_PREFIX_NOT_FOUND", error}),
            testPrefixForbidden: error => ({type: "TEST_PREFIX_FORBIDDEN", error})
        };
        const requestFunctions = factoryFunctions.createRequestFunctions(actions)
        expect(Object.keys(requestFunctions)).toEqual(
            Object.keys(expected)
        );
        const expectedReturns = {};
        const actualReturns = {};
        for (const [key, value] of Object.entries(expected)) {
            if (["TEST_PREFIX_FAILURE", "TEST_PREFIX_NOT_FOUND", "TEST_PREFIX_FORBIDDEN"].includes(key))
                expectedReturns[key] = value(new Error());
            else
                expectedReturns[key] = value({data: "aaa"});
        }
        for (const [key, value] of Object.entries(requestFunctions)) {
            if (["TEST_PREFIX_FAILURE", "TEST_PREFIX_NOT_FOUND", "TEST_PREFIX_FORBIDDEN"].includes(key))
                actualReturns[key] = value(new Error());
            else
                actualReturns[key] = value({data: "aaa"});
        }
        expect(expectedReturns).toEqual(actualReturns);
    });
});
