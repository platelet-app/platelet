import React from "react";
import * as models from "../../../models";
import { Grid, Skeleton, Stack, Typography } from "@mui/material";
import useModelQuery from "../../../hooks/useModelQuery";
import NotFound from "../../../ErrorComponents/NotFound";
import GetError from "../../../ErrorComponents/GetError";
import ScheduledTaskOverviewSummary from "./ScheduledTaskOverviewSummary";
import useModelSubscription from "../../../hooks/useModelSubscription";
import ScheduledTaskOverviewLocations from "./ScheduledTaskOverviewLocations";

type ScheduledTaskOverviewProps = {
    scheduledTaskId: string;
};

const ScheduledTaskOverview: React.FC<ScheduledTaskOverviewProps> = ({
    scheduledTaskId,
}) => {
    const { state, isFetching, error, notFound } = useModelSubscription(
        models.ScheduledTask,
        scheduledTaskId
    );

    if (isFetching) {
        return <Skeleton variant="rectangular" height={118} />;
    } else if (error) {
        return <GetError />;
    } else if (notFound) {
        return <NotFound />;
    } else if (state) {
        return (
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <ScheduledTaskOverviewSummary scheduledTask={state} />
                </Grid>
                <Grid item>
                    <ScheduledTaskOverviewLocations scheduledTask={state} />
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
};

export default ScheduledTaskOverview;
