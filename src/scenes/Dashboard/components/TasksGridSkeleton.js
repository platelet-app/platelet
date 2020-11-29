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
              style={{paddingLeft: "15px"}}
        >
            {[...Array(props.count ? props.count : 3)].map((x, i) =>
                <Grid item key={i}>
                    <Grid container direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
                        {[...Array( 10)].map((y, z) =>
                            <Grid item>
                                {z === 0 ? <Skeleton variant="rect" width={400} height={100}/> : <Skeleton variant="rect" width={400} height={250}/>}
                            </Grid>
                        )}
                    </Grid>
                </Grid>)}
        </Grid>
    )
}
