import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Grid";

export default function DeliverablesSkeleton(props) {
    return (
        <Grid container
              spacing={1}
              direction={"column"}
              alignItems={"center"}
              justifyContent={"flex-start"}
        >
            {[...Array(props.count ? props.count : 4)].map((x, i) =>
                <Grid item key={i}>
                    <Skeleton variant="text" width={280} height={100}/>
                </Grid>)}
        </Grid>
    );
}
