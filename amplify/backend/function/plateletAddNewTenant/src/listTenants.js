const gql = require("graphql-tag");

exports.listTenants = gql`
    query ListTenants(
        $filter: ModelTenantFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
                referenceIdentifier
                createdAt
                updatedAt
                _version
                _deleted
                _lastChangedAt
            }
            nextToken
            startedAt
        }
    }
`;
