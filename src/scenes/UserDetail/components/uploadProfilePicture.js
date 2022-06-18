import { API, Auth, graphqlOperation } from "aws-amplify";
import { DataStore } from "aws-amplify";
import { S3ObjectAccessLevels } from "../../../apiConsts";
import * as models from "../../../models";
import * as queries from "../../../graphql/queries";

let aws_config = {
    default: {
        aws_user_files_s3_bucket: "",
        aws_user_files_s3_bucket_region: "",
    },
};

if (
    (!process.env.REACT_APP_OFFLINE_ONLY ||
        process.env.REACT_APP_OFFLINE_ONLY === "false") &&
    (!process.env.REACT_APP_DEMO_MODE ||
        process.env.REACT_APP_DEMO_MODE === "false")
) {
    aws_config = require("../../../aws-exports");
}

async function uploadProfilePicture(userId, selectedFile) {
    if (selectedFile) {
        const bucket = aws_config.default
            ? aws_config.default.aws_user_files_s3_bucket
            : null;
        const region = aws_config.default
            ? aws_config.default.aws_user_files_s3_bucket_region
            : null;
        const visibility = S3ObjectAccessLevels.public;

        const key = `public/${userId}.jpg`;

        const file = {
            bucket,
            key,
            region,
        };

        const thumbnailFile = {
            ...file,
            key: `${visibility}/${userId}_thumbnail.jpg`,
        };

        try {
            const uploadUrlData = await API.graphql(
                graphqlOperation(queries.getUser, {
                    id: userId,
                })
            );

            const uploadUrl =
                uploadUrlData.data.getUser.profilePictureUploadURL;
            if (!uploadUrl) throw new Error("No upload URL found");

            await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    Accept: "image/jpeg",
                    "Content-Type": "image/jpeg",
                },
                body: selectedFile,
            });

            const existingUser = await DataStore.query(models.User, userId);
            await DataStore.save(
                models.User.copyOf(existingUser, (updated) => {
                    updated.profilePicture = file;
                })
            );
        } catch (err) {
            console.log("error uploading file", err);
        }
    }
}

export default uploadProfilePicture;
