import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import React from "react";

export default function SaveCancelButtons(props)
{
    return(
    <Grid container direction={"row"} justify={"space-between"} alignItems={"top"} spacing={3}>
        <Grid item>
            <Button disabled={props.disabled} onClick={props.onSave}>Save</Button>
        </Grid>
        <Grid item>
            <Button disabled={props.disabled} onClick={props.onCancel}>Cancel</Button>
        </Grid>
    </Grid>
    )
}