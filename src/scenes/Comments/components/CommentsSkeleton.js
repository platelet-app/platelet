import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Grid";

export default function CommentsSkeleton(props) {
    return (
            <Grid container
                  spacing={1}
                  direction={"column"}
                  alignItems={"center"}
                  justify={"flex-start"}
            >
                {[...Array(props.count ? props.count : 1)].map((x, i) =>
                    <Grid item key={i}>
                        <Skeleton variant="text" width={280} height={200}/>
                    </Grid>)}
            </Grid>
    )
}
