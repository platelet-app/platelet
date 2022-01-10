import React from "react";
import { PaddedPaper } from "../styles/common";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function GetError(props) {
    return (
        <PaddedPaper>
            <Grid
                container
                spacing={1}
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Grid item>
                    <Typography variant={"h4"}>
                        Sorry, something went wrong
                    </Typography>
                </Grid>
                <Grid item>{props.children}</Grid>
            </Grid>
        </PaddedPaper>
    );
}
