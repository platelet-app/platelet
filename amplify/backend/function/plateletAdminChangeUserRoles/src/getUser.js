const gql = require("graphql-tag");

exports.getUser = gql`
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            tenantId
            cognitoId
            displayName
            roles
            username
            createdAt
            updatedAt
            _lastChangedAt
            _version
        }
    }
`;
