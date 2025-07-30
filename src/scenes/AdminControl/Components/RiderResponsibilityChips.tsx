import { DataStore } from "aws-amplify";
import { Box, Chip, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as models from "../../../models";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";

export function RiderResponsibilityChips() {
    const [state, setState] = useState<models.RiderResponsibility[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [editItem, setEditItem] = useState<models.RiderResponsibility | null>(
        null
    );
    const [errorState, setErrorState] = useState<Error | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const observer = DataStore.observeQuery(
                models.RiderResponsibility
            ).subscribe(({ items }) => {
                setState(items);
            });
            return observer.unsubscribe;
        } catch (error) {
            if (error instanceof Error) {
                setErrorState(error);
            }
        }
    }, []);

    const handleClickChip = (item: models.RiderResponsibility) => {
        setEditItem(item);
        setInputValue(item.label);
    };

    const onSave = async () => {
        try {
            if (editItem) {
                const existing = await DataStore.query(
                    models.RiderResponsibility,
                    editItem.id
                );
                if (!existing) {
                    throw new Error("Rider responsibility not found");
                }
                await DataStore.save(
                    models.RiderResponsibility.copyOf(existing, (upd) => {
                        upd.label = inputValue;
                    })
                );
                setEditItem(null);
                setInputValue("");
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };

    if (errorState) {
        return <div>Sorry, something went wrong</div>;
    } else {
        return (
            <Box sx={{ maxWidth: 1280 }}>
                <Grid container spacing={1} direction="row">
                    {Object.entries(state).map(([key, value]) => (
                        <Grid key={key} item>
                            <Chip
                                onClick={() => handleClickChip(value)}
                                label={value.label}
                            />
                        </Grid>
                    ))}
                </Grid>
                <ConfirmationDialog
                    disabled={!!!inputValue}
                    onConfirmation={onSave}
                    onCancel={() => setEditItem(null)}
                    open={!!editItem}
                >
                    <TextField
                        value={inputValue}
                        label="Label"
                        inputProps={{ "aria-label": "edit label" }}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </ConfirmationDialog>
            </Box>
        );
    }
}
