import { API, graphqlOperation } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";
import { DataStore } from "aws-amplify";
import { S3ObjectAccessLevels } from "../../../apiConsts";
import * as models from "../../../models";
import * as queries from "../../../graphql/queries";
import _ from "lodash";
import { ProfilePictureUploadURLQuery } from "../../../API";

async function uploadProfilePicture(userId: string, selectedFile: any) {
    if (selectedFile) {
        const amplifyConfig = localStorage.getItem("amplifyConfig");
        let aws_config;
        if (amplifyConfig) {
            aws_config = JSON.parse(amplifyConfig);
        } else {
            const config = require("../../../aws-exports");
            aws_config = config;
        }
        if (!aws_config || _.isEmpty(aws_config))
            throw new Error("No amplify config found");
        const bucket = aws_config ? aws_config.aws_user_files_s3_bucket : null;
        const region = aws_config
            ? aws_config.aws_user_files_s3_bucket_region
            : null;
        const visibility = S3ObjectAccessLevels.public;

        const key = `${visibility}/${userId}.jpg`;

        if (!bucket || !region)
            throw new Error(
                `No bucket or no region found: ${bucket} ${region}`
            );

        const file = {
            bucket,
            key,
            region,
        };

        try {
            const uploadUrlData = await API.graphql<
                GraphQLQuery<ProfilePictureUploadURLQuery>
            >(
                graphqlOperation(queries.profilePictureUploadURL, {
                    userId,
                })
            );

            const uploadUrl = uploadUrlData?.data?.profilePictureUploadURL;
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
            if (!existingUser) throw new Error("No user found");
            await DataStore.save(
                models.User.copyOf(existingUser, (updated) => {
                    updated.profilePicture = file;
                })
            );
            // just to generate the scaled files in the bucket
            // add 5 second delay because it doesn't work otherwise for some reason
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await API.graphql(
                graphqlOperation(queries.profilePictureURL, {
                    userId,
                    width: 300,
                    height: 300,
                })
            );
            await API.graphql(
                graphqlOperation(queries.profilePictureURL, {
                    userId,
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
