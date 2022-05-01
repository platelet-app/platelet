const gql = require("graphql-tag");

exports.deleteTenant = gql`
    mutation DeleteTenant(
        $input: DeleteTenantInput!
        $condition: ModelTenantConditionInput
    ) {
        deleteTenant(input: $input, condition: $condition) {
            id
            name
            referenceIdentifier
            admin {
                id
                username
                cognitoId
                tenantId
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
                profilePictureURL
                profilePictureThumbnailURL
                profilePicture {
                    bucket
                    key
                    region
                }
                profilePictureThumbnail {
                    bucket
                    key
                    region
                }
                comments {
                    nextToken
                    startedAt
                }
                assignments {
                    nextToken
                    startedAt
                }
                createdTasks {
                    nextToken
                    startedAt
                }
                active
                createdAt
                updatedAt
                _version
                _deleted
                _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            tenantAdminId
        }
    }
`;
