export const getUser = `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            username
            cognitoId
            tenantId
            isPrimaryAdmin
            contact {
                name
                telephoneNumber
                mobileNumber
                emailAddress
                ward
                line1
                line2
                line3
                town
                county
                state
                country
                postcode
                what3words
            }
            displayName
            name
            roles
            dateOfBirth
            riderResponsibility
            profilePicture {
                bucket
                key
                region
            }
            disabled
            createdAt
            updatedAt
            _deleted
            _version
            _deleted
            _lastChangedAt
        }
    }
`;
