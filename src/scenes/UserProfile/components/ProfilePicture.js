import React, {useEffect, useRef, useState} from "react";
import Cropper from "react-cropper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {PaddedPaper} from "../../../styles/common";
import "cropperjs/dist/cropper.css";
import {uploadUserProfilePictureRequest} from "../../../redux/users/UsersActions";
import {useDispatch, useSelector} from "react-redux";
import {createErrorSelector, createPostingSelector} from "../../../redux/LoadingSelectors";


export default function ProfilePicture(props) {
    const [image, setImage] = useState("");
    const [newImage, setNewImage] = useState("")
    const [cropper, setCropper] = useState();
    const postingSelector = createPostingSelector(["UPLOAD_USER_PROFILE_PICTURE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const errorSelector = createErrorSelector(["UPLOAD_USER_PROFILE_PICTURE"]);
    const isError = useSelector(state => errorSelector(state));
    const dispatch = useDispatch();
    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            // ignore first run
            firstUpdate.current = false;
        } else {
            if (!isPosting) {
                setImage("")
            }
        }
    }, [isPosting])

    useEffect(() => {
        if (isError) {
            setNewImage("");
        }
    }, [isError])

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

    const sendPictureData = () => {
        if (typeof cropper !== "undefined") {
            const dataUURL = cropper.getCroppedCanvas().toDataURL("image/jpeg");
            dispatch(uploadUserProfilePictureRequest(
                {
                    userUUID: props.userUUID,
                    payload: {image_data: dataUURL.split(';base64,')[1]}
                }));
            setNewImage(dataUURL);
        }
    };


    const profilePicture = image ?
        <Cropper
            style={{height: 300, width: "50%"}}
            initialAspectRatio={1}
            aspectRatio={1}
            src={image}
            viewMode={2}
            guides={true}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            maxCropBoxHeight={300}
            maxCropBoxWidth={300}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
                setCropper(instance);
            }}
        /> : <img width={300} height={300} alt={props.altText} src={newImage || props.pictureURL}/>

    const picUploadButton = image ?
        <Grid container direction={"row"} justify={"space-between"}>
            <Grid item>
                <Button disabled={isPosting} onClick={sendPictureData}>Finish</Button>
            </Grid>
            <Grid item>
                <Button disabled={isPosting} onClick={() => setImage("")}>Discard</Button>
            </Grid>
        </Grid>
        :
        <>
            <input
                accept="image/*"
                style={{display: 'none'}}
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

    return (
        <PaddedPaper minWidth={"360px"} minHeight={"360px"}>
            <Grid container direction={"column"} spacing={2}>
                <Grid item>
                    {profilePicture}
                </Grid>
                <Grid item>
                    {props.editable ? picUploadButton : <></>}
                </Grid>
                <Grid item>
                </Grid>
            </Grid>
        </PaddedPaper>
    );
};
