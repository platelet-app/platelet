import ToggleTimeStamp from "../ToggleTimeStamp";
import {DateAndTimePicker} from "../DateTimePickers";
import Grid from "@material-ui/core/Grid";
import React from "react";

export default function TaskModalTimePicker(props) {
    return (
        <Grid container spacing={2} direction={"column"} alignItems={"flex-start"} justify={"center"}>
            <Grid item>
            <ToggleTimeStamp label={props.label} status={!!props.time}
                             onSelect={props.onToggle} disabled={props.disabled}/>
            </Grid>
            <Grid item>
            <DateAndTimePicker visible={!!props.time} value={props.time} label={props.label}
                               onChange={props.onChange} disabled={props.disabled}/>
            </Grid>
    </Grid>
    )
}