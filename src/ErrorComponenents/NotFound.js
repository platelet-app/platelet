import React from "react";
import {PaddedPaper} from "../css/common";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export default function NotFound(props) {
    return (
        <PaddedPaper>
            <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
                <Grid item>
                    <Typography style={{fontSize: "20px"}}>
                        This page not found.
                    </Typography>
                </Grid>
                <Grid item>
                    {props.children}
                </Grid>
            </Grid>
        </PaddedPaper>
    )
}