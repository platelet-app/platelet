import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Grid";

export default function CardsGridSkeleton (props) {
    return <>
        <Grid container
              spacing={3}
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
        >
        {
            [...Array(props.count ? props.count : 100)].map((x, i) =>
                <Grid key={i} item xs={10} sm={5} md={4} lg={3}>
                    <Skeleton variant="rectangular" width={200} height={200} />
                </Grid>)
        }
        </Grid>
    </>;
}