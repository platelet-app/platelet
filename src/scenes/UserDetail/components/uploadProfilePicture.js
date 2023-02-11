import { API, graphqlOperation, Storage } from "aws-amplify";
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
        process.env.REACT_APP_DEMO_MODE === "false") &&
    process.env.JEST_WORKER_ID === undefined
) {
    aws_config = require("../../../aws-exports");
}

const getProfilePictureUrlQuery = `
  query GetUser($id: ID! $width: Int $height: Int) {
    getUser(id: $id) {
      profilePictureURL(width: $width height: $height)
    }
  }
`;

async function uploadProfilePicture(userId, selectedFile) {
    if (selectedFile) {
        const bucket = aws_config.default
            ? aws_config.default.aws_user_files_s3_bucket
            : null;
        const region = aws_config.default
            ? aws_config.default.aws_user_files_s3_bucket_region
            : null;
        const visibility = S3ObjectAccessLevels.public;

        const key = `${visibility}/${userId}.jpg`;

        const file = {
            bucket,
            key,
            region,
        };

        try {
            const uploadUrlData = await API.graphql(
                graphqlOperation(queries.profilePictureUploadURL, {
                    userId,
                })
            );

            const uploadUrl = uploadUrlData.data.profilePictureUploadURL;
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
            // just to generate the scaled files in the bucket
            // add 5 second delay because it doesn't work otherwise for some reason
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await API.graphql(
                graphqlOperation(getProfilePictureUrlQuery, {
                    id: userId,
                    width: 300,
                    height: 300,
                })
            );
            await API.graphql(
                graphqlOperation(getProfilePictureUrlQuery, {
                    id: userId,
                    width: 128,
                    height: 128,
                })
            );
        } catch (err) {
            console.log("error uploading file", err);
        }
    }
}

export default uploadProfilePicture;
