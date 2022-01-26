import { DataStore } from "aws-amplify";
import { Box, Chip, Grid, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as models from "../../models";
import { useSelector } from "react-redux";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import { convertListDataToObject } from "../../utilities";

export function RiderResponsibilityChips() {
    const [state, setState] = useState([]);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const observer = useRef({ unsubscribe: () => {} });
    async function getResponsibilityChips() {
        if (dataStoreReadyStatus) {
            const responsibilities = await DataStore.query(
                models.RiderResponsibility
            );
            setState(convertListDataToObject(responsibilities));
            observer.current.unsubscribe();
            observer.current = DataStore.observe(
                models.RiderResponsibility
            ).subscribe((update) => {
                if (update.opType === "INSERT") {
                    setState((prevState) => ({
                        ...prevState,
                        [update.element.id]: update.element,
                    }));
                } else if (update.opType === "UPDATE") {
                    setState((prevState) => ({
                        ...prevState,
                        [update.element.id]: {
                            ...prevState[update.element.id],
                            ...update.element,
                        },
                    }));
                } else if (update.opType === "REMOVE") {
                    setState((prevState) => {
                        const { [update.element.id]: value, ...rest } =
                            prevState;
                        return rest;
                    });
                }
            });
        }
    }

    useEffect(() => getResponsibilityChips(), [dataStoreReadyStatus]);

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
