import React, { useState } from "react";
import Cropper from "react-cropper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {PaddedPaper} from "../../../styles/common";
import "cropperjs/dist/cropper.css";



export default function ProfilePicture(props)
{
    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();


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

    const getCropData = () => {
        console.log(cropper.getData())
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getData());
        }
    };


    const profilePicture = image ?
        <Cropper
            style={{ height: 300, width: "50%" }}
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
        /> : <img alt={props.altText} src={props.pictureURL}/>

    const picUploadButton = image ?
        <Grid container direction={"row"}>
            <Grid item>
                <Button onClick={getCropData}>Post</Button>
            </Grid>
            <Grid item>
                <Button onClick={() => setImage("")}>Discard</Button>
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
                {picUploadButton}
                </Grid>
                <Grid item>
                </Grid>

            </Grid>
        </PaddedPaper>
    );
};
