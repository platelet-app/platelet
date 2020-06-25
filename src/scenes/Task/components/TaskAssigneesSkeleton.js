import React from "react";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

export default function TaskAssigneesSkeleton(props) {
    return (
        <Grid container
              spacing={1}
              direction={"column"}
              alignItems={"center"}
              justify={"flex-start"}
        >
            {[...Array(props.count ? props.count : 4)].map((x, i) =>
                <Grid item key={i}>
                    <Skeleton variant="text" width={280} height={100}/>
                </Grid>)}
        </Grid>
    )
}
