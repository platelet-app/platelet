import React from "react";
import {TextFieldControlled} from "../TextFieldControlled";
import Grid from "@material-ui/core/Grid";

export default function TaskModalNameAndContactNumber(props) {
    return (
        <Grid container direction={"column"}>
            <Grid item>
            <TextFieldControlled
                value={props.contactName}
                label={"Name"}
                id={"contact-name"}
                onChange={props.onSelectName}/>
            </Grid>
            <Grid item>
            <TextFieldControlled
                label={"Telephone"}
                id={"contact-number"}
                value={props.contactNumber}
                onChange={props.onSelectContactNumber}/>
            </Grid>
        </Grid>

    )
}
