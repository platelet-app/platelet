export const deleteUser = /* GraphQL */ `
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
