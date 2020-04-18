import React from "react";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

export default function CommentsSkeleton(props) {
    return (
            <Grid container
                  spacing={1}
                  direction={"column"}
                  alignItems={"center"}
                  justify={"flex-start"}
            >
                {[...Array(props.count ? props.count : 10)].map((x, i) =>
                    <Grid item key={i}>
                        <Skeleton variant="text" width={280} height={200}/>
                    </Grid>)}
            </Grid>
    )
}
