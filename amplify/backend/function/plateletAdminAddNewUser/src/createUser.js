const gql = require("graphql-tag");

exports.createUser = gql`
    mutation CreateUser(
        $input: CreateUserInput!
        $condition: ModelUserConditionInput
    ) {
        createUser(input: $input, condition: $condition) {
            id
            username
            cognitoId
            tenantId
            contact {
                emailAddress
            }
            displayName
            name
            roles
            dateOfBirth
            riderResponsibility
            disabled
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
