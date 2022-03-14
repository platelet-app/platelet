const gql = require("graphql-tag");

exports.deleteUser = gql`
    mutation DeleteUser(
        $input: DeleteUserInput!
        $condition: ModelUserConditionInput
    ) {
        deleteUser(input: $input, condition: $condition) {
            id
            cognitoId
        }
    }
`;
