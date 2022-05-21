import { DataStore } from "aws-amplify";
import { Box, Chip, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as models from "../../models";
import { useSelector } from "react-redux";
import { dataStoreModelSyncedStatusSelector } from "../../redux/Selectors";
import { convertListDataToObject } from "../../utilities";
import { getDeliverableIconByEnum } from "../../utilities";

export function DeliverableTypeChips() {
    const [state, setState] = useState([]);
    const observer = useRef({ unsubscribe: () => {} });

    const deliverableTypeModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).DeliverableType;

    async function getDeliverableChips() {
        const deliverables = await DataStore.query(models.DeliverableType);
        setState(convertListDataToObject(deliverables));
        observer.current.unsubscribe();
        observer.current = DataStore.observe(models.DeliverableType).subscribe(
            (update) => {
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
            }
        );
    }

    useEffect(() => getDeliverableChips(), [deliverableTypeModelSynced]);

    return (
        <Box sx={{ maxWidth: 1280 }}>
            <Grid container spacing={1} direction="row">
                {Object.entries(state).map(([key, value]) => (
                    <Grid item>
                        <Chip
                            avatar={
                                <Box>
                                    {getDeliverableIconByEnum(value.icon, 3)}
                                </Box>
                            }
                            key={key}
                            label={value.label}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
