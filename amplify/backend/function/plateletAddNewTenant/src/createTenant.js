const gql = require("graphql-tag");

exports.createTenant = gql`
    mutation CreateTenant($input: CreateTenantInput!) {
        createTenant(input: $input) {
            referenceIdentifier
        }
    }
`;
