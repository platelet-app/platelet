import React from 'react';
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

export default function CardsGridSkeleton (props) {
    return (
        <>
            <Grid container
                  spacing={3}
                  direction={"row"}
                  justify={"flex-start"}
                  alignItems={"center"}
            >
            {
                [...Array(props.count ? props.count : 100)].map((x, i) =>
                    <Grid key={i} item xs={10} sm={5} md={4} lg={3}>
                        <Skeleton variant="rect" width={200} height={200} />
                    </Grid>)
            }
            </Grid>
        </>
    )
}