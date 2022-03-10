import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Paper, Stack } from "@mui/material";
import ProfilePictureCropper from "./ProfilePictureCropper";
import uploadProfilePicture from "./uploadProfilePicture";
import { generateS3Link } from "../../../amplifyUtilities";

export default function ProfilePicture(props) {
    const [image, setImage] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

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
        setUploading(true);
        const blob = await new Promise((resolve) =>
            canvasResult.toBlob(resolve, "image/jpeg")
        );
        const newImageURL = await canvasResult.toDataURL("image/jpeg");
        setNewImage(newImageURL);
        await uploadProfilePicture(props.userId, blob);
        setUploading(false);
        setImage(null);
    };

    async function getProfilePicture() {
        if (props.profilePicture && props.profilePicture.key) {
            try {
                const profilePicture = await generateS3Link(
                    props.profilePicture.key
                );
                if (profilePicture) {
                    setImageUrl(profilePicture);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    useEffect(() => getProfilePicture(), [props.profilePicture]);

    const profilePicture = image ? (
        <ProfilePictureCropper
            isPosting={uploading}
            onFinish={sendPictureData}
            image={image}
        />
    ) : (
        <img
            width={300}
            height={300}
            alt={props.altText}
            src={newImage || imageUrl}
        />
    );

    const picUploadButton =
        process.env.REACT_APP_DEMO_MODE === "true" || image ? (
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
                        {props.profilePicture ? "Change" : "Upload Picture"}
                    </Button>
                </label>
            </>
        );

    return (
        <Paper sx={{ width: 370, height: 400, padding: 4 }}>
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
