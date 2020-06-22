import Grid from "@material-ui/core/Grid";
import {Skeleton} from "@material-ui/lab";
import React from "react";

export default function LoginSkeleton(props) {
    return (
        <Skeleton variant="text" width={600} height={400}/>
    )
}
