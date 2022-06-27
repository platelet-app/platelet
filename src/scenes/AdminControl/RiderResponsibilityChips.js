import { DataStore } from "aws-amplify";
import { Box, Chip, Grid, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as models from "../../models";
import { convertListDataToObject } from "../../utilities";

export function RiderResponsibilityChips() {
    const [state, setState] = useState([]);
    const observer = useRef({ unsubscribe: () => {} });
    async function getResponsibilityChips() {
        observer.current = DataStore.observeQuery(
            models.RiderResponsibility
        ).subscribe(({ items }) => {
            setState(convertListDataToObject(items));
        });
        return () => observer.current.unsubscribe();
    }

    useEffect(() => getResponsibilityChips(), []);

    return (
        <Box sx={{ maxWidth: 1280 }}>
            <Grid container spacing={1} direction="row">
                {Object.entries(state).map(([key, value]) => (
                    <Grid item>
                        <Chip key={key} label={value.label} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
