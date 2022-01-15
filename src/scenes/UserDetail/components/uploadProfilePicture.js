import { Auth, Storage } from "aws-amplify";
import { DataStore } from "aws-amplify";
import aws_config from "../../../aws-exports";
import { S3ObjectAccessLevels } from "../../../apiConsts";
import * as models from "../../../models";

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
            const existingUser = await DataStore.query(models.User, userId);
            await Storage.put(`${userId}.jpg`, selectedFile, {
                bucket: process.env.REACT_APP_RESIZE_BUCKET_NAME,
                contentType: mimeType,
                level: visibility,
            });
            await DataStore.save(
                models.User.copyOf(existingUser, (updated) => {
                    updated.profilePicture = file;
                    updated.profilePictureThumbnail = thumbnailFile;
                })
            );
        } catch (err) {
            console.log("error uploading file", err);
        }
    }
}

export default uploadProfilePicture;
