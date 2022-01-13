import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Box, Paper, Stack } from "@mui/material";
import ProfilePictureCropper from "./ProfilePictureCropper";
import uploadProfilePicture from "./uploadProfilePicture";
import { AmplifyS3Image } from "@aws-amplify/ui-react";

export default function ProfilePicture(props) {
    const [image, setImage] = useState("");

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const sendPictureData = async (canvasResult) => {
        console.log("canvasResult", canvasResult);
        await canvasResult.toBlob(async (file) => {
            uploadProfilePicture(props.userId, file);
        }, "image/jpeg");
        setImage(null);
    };

    console.log(props.imgKey);

    // remove extra prefix from imgKey
    let imgKey = null;
    if (props.imgKey) {
        const imgKeySplit = props.imgKey.split("/");
        const [, , ...imgKeyRest] = imgKeySplit;
        imgKey = imgKeyRest.join("/");
    }

    console.log(imgKey);

    const profilePicture = image ? (
        <ProfilePictureCropper onFinish={sendPictureData} image={image} />
    ) : (
        <Box sx={{ position: "relative", width: 300, height: 300 }}>
            <AmplifyS3Image
                imgProps={{
                    style: {
                        "--width": "300px",
                        "--height": "300px",
                    },
                }}
                level="protected"
                alt={props.altText}
                imgKey={imgKey}
            />
        </Box>
    );

    const picUploadButton = image ? (
        <></>
    ) : (
        <>
            <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={onChange}
            />
            <label htmlFor="raised-button-file">
                <Button variant="raised" component="span">
                    {props.pictureURL ? "Change" : "Upload Picture"}
                </Button>
            </label>
        </>
    );

    return (
        <Paper sx={{ width: 370, height: 370, padding: 4 }}>
            <Stack
                container
                direction={"column"}
                alignItems={"center"}
                spacing={2}
            >
                {profilePicture}
                {props.editable ? picUploadButton : <></>}
            </Stack>
        </Paper>
    );
}
