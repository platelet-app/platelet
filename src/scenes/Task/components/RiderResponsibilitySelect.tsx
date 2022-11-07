import React from "react";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { Chip, Grid, Typography } from "@mui/material";

interface RiderResponsibilitySelectPropsInterface {
    value: string | null;
    onSelect: (value: string | null) => void;
}

const RiderResponsibilitySelect: React.FC<RiderResponsibilitySelectPropsInterface> =
    ({ value, onSelect }) => {
        const [errorState, setErrorState] = React.useState(null);
        const [responsibilities, setResponsibilities] = React.useState<
            models.RiderResponsibility[]
        >([]);
        const getAvailableRiderResponsibilities =
            React.useCallback(async () => {
                try {
                    const result = await DataStore.query(
                        models.RiderResponsibility
                    );
                    setResponsibilities(result);
                } catch (e: any) {
                    console.log(e);
                    setErrorState(e);
                }
            }, []);
        React.useEffect(() => {
            getAvailableRiderResponsibilities();
        }, [getAvailableRiderResponsibilities]);

        const handleClick = (responsibility: string) => {
            if (responsibility === value) {
                onSelect(null);
            } else {
                onSelect(responsibility);
            }
        };

        if (errorState) {
            return <Typography>Something went wrong</Typography>;
        } else {
            return (
                <Grid container spacing={1}>
                    {responsibilities.map((responsibility) => (
                        <Grid item key={responsibility.id}>
                            <Chip
                                label={responsibility.label}
                                aria-label={responsibility.label}
                                onClick={() =>
                                    handleClick(responsibility.label)
                                }
                                variant={
                                    responsibility.label === value
                                        ? "filled"
                                        : "outlined"
                                }
                                color={
                                    value === responsibility.label
                                        ? "primary"
                                        : "default"
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            );
        }
    };

export default RiderResponsibilitySelect;
