const gql = require("graphql-tag");

exports.getUser = gql`
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            _version
            roles
            username
        }
    }
`;
