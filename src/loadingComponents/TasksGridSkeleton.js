import React from "react";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

export default function TasksGridSkeleton(props) {

    return (
        <Grid container
              spacing={3}
              direction={"row"}
              justify={"flex-start"}
              alignItems={"center"}
        >
            {[...Array(props.count ? props.count : 4)].map((x, i) =>
                <Grid item xs sm md lg key={i}>
                    <Skeleton variant="rect" width={350} height={1024}/>
                </Grid>)}
        </Grid>
    )
}
