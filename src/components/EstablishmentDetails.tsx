import React, { useState } from "react";
import ClearButtonWithConfirmation from "./ClearButtonWithConfirmation";
import FavouriteLocationsSelect from "./FavouriteLocationsSelect";
import {
    Button,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import ConfirmationDialog from "./ConfirmationDialog";
import * as models from "../models";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { tenantIdSelector } from "../redux/Selectors";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";

type EstablishmentDetailsProps = {
    value: models.Location | null;
    onChangeEstablishmentSameAsPickUp?: (value: boolean) => void;
    sameAsPickUp?: boolean;
    onSelect: (value: models.Location | null) => void;
};

const EstablishmentDetails: React.FC<EstablishmentDetailsProps> = ({
    value,
    onChangeEstablishmentSameAsPickUp,
    sameAsPickUp = false,
    onSelect,
}) => {
    const [notListedWindow, setNotListedWindow] = useState(false);
    const [notListedName, setNotListedName] = useState("");
    const dispatch = useDispatch();
    const tenantId = useSelector(tenantIdSelector);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const handleNotListedConfirmation = () => {
        if (!tenantId) {
            console.log("tenantId is required");
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
        setNotListedWindow(false);
        if (onChangeEstablishmentSameAsPickUp)
            onChangeEstablishmentSameAsPickUp(false);
        const newEstablishment = new models.Location({
            name: notListedName,
            listed: 0,
            tenantId,
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
                {onChangeEstablishmentSameAsPickUp && value.listed === 1 && (
                    <FormControlLabel
                        labelPlacement="start"
                        checked={sameAsPickUp}
                        color="secondary"
                        onChange={() =>
                            onChangeEstablishmentSameAsPickUp(!sameAsPickUp)
                        }
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
                        sx={{ minWidth: isSm ? 240 : 340, marginTop: 1 }}
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
};

export default EstablishmentDetails;
