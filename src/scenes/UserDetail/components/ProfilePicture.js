import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Paper, Stack } from "@mui/material";
import ProfilePictureCropper from "./ProfilePictureCropper";
import uploadProfilePicture from "./uploadProfilePicture";
import { generateS3Link } from "../../../amplifyUtilities";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";
import * as models from "../../../models";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

export default function ProfilePicture(props) {
    const [image, setImage] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [resetProfilePicture, setResetProfilePicture] = useState(false);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();

    const picturePermission =
        whoami.roles.includes(models.Role.ADMIN) || whoami.id === props.userId;

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
        try {
            const blob = await new Promise((resolve) =>
                canvasResult.toBlob(resolve, "image/jpeg")
            );
            const newImageURL = await canvasResult.toDataURL("image/jpeg");

            await uploadProfilePicture(props.userId, blob);
            setNewImage(newImageURL);
            setUploading(false);
            setImage(null);
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
            setUploading(false);
        }
    };

    const handleDiscard = () => {
        setImage(null);
        setResetProfilePicture(!resetProfilePicture);
    };

    const getProfilePicture = React.useCallback(async (profilePicture) => {
        if (profilePicture && profilePicture.key) {
            try {
                const profilePictureResult = await generateS3Link(
                    profilePicture.key
                );
                if (profilePictureResult) {
                    setImageUrl(profilePictureResult);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            setImageUrl("");
        }
    }, []);
    useEffect(
        () => getProfilePicture(props.profilePicture),
        [props.profilePicture, getProfilePicture]
    );

    const profilePicture = image ? (
        <ProfilePictureCropper
            key={
                resetProfilePicture
                    ? "reset-profile-picture"
                    : "profile-picture"
            }
            onDiscard={handleDiscard}
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
                {picturePermission && props.editable && picUploadButton}
            </Stack>
        </Paper>
    );
}
