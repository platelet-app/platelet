import { Auth, Storage } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../../../graphql/queries";
import aws_config from "../../../aws-exports";
import { updateUser } from "../../../graphql/mutations";

// const client = new AWSAppSyncClient({
//     url: aws_config.aws_appsync_graphqlEndpoint,
//     region: aws_config.aws_appsync_region,
//     auth: aws_config.aws_appsync_authenticationType,
//     complexObjectsCredentials: () => Auth.currentCredentials(),
// });

async function uploadProfilePicture(userId, selectedFile) {
    if (selectedFile) {
        const { type: mimeType } = selectedFile;

        const bucket = aws_config.aws_user_files_s3_bucket;
        const region = aws_config.aws_user_files_s3_bucket_region;
        const visibility = "public";
        const { identityId } = await Auth.currentCredentials();

        const key = `${visibility}/${identityId}/${userId}.jpg`;

        const file = {
            bucket,
            key,
            region,
        };

        try {
            /*const result = await client.mutate({
                mutation: gql(updateUser),
                variables: {
                    input: {
                        id: userId,
                        profilePicture: file,
                    },
                },
            });*/
            const existingUser = await API.graphql(
                graphqlOperation(getUser, { id: userId })
            );
            await Storage.put(`${identityId}/${userId}.jpg`, selectedFile, {
                contentType: mimeType,
                level: visibility,
            });
            await API.graphql(
                graphqlOperation(updateUser, {
                    input: {
                        id: userId,
                        _version: existingUser.data.getUser._version,
                        profilePicture: file,
                    },
                })
            );
        } catch (err) {
            console.log("error uploading file", err);
        }
    }
}

export default uploadProfilePicture;
