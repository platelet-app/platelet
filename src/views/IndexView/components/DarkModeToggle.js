import React from "react";
import {IconButton, Tooltip} from "@material-ui/core";
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh';
import Brightness4Icon from '@material-ui/icons/Brightness4';

function DarkModeToggle(props) {
    return (
        <Tooltip title={"Toggle dark/light mode"}>
            <IconButton onClick={props.onClick}>
                {props.themeMode === "light" ? <BrightnessHighIcon/> : <Brightness4Icon/>}
            </IconButton>
        </Tooltip>
    )
}

export default DarkModeToggle;
