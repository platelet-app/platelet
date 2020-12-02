import React from "react";
import {Skeleton} from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

function TasksGridSkeleton(props) {

    return (
        <Grid container
              spacing={3}
              direction={"row"}
              justify={"flex-start"}
              alignItems={"center"}
              style={{paddingLeft: "15px"}}
        >
            {[...Array(props.count)].map((x, i) =>
                <Grid item key={i}>
                    <Grid key={i + 10} container direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
                        {[...Array( 10)].map((y, z) =>
                            <Grid item>
                                {z === 0 ? <Skeleton key={z + (i * 100)} variant="rect" width={370} height={100}/> : <Skeleton key={z + (i * 100)} variant="rect" width={370} height={250}/>}
                            </Grid>
                        )}
                    </Grid>
                </Grid>)}
        </Grid>
    )
}

TasksGridSkeleton.defaultProps = {
    count: 3
}

export default TasksGridSkeleton
