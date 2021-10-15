import React from "react";
import {PaddedPaper} from "../styles/common";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function NotFound(props) {
    return (
        <PaddedPaper>
            <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
                <Grid item>
                    <Typography variant={"h4"}>
                        This page not found.
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography>
                        {props.children}
                    </Typography>
                </Grid>
            </Grid>
        </PaddedPaper>
    )
}

export default NotFound;
