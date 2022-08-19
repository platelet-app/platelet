import { DataStore } from "aws-amplify";
import { Box, Chip, Grid, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as models from "../../../models";
import { convertListDataToObject } from "../../../utilities";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";

export function RiderResponsibilityChips() {
    const [state, setState] = useState({});
    const [inputValue, setInputValue] = useState("");
    const [editItem, setEditItem] = useState(null);
    const [errorState, setErrorState] = useState(null);
    const dispatch = useDispatch();

    const observer = useRef({ unsubscribe: () => {} });

    async function getResponsibilityChips() {
        try {
            const responsibilities = await DataStore.query(
                models.RiderResponsibility
            );
            setState(convertListDataToObject(responsibilities));
            observer.current = DataStore.observe(
                models.RiderResponsibility
            ).subscribe(({ element, opType }) => {
                if (opType === "INSERT") {
                    setState((prevState) => ({
                        ...prevState,
                        [element.id]: element,
                    }));
                } else if (opType === "UPDATE") {
                    setState((prevState) => ({
                        ...prevState,
                        [element.id]: {
                            ...prevState[element.id],
                            ...element,
                        },
                    }));
                } else if (opType === "DELETE") {
                    setState((prevState) => {
                        const { [element.id]: value, ...rest } = prevState;
                        return rest;
                    });
                }
            });
        } catch (error) {
            console.log(error);
            setErrorState(error);
        }
    }

    useEffect(() => getResponsibilityChips(), []);
    useEffect(() => () => observer.current.unsubscribe(), []);

    const handleClickChip = (item) => {
        setEditItem(item);
        setInputValue(item.label);
    };

    const onSave = async () => {
        try {
            await DataStore.save(
                models.RiderResponsibility.copyOf(
                    editItem,
                    (upd) => (upd.label = inputValue)
                )
            );
            setEditItem(null);
            setInputValue("");
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
