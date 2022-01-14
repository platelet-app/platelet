import { Auth, Storage } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../../../graphql/queries";
import aws_config from "../../../aws-exports";
import { updateUser } from "../../../graphql/mutations";
import { S3ObjectAccessLevels } from "../../../apiConsts";

async function uploadProfilePicture(userId, selectedFile) {
    if (selectedFile) {
        const { type: mimeType } = selectedFile;

        const bucket = aws_config.aws_user_files_s3_bucket;
        const region = aws_config.aws_user_files_s3_bucket_region;
        const visibility = S3ObjectAccessLevels.protected;
        const { identityId } = await Auth.currentCredentials();

        const key = `${visibility}/${identityId}/${userId}.jpg`;

        const file = {
            bucket,
            key,
            region,
        };

        const thumbnailFile = {
            ...file,
            key: `${visibility}/${identityId}/${userId}_thumbnail.jpg`,
        };

        try {
            const existingUser = await API.graphql(
                graphqlOperation(getUser, { id: userId })
            );
            await Storage.put(`${userId}.jpg`, selectedFile, {
                bucket: process.env.REACT_APP_RESIZE_BUCKET_NAME,
                contentType: mimeType,
                level: visibility,
            });
            await API.graphql(
                graphqlOperation(updateUser, {
                    input: {
                        id: userId,
                        _version: existingUser.data.getUser._version,
                        profilePicture: file,
                        profilePictureThumbnail: thumbnailFile,
                    },
                })
            );
        } catch (err) {
            console.log("error uploading file", err);
        }
    }
}

export default uploadProfilePicture;
