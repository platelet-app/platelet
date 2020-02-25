import React from "react";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

export default function FormSkeleton(props) {
    return (
            <Grid container
                  spacing={3}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"stretch"}
            >
                {[...Array(props.count ? props.count : 10)].map((x, i) =>
                    <Grid item xs sm md lg key={i}>
                        <Skeleton variant="text" width={500} height={100}/>
                    </Grid>)}
            </Grid>
    )
}
