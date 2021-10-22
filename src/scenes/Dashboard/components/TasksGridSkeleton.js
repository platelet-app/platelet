import React from "react";
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types"
function TasksGridSkeleton(props) {

    return (
        <Grid container
              spacing={3}
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              style={{paddingLeft: "15px"}}
        >
            {[...Array(props.count)].map((x, i) =>
                <Grid item key={i}>
                    <Grid container direction={"column"} spacing={3} justifyContent={"center"} alignItems={"flex-start"}>
                        <Grid item>
                            <Skeleton variant="rectangular" width={370} height={100}/>
                        </Grid>
                        {[...Array( 10)].map((y, z) =>
                            <Grid item key={`${z}_${i}`}>
                                <Skeleton variant="rectangular" width={370} height={250}/>
                            </Grid>
                        )}
                    </Grid>
                </Grid>)}
        </Grid>
    );
}

TasksGridSkeleton.prototypes = {
    count: PropTypes.number
};

TasksGridSkeleton.defaultProps = {
    count: 3
};

export default TasksGridSkeleton
