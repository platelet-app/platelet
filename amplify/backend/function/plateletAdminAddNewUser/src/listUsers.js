const gql = require("graphql-tag");

exports.listUsers = gql`
    query ListUsers($tenantId: ID!) {
        listUsers(filter: { tenantId: { eq: $tenantId } }) {
            items {
                displayName
            }
        }
    }
`;
