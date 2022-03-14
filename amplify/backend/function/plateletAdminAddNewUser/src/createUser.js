const gql = require("graphql-tag");

exports.createUser = gql`
    mutation CreateUser(
        $input: CreateUserInput!
        $condition: ModelUserConditionInput
    ) {
        createUser(input: $input, condition: $condition) {
            id
            cognitoId
            tenantId
            contact {
                emailAddress
            }
            displayName
            name
            roles
            active
            createdAt
            updatedAt
            _version
            _deleted
        }
    }
`;
