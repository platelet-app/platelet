import React from "react";
import * as models from "../../../models";
import { Button, Grid, Skeleton } from "@mui/material";
import NotFound from "../../../ErrorComponents/NotFound";
import GetError from "../../../ErrorComponents/GetError";
import useModelSubscription from "../../../hooks/useModelSubscription";
import ScheduledTaskOverviewLocations from "./ScheduledTaskOverviewLocations";
import { useTheme } from "@mui/material/styles";
import ScheduledTaskOverviewSummaryAndItems from "./ScheduledTaskOverviewSummaryAndItems";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";

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
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles?.includes(models.Role.ADMIN);
    const theme = useTheme();

    const handleDisable = async () => {
        const existing = await DataStore.query(
            models.ScheduledTask,
            scheduledTaskId
        );
        if (existing) {
            await DataStore.save(
                models.ScheduledTask.copyOf(existing, (updated) => {
                    updated.disabled = 1;
                })
            );
        }
    };
    const handleEnable = async () => {
        const existing = await DataStore.query(
            models.ScheduledTask,
            scheduledTaskId
        );
        if (existing) {
            await DataStore.save(
                models.ScheduledTask.copyOf(existing, (updated) => {
                    updated.disabled = 0;
                })
            );
        }
    };

    if (isFetching) {
        return <Skeleton variant="rectangular" height={118} />;
    } else if (error) {
        return <GetError />;
    } else if (notFound) {
        return <NotFound />;
    } else if (state) {
        return (
            <Grid container spacing={1}>
                {isAdmin && (
                    <Grid item>
                        {state.disabled === 0 && (
                            <Button
                                sx={{ width: 80 }}
                                color="error"
                                variant="outlined"
                                onClick={handleDisable}
                            >
                                Disable
                            </Button>
                        )}
                        {state.disabled === 1 && (
                            <Button
                                sx={{ width: 80 }}
                                color="success"
                                variant="outlined"
                                onClick={handleEnable}
                            >
                                Enable
                            </Button>
                        )}
                    </Grid>
                )}

                <Grid container item direction="row" spacing={1}>
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
            </Grid>
        );
    } else {
        return null;
    }
};

export default ScheduledTaskOverview;
