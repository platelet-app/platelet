import React from "react";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

export default function DetailSkeleton(props) {
    return (
            <Grid container
                  spacing={1}
                  direction={"column"}
                  justify={"flex-start"}
                  alignItems={"center"}
            >
                {[...Array(props.count ? props.count : 1)].map((x, i) =>
                    <Grid item key={i}>
                        <Skeleton variant="text" width={600} height={500}/>
                    </Grid>)}
            </Grid>
    )
}
