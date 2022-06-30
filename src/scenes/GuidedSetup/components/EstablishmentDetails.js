import React, { useState } from "react";
import ClearButtonWithConfirmation from "../../../components/ClearButtonWithConfirmation";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import {
    Button,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import * as models from "../../../models";
import { useTheme } from "@mui/styles";

function EstablishmentDetails({
    value,
    onChangeEstablishmentSameAsPickUp,
    sameAsPickUp,
    onSelect,
}) {
    const [notListedWindow, setNotListedWindow] = useState(false);
    const [notListedName, setNotListedName] = useState("");

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    const handleNotListedConfirmation = () => {
        setNotListedWindow(false);
        onChangeEstablishmentSameAsPickUp(false);
        const newEstablishment = new models.Location({
            name: notListedName,
            listed: 0,
        });
        onSelect(newEstablishment);
    };
    if (value) {
        return (
            <Stack direction="column" spacing={1}>
                <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    direction="row"
                >
                    <Typography>{value.name}</Typography>
                    <ClearButtonWithConfirmation onClear={() => onSelect(null)}>
                        <Typography>
                            Are you sure you want to clear the establishment?
                        </Typography>
                    </ClearButtonWithConfirmation>
                </Stack>
                {value.listed === 1 && (
                    <FormControlLabel
                        labelPlacement="start"
                        checked={sameAsPickUp}
                        color="secondary"
                        onChange={onChangeEstablishmentSameAsPickUp}
                        control={<Switch color="warning" defaultChecked />}
                        label="Same as pick-up?"
                        aria-label="toggle same as pick-up"
                    />
                )}
            </Stack>
        );
    } else {
        return (
            <Stack alignItems="flex-end" direction="column" spacing={1}>
                <FavouriteLocationsSelect
                    label="Select establishment"
                    size="large"
                    onSelect={onSelect}
                />
                <Button
                    onClick={() => setNotListedWindow(true)}
                    aria-label="establishment not listed?"
                >
                    Not listed?
                </Button>
                <ConfirmationDialog
                    dialogTitle={"Establishment name"}
                    onConfirmation={handleNotListedConfirmation}
                    fullScreen={isSm}
                    onCancel={() => {
                        setNotListedName("");
                        setNotListedWindow(false);
                    }}
                    disabled={!notListedName}
                    open={notListedWindow}
                >
                    <TextField
                        fullWidth
                        sx={{ minWidth: 340, marginTop: 1 }}
                        label="Name"
                        inputProps={{
                            "aria-label": "establishment name",
                        }}
                        value={notListedName}
                        onChange={(e) => setNotListedName(e.target.value)}
                    />
                </ConfirmationDialog>
            </Stack>
        );
    }
}

export default EstablishmentDetails;
