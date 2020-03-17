import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {StyledAddCircleOutlineDisabled, StyledAddCircleOutline} from "../css/common";
import {StyledAddCircleOutlineSmallDisabled, StyledAddCircleOutlineSmall} from "../css/common";


export function AddCircleButton(props) {
    return (
        <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.disabled ? <StyledAddCircleOutlineDisabled/> : <StyledAddCircleOutline/>}
        </IconButton>
    );
}
export function AddCircleButtonSmall(props) {
    return (
        <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.disabled ? <StyledAddCircleOutlineSmallDisabled/> : <StyledAddCircleOutlineSmall/>}
        </IconButton>
    );
}
