import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {StyledAddCircleOutlineDisabled, StyledAddCircleOutline} from "../styles/Buttons";
import {StyledAddCircleOutlineSmallDisabled, StyledAddCircleOutlineSmall} from "../styles/Buttons";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";


export function AddCircleButton(props) {
    return (
        <Tooltip title={props.tooltip}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={props.onClick}
                disabled={props.disabled}
                className={props.className}
            >
                {props.disabled ? <StyledAddCircleOutlineDisabled/> : <StyledAddCircleOutline/>}
            </IconButton>
        </Tooltip>
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
            className={props.className}
        >
            {props.disabled ? <StyledAddCircleOutlineSmallDisabled/> : <StyledAddCircleOutlineSmall/>}
        </IconButton>
    );
}
