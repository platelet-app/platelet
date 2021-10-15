import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Grid";

export default function MenuSkeleton(props) {
    return (
            <Grid container
                  spacing={3}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"center"}
            >
                {[...Array(props.count ? props.count : 6)].map((x, i) =>
                    <Grid item xs sm md lg key={i}>
                        <Skeleton variant="text" width={200} height={30}/>
                    </Grid>)}
            </Grid>
    )
}
