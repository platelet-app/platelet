import React from "react";
import * as models from "../../../models";
import { Grid, Skeleton } from "@mui/material";
import NotFound from "../../../ErrorComponents/NotFound";
import GetError from "../../../ErrorComponents/GetError";
import useModelSubscription from "../../../hooks/useModelSubscription";
import ScheduledTaskOverviewLocations from "./ScheduledTaskOverviewLocations";
import { useTheme } from "@mui/material/styles";
import ScheduledTaskOverviewSummaryAndItems from "./ScheduledTaskOverviewSummaryAndItems";

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
    const theme = useTheme();

    if (isFetching) {
        return <Skeleton variant="rectangular" height={118} />;
    } else if (error) {
        return <GetError />;
    } else if (notFound) {
        return <NotFound />;
    } else if (state) {
        return (
            <Grid container direction="row" spacing={1}>
                <Grid
                    sx={{
                        width: "100%",
                        [theme.breakpoints.up("sm")]: {
                            width: 0,
                            minWidth: 425,
                        },
                    }}
                    item
                >
                    <ScheduledTaskOverviewSummaryAndItems
                        scheduledTask={state}
                    />
                </Grid>
                <Grid
                    sx={{
                        width: "100%",
                        [theme.breakpoints.up("sm")]: {
                            width: 0,
                            minWidth: 425,
                        },
                    }}
                    item
                >
                    <ScheduledTaskOverviewLocations scheduledTask={state} />
                </Grid>
            </Grid>
        );
    } else {
        return null;
    }
};

export default ScheduledTaskOverview;
